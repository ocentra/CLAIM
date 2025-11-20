# PowerShell script to run tests with WSL Solana validator
# This script detects WSL IP and sets up the environment for running tests

# Initialize setup info array
$setupInfo = @()

Write-Host "Detecting WSL IP address..." -ForegroundColor Cyan
$setupInfo += "Detecting WSL IP address..."

# Get WSL IP address
$wslIp = $null
$wslIpStatus = "unknown"
try {
    $wslIp = (wsl hostname -I).Trim().Split()[0]
    if ([string]::IsNullOrWhiteSpace($wslIp)) {
        $wslIpStatus = "failed"
        $setupInfo += "ERROR: Could not detect WSL IP address"
        $setupInfo += "Make sure WSL is running and try: wsl hostname -I"
        Write-Host "ERROR: Could not detect WSL IP address" -ForegroundColor Red
        Write-Host "Make sure WSL is running and try: wsl hostname -I" -ForegroundColor Yellow
        exit 1
    }
    $wslIpStatus = "success"
    $setupInfo += "SUCCESS: WSL IP: $wslIp"
    Write-Host "SUCCESS: WSL IP: $wslIp" -ForegroundColor Green
} catch {
    $wslIpStatus = "error"
    $setupInfo += "ERROR: Error getting WSL IP: $_"
    $setupInfo += "Try manually setting: `$env:SOLANA_RPC_URL='http://<WSL_IP>:8899'"
    Write-Host "ERROR: Error getting WSL IP: $_" -ForegroundColor Red
    Write-Host "Try manually setting: `$env:SOLANA_RPC_URL='http://<WSL_IP>:8899'" -ForegroundColor Yellow
    exit 1
}

# Set RPC URL environment variable
$rpcUrl = "http://${wslIp}:8899"
$env:SOLANA_RPC_URL = $rpcUrl
$setupInfo += "Set SOLANA_RPC_URL=$rpcUrl"
Write-Host "Set SOLANA_RPC_URL=$rpcUrl" -ForegroundColor Cyan

