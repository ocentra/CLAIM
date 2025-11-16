#!/bin/bash
# Build and Test Loop Script
# This script builds the Anchor program, runs tests with --skip-build, and reads the report
# Usage: ./build-and-test.sh
# The script will:
#   1. Run 'anchor build'
#   2. Run 'anchor test --skip-build'
#   3. Read the generated test report


# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Setup PATH first (before finding anchor)
export PATH="$HOME/.cargo/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"
export PATH="/root/.cargo/bin:$PATH"  # WSL specific location
export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"  # Solana toolchain

# Function to find anchor
find_anchor() {
    # Try common locations
    if command -v anchor &> /dev/null; then
        echo "anchor"
        return 0
    fi
    
    # Try root cargo bin (WSL)
    if [ -f /root/.cargo/bin/anchor ]; then
        echo "/root/.cargo/bin/anchor"
        return 0
    fi
    
    # Try user cargo bin
    if [ -f ~/.cargo/bin/anchor ]; then
        echo ~/.cargo/bin/anchor
        return 0
    fi
    
    # Try local node_modules
    if [ -f node_modules/.bin/anchor ]; then
        echo node_modules/.bin/anchor
        return 0
    fi
    
    # Try npx
    if command -v npx &> /dev/null; then
        echo "npx anchor"
        return 0
    fi
    
    echo ""
    return 1
}

# Find anchor
ANCHOR_CMD=$(find_anchor)
if [ -z "$ANCHOR_CMD" ]; then
    echo -e "${RED}Error: Could not find anchor command${NC}"
    echo "Please ensure anchor is installed and in your PATH"
    echo "Try: cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
    exit 1
fi

echo -e "${GREEN}Using anchor: $ANCHOR_CMD${NC}"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Loop counter
ITERATION=1
MAX_ITERATIONS=10

while [ $ITERATION -le $MAX_ITERATIONS ]; do
    echo ""
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}Iteration $ITERATION of $MAX_ITERATIONS${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    
    # Step 1: Build the program
    echo -e "${BLUE}[1/2] Building Anchor program...${NC}"
    if $ANCHOR_CMD build 2>&1 | tee build-output.log; then
        echo -e "${GREEN}✓ Build successful${NC}"
    else
        echo -e "${RED}✗ Build failed${NC}"
        echo -e "${YELLOW}  Check build-output.log for details${NC}"
        echo ""
        echo -e "${YELLOW}Press Enter to retry, or Ctrl+C to stop...${NC}"
        read -r
        continue  # Skip to next iteration
    fi
    
    # Step 2: Run tests with --skip-build (since we already built)
    echo ""
    echo -e "${BLUE}[2/2] Running tests (skipping build)...${NC}"
    if $ANCHOR_CMD test --skip-build 2>&1 | tee test-output.log; then
        echo -e "${GREEN}✓ Tests completed${NC}"
    else
        echo -e "${YELLOW}⚠ Tests completed with some failures (checking report)${NC}"
    fi
    
    # Step 3: Find and read latest report
    echo ""
    echo -e "${BLUE}Reading test report...${NC}"
    
    # Wait a moment for report to be written
    sleep 1
    
    if [ -d "test-reports" ]; then
        LATEST_REPORT=$(ls -t test-reports/test-report-*.md 2>/dev/null | head -1)
        if [ -n "$LATEST_REPORT" ]; then
            echo -e "${GREEN}✓ Report found: $(basename "$LATEST_REPORT")${NC}"
            echo ""
            echo -e "${BLUE}=== TEST SUMMARY ===${NC}"
            
            # Extract and display summary from report
            if grep -q "## Summary" "$LATEST_REPORT"; then
                grep -A 6 "## Summary" "$LATEST_REPORT" | head -8
                echo ""
            fi
            
            # Check if all tests passed
            if grep -q "### Overall Status: ✅ \*\*PASSED\*\*" "$LATEST_REPORT"; then
                echo -e "${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}"
                echo ""
                echo -e "${GREEN}Full report: $LATEST_REPORT${NC}"
                echo ""
                exit 0
            else
                # Extract failed count
                FAILED_COUNT=$(grep "❌ \*\*Failed\*\*" "$LATEST_REPORT" | grep -oP "\|\s*\K\d+" | head -1 || echo "?")
                TOTAL_COUNT=$(grep "Total Tests" "$LATEST_REPORT" | grep -oP "\|\s*\K\d+" | head -1 || echo "?")
                PASSED_COUNT=$(grep "✅ \*\*Passed\*\*" "$LATEST_REPORT" | grep -oP "\|\s*\K\d+" | head -1 || echo "?")
                
                echo -e "${RED}❌ Some tests failed${NC}"
                echo -e "   Total: $TOTAL_COUNT | Passed: $PASSED_COUNT | Failed: $FAILED_COUNT"
                echo ""
                echo -e "${YELLOW}Full report location:${NC}"
                echo -e "   $LATEST_REPORT"
                echo ""
                echo -e "${YELLOW}Press Enter to continue to next iteration (fix errors and run again), or Ctrl+C to stop...${NC}"
                read -r
            fi
        else
            echo -e "${YELLOW}⚠ No test report found in test-reports/ directory${NC}"
            echo -e "${YELLOW}  Make sure tests are generating reports correctly${NC}"
            echo ""
            echo -e "${YELLOW}Press Enter to continue, or Ctrl+C to stop...${NC}"
            read -r
        fi
    else
        echo -e "${YELLOW}⚠ test-reports directory not found${NC}"
        echo -e "${YELLOW}  Creating directory...${NC}"
        mkdir -p test-reports
        echo ""
        echo -e "${YELLOW}Press Enter to continue, or Ctrl+C to stop...${NC}"
        read -r
    fi
    
    ITERATION=$((ITERATION + 1))
done

echo -e "${YELLOW}Reached maximum iterations ($MAX_ITERATIONS)${NC}"
exit 1