# Verify validator is accessible
$validatorStatus = "unknown"
Write-Host "`nChecking if Solana validator is accessible..." -ForegroundColor Cyan
$setupInfo += ""
$setupInfo += "Checking if Solana validator is accessible..."
try {
    $null = Invoke-WebRequest -Uri "$rpcUrl" -Method Post -Body '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' -ContentType "application/json" -TimeoutSec 3 -ErrorAction Stop
    $validatorStatus = "accessible"
    $setupInfo += "SUCCESS: Validator is accessible!"
    Write-Host "SUCCESS: Validator is accessible!" -ForegroundColor Green
} catch {
    $validatorStatus = "unreachable"
    $setupInfo += "Warning: Could not reach validator at $rpcUrl"
    $setupInfo += "Make sure validator is running: solana-test-validator"
    $setupInfo += "   Or run from WSL: cd Rust/ocentra-games; anchor test"
    Write-Host "Warning: Could not reach validator at $rpcUrl" -ForegroundColor Yellow
    Write-Host "Make sure validator is running: solana-test-validator" -ForegroundColor Yellow
    Write-Host "   Or run from WSL: cd Rust/ocentra-games; anchor test" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Run deployment verification script
Write-Host "`nVerifying deployment..." -ForegroundColor Cyan
$setupInfo += ""
$setupInfo += "Verifying deployment..."
$verifyScript = Join-Path $PSScriptRoot "scripts\verify-deployment.cjs"
if (Test-Path $verifyScript) {
    try {
        Write-Host "Running: node $verifyScript" -ForegroundColor Cyan
        $verifyOutput = & node $verifyScript 2>&1
        $verifyOutput | ForEach-Object { 
            Write-Host $_ 
            $setupInfo += $_
        }
        
        if ($LASTEXITCODE -eq 0) {
            $programDeployed = $true
            $setupInfo += "SUCCESS: Deployment verification passed!"
            Write-Host "SUCCESS: Deployment verification passed!" -ForegroundColor Green
        } else {
            $programDeployed = $false
            $setupInfo += "WARNING: Deployment verification failed (exit code: $LASTEXITCODE)"
            Write-Host "WARNING: Deployment verification failed!" -ForegroundColor Yellow
            Write-Host "Please check the output above and fix any issues." -ForegroundColor Yellow
        }
    } catch {
        $programDeployed = $false
        $setupInfo += "ERROR: Could not run verification script: $_"
        Write-Host "ERROR: Could not run verification script: $_" -ForegroundColor Red
    }
} else {
    # Fallback to simple program check if verification script not found
    Write-Host "Verification script not found, using simple check..." -ForegroundColor Yellow
    $setupInfo += "Verification script not found, using simple check..."
    $programDeployed = $false
    try {
        $programId = "7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696"
        $checkProgram = @{
            jsonrpc = "2.0"
            id = 1
            method = "getAccountInfo"
            params = @(
                $programId,
                @{
                    encoding = "base58"
                }
            )
        } | ConvertTo-Json -Depth 10

        $programResponse = Invoke-WebRequest -Uri "$rpcUrl" -Method Post -Body $checkProgram -ContentType "application/json" -TimeoutSec 3 -ErrorAction Stop
        $programData = $programResponse.Content | ConvertFrom-Json

        if ($programData.result.value) {
            $programDeployed = $true
            $setupInfo += "SUCCESS: Program is deployed!"
            Write-Host "SUCCESS: Program is deployed!" -ForegroundColor Green
        } else {
            $setupInfo += "Warning: Program not found on validator"
            $setupInfo += "Deploy program: cd Rust/ocentra-games; anchor deploy"
            Write-Host "Warning: Program not found on validator" -ForegroundColor Yellow
            Write-Host "Deploy program: cd Rust/ocentra-games; anchor deploy" -ForegroundColor Yellow
        }
    } catch {
        $setupInfo += "Warning: Could not check program status: $_"
        Write-Host "Warning: Could not check program status: $_" -ForegroundColor Yellow
    }
}

# Check if authority keypair exists (required for setup)
Write-Host "`nChecking authority keypair..." -ForegroundColor Cyan
$setupInfo += ""
$setupInfo += "Checking authority keypair..."
$authorityKeypairPath = Join-Path $PSScriptRoot ".local-authority.json"
if (Test-Path $authorityKeypairPath) {
    $setupInfo += "SUCCESS: Authority keypair found"
    Write-Host "SUCCESS: Authority keypair found" -ForegroundColor Green
} else {
    $setupInfo += "Note: Authority keypair will be created by setup script if needed"
    Write-Host "Note: Authority keypair will be created by setup script if needed" -ForegroundColor Gray
}

# Check if GameRegistry is initialized (required for createMatch)
$registryInitialized = $false
Write-Host "`nChecking if GameRegistry is initialized..." -ForegroundColor Cyan
$setupInfo += ""
$setupInfo += "Checking if GameRegistry is initialized..."
try {
    # GameRegistry PDA: seeds = ["game_registry"]
    # We can check by running the setup script which handles initialization
    $registryPda = "8heRqJrZRXYSQg1LBAfzg5KNZY9GhP3NYgjMAeEFoCwe"
    $checkRegistry = @{
        jsonrpc = "2.0"
        id = 1
        method = "getAccountInfo"
        params = @(
            $registryPda,
            @{
                encoding = "base58"
            }
        )
    } | ConvertTo-Json -Depth 10

    $registryResponse = Invoke-WebRequest -Uri "$rpcUrl" -Method Post -Body $checkRegistry -ContentType "application/json" -TimeoutSec 3 -ErrorAction Stop
    $registryData = $registryResponse.Content | ConvertFrom-Json

    if ($registryData.result.value) {
        $registryInitialized = $true
        $setupInfo += "SUCCESS: GameRegistry is initialized!"
        Write-Host "SUCCESS: GameRegistry is initialized!" -ForegroundColor Green
    } else {
        $setupInfo += "GameRegistry not found, running setup script..."
        Write-Host "GameRegistry not found, running setup script..." -ForegroundColor Yellow

        # Run the setup script to initialize GameRegistry and register games
        # This will also create .local-authority.json if it doesn't exist
        $setupScript = Join-Path $PSScriptRoot "scripts\setup-local-validator.cjs"
        if (Test-Path $setupScript) {
            Write-Host "Running: node $setupScript" -ForegroundColor Cyan
            $setupOutput = & node $setupScript 2>&1
            $setupOutput | ForEach-Object { 
                Write-Host $_ 
                $setupInfo += $_
            }

            # Check if setup succeeded
            if ($LASTEXITCODE -eq 0) {
                $registryInitialized = $true
                $setupInfo += "SUCCESS: GameRegistry initialized by setup script!"
                Write-Host "SUCCESS: GameRegistry initialized!" -ForegroundColor Green
                
                # Verify authority keypair was created
                if (Test-Path $authorityKeypairPath) {
                    $setupInfo += "SUCCESS: Authority keypair created/verified"
                    Write-Host "SUCCESS: Authority keypair created/verified" -ForegroundColor Green
                }
            } else {
                $setupInfo += "ERROR: Setup script failed with exit code $LASTEXITCODE"
                Write-Host "ERROR: Setup script failed!" -ForegroundColor Red
                Write-Host "Please run manually: node scripts/setup-local-validator.cjs" -ForegroundColor Yellow
            }
        } else {
            $setupInfo += "Warning: Setup script not found at $setupScript"
            $setupInfo += "Run manually: node scripts/setup-local-validator.cjs"
            Write-Host "Warning: Setup script not found" -ForegroundColor Yellow
            Write-Host "Run manually: node scripts/setup-local-validator.cjs" -ForegroundColor Yellow
        }
    }
} catch {
    $setupInfo += "Warning: Could not check GameRegistry status: $_"
    Write-Host "Warning: Could not check GameRegistry status: $_" -ForegroundColor Yellow
}

# Use existing test-results directory (create if it doesn't exist)
$reportsDir = "test-results"
if (-not (Test-Path $reportsDir)) {
    New-Item -ItemType Directory -Path $reportsDir | Out-Null
}

# Delete ALL old test reports (we'll create a new one with fixed name)
Write-Host "`nCleaning up old test reports..." -ForegroundColor Cyan
$setupInfo += ""
$setupInfo += "Cleaning up old test reports..."
try {
    # Delete both timestamped reports and the fixed filename report
    $oldReports = Get-ChildItem -Path $reportsDir -Filter "test-report*.md" -ErrorAction SilentlyContinue
    foreach ($report in $oldReports) {
        Remove-Item $report.FullName -Force
        $setupInfo += "Deleted old report: $($report.Name)"
        Write-Host "Deleted old report: $($report.Name)" -ForegroundColor Gray
    }
    if ($oldReports.Count -gt 0) {
        $setupInfo += "Deleted $($oldReports.Count) old test report(s)"
        Write-Host "Deleted $($oldReports.Count) old test report(s)" -ForegroundColor Green
    }
} catch {
    $setupInfo += "Warning: Could not delete old reports: $_"
    Write-Host "Warning: Could not delete old reports: $_" -ForegroundColor Yellow
}

# Run tests and capture output while displaying in real-time
Write-Host "`nRunning tests..." -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Gray

$testStartTime = Get-Date

# Run tests and capture output while letting it display naturally to terminal
# Simple approach: redirect to file and also display via Tee-Object (unbuffered)
$testOutputFile = Join-Path $reportsDir "test-output-temp.txt"
Remove-Item $testOutputFile -ErrorAction SilentlyContinue

# Run npm test, capturing output to file while displaying in terminal
# Use unbuffered output by setting $OutputEncoding and using [Console]::Out
$testOutputLines = @()
npm test 2>&1 | ForEach-Object {
    # Display immediately (no filtering - let it show naturally)
    [Console]::Out.WriteLine($_)
    # Capture for report
    $testOutputLines += $_
}

# Combine captured output
$testOutput = $testOutputLines -join "`n"

$testEndTime = Get-Date
$testDuration = $testEndTime - $testStartTime

Write-Host "================================================================================" -ForegroundColor Gray

# Generate markdown report (use fixed filename to replace old one)
$reportFilename = "test-report.md"
$reportPath = Join-Path $reportsDir $reportFilename

# Clean output only for markdown report (terminal output was already displayed naturally)
# Remove ANSI escape codes for markdown readability
$cleanOutput = $testOutput -replace '\x1b\[[0-9;]*[a-zA-Z]', '' -replace '\x1b\][0-9;]*', ''
# Remove Unicode box-drawing characters for markdown (keep only ASCII)
$cleanOutput = $cleanOutput -replace '[^\x00-\x7F]', ''
# Remove PowerShell-specific error prefixes that may appear in captured output
$cleanOutput = $cleanOutput -replace 'System\.Management\.Automation\.RemoteException\s*', ''

# Extract test summary from output
$passedTests = 0
$failedTests = 0
$skippedTests = 0
$totalTests = 0
$passedFiles = 0
$failedFiles = 0
$skippedFiles = 0

# Parse test summary line: "Test Files  2 failed | 19 passed | 1 skipped (22)"
if ($cleanOutput -match "Test Files\s+(\d+)\s+failed\s+\|\s+(\d+)\s+passed\s+\|\s+(\d+)\s+skipped") {
    $failedFiles = [int]$matches[1]
    $passedFiles = [int]$matches[2]
    $skippedFiles = [int]$matches[3]
}

# Parse test count line: "Tests  5 failed | 139 passed | 22 skipped (166)"
if ($cleanOutput -match "Tests\s+(\d+)\s+failed\s+\|\s+(\d+)\s+passed\s+\|\s+(\d+)\s+skipped") {
    $failedTests = [int]$matches[1]
    $passedTests = [int]$matches[2]
    $skippedTests = [int]$matches[3]
    $totalTests = $failedTests + $passedTests + $skippedTests
}

# Extract failed test details with file paths and line numbers
$failedTestDetails = @()
# Look for FAIL lines in the output
$outputLines = $cleanOutput -split "`n"
$inFailedSection = $false
$currentTestFile = $null
$currentTestName = $null
$currentTestLine = $null

for ($i = 0; $i -lt $outputLines.Count; $i++) {
    $line = $outputLines[$i]
    
    if ($line -match "Failed Tests") {
        $inFailedSection = $true
        continue
    }
    
    # Parse FAIL line: "FAIL  src/path/to/file.ts > Test Suite > test name"
    if ($inFailedSection -and $line -match "FAIL\s+(.+?\.(ts|js|tsx|jsx))\s+>\s+(.+)") {
        $currentTestFile = $matches[1].Trim()
        $currentTestName = $matches[3].Trim()
        $currentTestLine = $null
        
        # Look ahead for line number reference in stack trace (usually 2-5 lines after)
        for ($j = $i + 1; $j -lt [Math]::Min($i + 10, $outputLines.Count); $j++) {
            $nextLine = $outputLines[$j]
            # Match pattern like: "src/services/__tests__/e2e/full-match-lifecycle.test.ts:117:38"
            if ($nextLine -match "$([regex]::Escape($currentTestFile)):(\d+):\d+") {
                $currentTestLine = [int]$matches[1]
                break
            }
        }
        
        # Create clickable link (report is in test-results/, so use ../ to go up one level)
        if ($currentTestFile) {
            $filePath = "../$currentTestFile"
            if ($currentTestLine) {
                $filePath += ":$currentTestLine"
            }
            $testDisplayName = if ($currentTestName) { $currentTestName } else { $currentTestFile }
            $failedTestDetails += @{
                File = $currentTestFile
                Name = $testDisplayName
                Line = $currentTestLine
                Link = "[$testDisplayName]($filePath)"
            }
        }
    }
    
    # Stop collecting if we hit the summary section
    if ($inFailedSection -and $line -match "Test Files\s+\d+|Tests\s+\d+") {
        break
    }
}

# Calculate percentages
$passedPercent = if ($totalTests -gt 0) { [math]::Round(($passedTests / $totalTests) * 100, 1) } else { 0 }
$failedPercent = if ($totalTests -gt 0) { [math]::Round(($failedTests / $totalTests) * 100, 1) } else { 0 }
$skippedPercent = if ($totalTests -gt 0) { [math]::Round(($skippedTests / $totalTests) * 100, 1) } else { 0 }

# Determine overall status (use plain text instead of emojis for better compatibility)
$overallStatus = if ($failedTests -eq 0 -and $failedFiles -eq 0) { "PASSED" } else { "FAILED" }

# Format date/time
$date = $testStartTime.ToString("dddd, MMMM dd, yyyy")
$time = $testStartTime.ToString("HH:mm:ss")
$isoTimestamp = $testStartTime.ToString("O")

# Generate markdown content (similar to Rust report generator format)
$markdown = @"
# Test Report

**Date:** $date  
**Time:** $time  
**Timestamp:** $isoTimestamp  

## Environment

| Property | Value |
|----------|-------|
| Cluster | localnet |
| RPC URL | \`$rpcUrl\` |
| Program ID | \`$programId\` |
| WSL IP | $wslIp |
| Platform | Windows |
| PowerShell Version | $($PSVersionTable.PSVersion) |
| Node Version | $(node --version) |

## Pre-Test Setup

| Check | Status |
|-------|--------|
| WSL IP Detection | $(if ($wslIpStatus -eq "success") { "Success ($wslIp)" } elseif ($wslIpStatus -eq "failed") { "Failed" } else { "Error" }) |
| Validator Accessibility | $(if ($validatorStatus -eq "accessible") { "Accessible" } else { "Unreachable" }) |
| Program Deployment | $(if ($programDeployed) { "Deployed" } else { "Not Found" }) |
| GameRegistry | $(if ($registryInitialized) { "Initialized" } else { "Not Found" }) |

### Setup Logs

```
$($setupInfo -join "`n")
```

## Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Tests** | $totalTests | 100% |
| **Passed** | $passedTests | ${passedPercent}% |
| **Failed** | $failedTests | ${failedPercent}% |
| **Skipped** | $skippedTests | ${skippedPercent}% |
| **Duration** | $($testDuration.TotalSeconds.ToString("F2"))s | - |

### Overall Status: $overallStatus

**Test Files:** $passedFiles passed, $failedFiles failed, $skippedFiles skipped

"@

# Helper function to generate markdown anchor from text
function Get-MarkdownAnchor {
    param([string]$text)
    $anchor = $text.ToLower()
    $anchor = $anchor -replace '[^a-z0-9\s-]', ''  # Remove special chars
    $anchor = $anchor -replace '\s+', '-'  # Replace spaces with hyphens
    $anchor = $anchor -replace '-+', '-'  # Replace multiple hyphens with single
    $anchor = $anchor.Trim('-')  # Remove leading/trailing hyphens
    return $anchor
}

# Store anchor IDs for failed tests (will be populated when we process test results)
$testAnchors = @{}  # Key: "file|test", Value: anchor ID

# Add test output section (organized by test file like Rust tests)
$markdown += "## Test Results by File`n`n"

# Try to parse collected test results (from our test collection system)
$collectedResultsPath = Join-Path $reportsDir "test-collected-results.json"
$testResultsByFile = @{}

if (Test-Path $collectedResultsPath) {
    try {
        $collectedData = Get-Content $collectedResultsPath -Raw | ConvertFrom-Json
        # Organize tests by file from collected results
        foreach ($result in $collectedData.results) {
            $fileName = $result.file
            if (-not $testResultsByFile.ContainsKey($fileName)) {
                $testResultsByFile[$fileName] = @{
                    Tests = @()
                    Duration = 0
                    FilePath = $fileName
                }
            }
            
            $testResult = @{
                Name = $result.test
                Status = $result.status
                Duration = if ($result.duration) { $result.duration } else { 0 }
                Error = $null
                ErrorStack = $null
                Logs = @()
            }
            
            # Extract error details
            if ($result.error) {
                $testResult.Error = $result.error.message
                $testResult.ErrorStack = $result.error.stack
            }
            
            # Extract console logs (this is the key - captured per test!)
            if ($result.logs) {
                foreach ($log in $result.logs) {
                    $testResult.Logs += $log
                }
            }
            
            $testResultsByFile[$fileName].Tests += $testResult
            # Accumulate duration
            $testResultsByFile[$fileName].Duration += $testResult.Duration
        }
        Write-Host "Loaded collected test results from hooks system" -ForegroundColor Green
    } catch {
        Write-Host "Warning: Could not parse collected results: $_" -ForegroundColor Yellow
        Write-Host "Falling back to Vitest JSON output..." -ForegroundColor Yellow
    }
}

# Fallback: Try to parse Vitest JSON results if collected results not available
if ($testResultsByFile.Count -eq 0) {
    $jsonResultsPath = Join-Path $reportsDir "test-results.json"
    if (Test-Path $jsonResultsPath) {
        try {
            $jsonResults = Get-Content $jsonResultsPath -Raw | ConvertFrom-Json
            # Organize tests by file
            foreach ($testFile in $jsonResults.testFiles) {
                $fileName = $testFile.name
                $testResultsByFile[$fileName] = @{
                    Tests = @()
                    Duration = $testFile.duration
                    FilePath = $fileName
                }
                foreach ($test in $testFile.tasks) {
                    $testResult = @{
                        Name = $test.name
                        Status = if ($test.mode -eq "run") { 
                            if ($test.result.state -eq "pass") { "passed" }
                            elseif ($test.result.state -eq "fail") { "failed" }
                            else { "unknown" }
                        } elseif ($test.mode -eq "skip") { "skipped" }
                        else { "unknown" }
                        Duration = $test.duration
                        Error = $null
                        ErrorStack = $null
                        Logs = @()
                    }
                    
                    # Extract error details
                    if ($test.result.error) {
                        $testResult.Error = $test.result.error.message
                        $testResult.ErrorStack = $test.result.error.stack
                    }
                    
                    # Extract console output if available
                    if ($test.result.logs) {
                        foreach ($log in $test.result.logs) {
                            $testResult.Logs += $log
                        }
                    }
                    
                    $testResultsByFile[$fileName].Tests += $testResult
                }
            }
        } catch {
            Write-Host "Warning: Could not parse JSON results: $_" -ForegroundColor Yellow
        }
    }
}

# Extract console logs from raw output by matching test names
# This helps capture console.log/debug output that might not be in JSON
$outputLines = $cleanOutput -split "`n"
$currentTestFile = $null
$currentTestName = $null
$testLogs = @{}  # Key: "file|test", Value: array of log lines
$inTestOutput = $false

for ($i = 0; $i -lt $outputLines.Count; $i++) {
    $line = $outputLines[$i]
    
    # Match test file start: "RUN  src/path/to/file.ts" or "PASS  src/path/to/file.ts"
    if ($line -match "(RUN|PASS|FAIL)\s+(.+?\.(ts|tsx|js|jsx))") {
        $currentTestFile = $matches[2]
        $inTestOutput = $true
        continue
    }
    
    # Match test name: "  ✓ should do something" or "  ✗ should fail" or "  ⊘ should skip"
    # Use Unicode escape sequences for emoji characters to avoid PowerShell parsing issues
    if ($line -match "^\s+[\u2713\u2717\u2298\u25CB]\s+(.+)$") {
        $currentTestName = $matches[1].Trim()
        if ($currentTestFile) {
            $logKey = "$currentTestFile|$currentTestName"
            if (-not $testLogs.ContainsKey($logKey)) {
                $testLogs[$logKey] = @()
            }
        }
        $inTestOutput = $true
        continue
    }
    
    # Match console.log/debug output - capture lines between test start and next test/file
    if ($currentTestFile -and $currentTestName -and $inTestOutput) {
        $logKey = "$currentTestFile|$currentTestName"
        
        # Stop capturing if we hit the next test or file
        if ($line -match "^\s+[\u2713\u2717\u2298\u25CB]\s+" -or $line -match "^(RUN|PASS|FAIL|SKIP)\s+") {
            $inTestOutput = $false
            continue
        }
        
        # Skip test framework output lines
        if ($line -match "^(Test Files|Tests\s+\d+|Duration|Time)" -or 
            $line -match "^\s*$" -or
            $line -match "^\s*[\u2500-]+\s*$") {
            continue
        }
        
        # Capture console output, debug logs, and error messages
        # Skip stack traces (lines starting with "at" or "  at")
        if (-not ($line -match "^\s+at\s+") -and 
            -not ($line -match "^\s*[\u2502]\s*$") -and
            $line.Trim().Length -gt 0) {
            if (-not $testLogs.ContainsKey($logKey)) {
                $testLogs[$logKey] = @()
            }
            # Only add if it looks like actual output (not just formatting)
            # Use Unicode escapes for box drawing characters: │ \u2502, └ \u2514, ├ \u251C, ─ \u2500
            if ($line -match "\[.*\]" -or 
                $line -match "console\." -or
                $line -match "Error:" -or
                $line -match "Warning:" -or
                ($line.Length -gt 10 -and -not ($line -match "^\s+[\u2502\u2514\u251C\u2500]"))) {
                $testLogs[$logKey] += $line.Trim()
            }
        }
    }
}

# Include ALL output without any filtering or skipping
$outputLines = $cleanOutput -split "`n"
$filteredOutput = $outputLines

# Add organized test output by file (like Rust tests)
if ($testResultsByFile.Count -gt 0) {
    $fileIndex = 0
    foreach ($file in $testResultsByFile.Keys | Sort-Object) {
        $fileIndex++
        $fileData = $testResultsByFile[$file]
        $shortFileName = $file -replace '.*[\\/]', ''  # Get just filename
        $fileLetter = [char](64 + $fileIndex)  # A, B, C, etc.
        
        # Determine file status
        $hasFailures = ($fileData.Tests | Where-Object { $_.Status -eq "failed" }).Count -gt 0
        $statusBadge = if ($hasFailures) { "[FAILED]" } else { "[PASSED]" }
        
        # Generate file anchor
        $fileAnchor = Get-MarkdownAnchor "file-$fileLetter-$shortFileName"
        $markdown += "### File $fileLetter : ``$shortFileName`` $statusBadge {#$fileAnchor}`n`n"
        $markdown += "**Path:** ``$file``  `n"
        $markdown += "**Duration:** $([math]::Round($fileData.Duration, 2))ms  `n"
        $markdown += "**Tests:** $($fileData.Tests.Count) total`n`n"
        
        foreach ($test in $fileData.Tests) {
            $testStatusIcon = switch ($test.Status) {
                "passed" { "[PASS]" }
                "failed" { "[FAIL]" }
                "skipped" { "[SKIP]" }
                default { "[?]" }
            }
            
            # Generate test anchor - use string concatenation to avoid emoji parsing issues
            $anchorText = "test-$fileLetter-$shortFileName-$($test.Name)"
            $testAnchor = Get-MarkdownAnchor $anchorText
            $anchorKey = "$file|$($test.Name)"
            $testAnchors[$anchorKey] = $testAnchor
            
            $markdown += "#### $testStatusIcon $($test.Name) {#$testAnchor}`n"
            
            if ($test.Duration) {
                $markdown += "**Duration:** $([math]::Round($test.Duration, 2))ms  `n"
            }
            $markdown += "**Status:** $($test.Status.ToUpper())`n`n"
            
            # Add console logs/debug output
            $logKey = "$file|$($test.Name)"
            if ($testLogs.ContainsKey($logKey) -and $testLogs[$logKey].Count -gt 0) {
                $markdown += "**Console Output:**`n"
                $markdown += "```\n"
                foreach ($logLine in $testLogs[$logKey]) {
                    $markdown += "$logLine\n"
                }
                $markdown += "```\n`n"
            }
            
            # Add test's own logs from JSON if available
            if ($test.Logs.Count -gt 0) {
                $markdown += "**Test Logs:**`n"
                $markdown += "```\n"
                foreach ($log in $test.Logs) {
                    $markdown += "$log\n"
                }
                $markdown += "```\n`n"
            }
            
            # Add error details if failed
            if ($test.Error) {
                $markdown += "**Error:**`n"
                $markdown += "```\n"
                $markdown += "$($test.Error)\n"
                if ($test.ErrorStack) {
                    $markdown += "\n$($test.ErrorStack)\n"
                }
                $markdown += "```\n`n"
            }
            
            $markdown += "---`n`n"
        }
        $markdown += "\n"
    }
} else {
    # Fallback: parse from raw output if JSON not available
    $markdown += "> Note: JSON results not available. Showing raw output below.`n`n"
}

# Now build the Failed Tests section with anchor links (insert before Test Results)
if ($failedTestDetails.Count -gt 0) {
    $failedTestsMarkdown = "`n## Failed Tests`n`n"
    foreach ($test in $failedTestDetails) {
        if ($test -is [hashtable]) {
            $filePath = $test.File
            $testName = $test.Name
            $anchorKey = "$filePath|$testName"
            
            if ($testAnchors.ContainsKey($anchorKey)) {
                $anchor = $testAnchors[$anchorKey]
                # Create link to anchor: [test name](#anchor-id)
                $testDisplayName = $testName
                $failedTestsMarkdown += "- [FAILED] [$testDisplayName](#$anchor) - ``$($test.File)```n"
            } else {
                # Fallback to file link if anchor not found
                $failedTestsMarkdown += "- [FAILED] $($test.Link)`n"
            }
        } else {
            # Fallback for old format
            $failedTestsMarkdown += "- [FAILED] $test`n"
        }
    }
    $failedTestsMarkdown += "`n"
    
    # Insert failed tests section before Test Results by File
    $markdown = $markdown -replace "## Test Results by File", "$failedTestsMarkdown## Test Results by File"
}

# Clean up Unicode characters only for markdown readability (but keep all content)
$cleanedFilteredOutput = $filteredOutput -join "`n"
# Remove problematic Unicode characters that cause display issues (keep ASCII and common punctuation)
$cleanedFilteredOutput = $cleanedFilteredOutput -replace '[^\x00-\x7F]', '' -replace '`n`n', "`n" -replace '\\n', "`n"

# Add raw output section - collapsed by default (includes ALL output, no filtering)
$markdown += "<details>`n<summary><b>Raw Test Output (click to expand)</b></summary>`n`n"
$codeFence = '```'
$markdown += $codeFence
$markdown += "`n"
$markdown += $cleanedFilteredOutput
$markdown += "`n"
$markdown += $codeFence
$markdown += "`n`n"
$markdown += "</details>`n`n"

# Add notes
$markdown += @"
## Notes

- Report generated automatically by \`run-tests.ps1\`
- Old reports are automatically cleaned up (only latest report is kept)
- Report location: \`$reportPath\`
"@

# Write markdown report with UTF8 encoding (no BOM for better compatibility)
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($reportPath, $markdown, $utf8NoBom)

Write-Host "`nTest report saved to: $reportPath" -ForegroundColor Green
Write-Host "SUCCESS: Tests completed!" -ForegroundColor Green
Write-Host "To run again: .\run-tests.ps1" -ForegroundColor Cyan

