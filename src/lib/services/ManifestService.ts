// ManifestService.ts
// Service for fetching HuggingFace repos and building manifests
// Replicates TabAgent's ensureManifestForDropdownRepos flow

import {
  getManifestEntry,
  fetchRepoFiles,
  addManifestEntry,
  getServerOnlySizeLimit,
  getBypassSizeLimitModels,
  type ManifestEntry,
  type QuantInfo,
  QuantStatus,
  CURRENT_MANIFEST_VERSION,
} from '@/lib/db/idbModel'

const prefix = '[ManifestService]'
const LOG_MANIFEST_GENERATION = false

const SUPPORTING_FILE_REGEX = /\.(onnx(\.data)?|onnx_data|json|bin|pt|txt|model)$/i

/**
 * Extract clean quantization type from file path (for legacy manifests)
 * @param filePath - File path like "onnx/model_q4f16.onnx" or "onnx/model.onnx"
 * @returns Clean dtype like "q4f16", "fp16", "fp32", etc.
 */
function extractCleanDtypeFromPath(filePath: string): string {
  if (!filePath || typeof filePath !== 'string') return 'fp32'

  // Extract filename from path
  const filename = filePath.split('/').pop() || filePath

  // Remove .onnx extension
  const nameWithoutExt = filename.replace(/\.onnx$/, '')

  // Extract quantization type from filename (check longer patterns first)
  if (nameWithoutExt.includes('q4f16')) return 'q4f16'
  if (nameWithoutExt.includes('uint8')) return 'uint8' // Check uint8 before int8
  if (nameWithoutExt.includes('int8')) return 'int8'
  if (nameWithoutExt.includes('bnb4')) return 'bnb4'
  if (nameWithoutExt.includes('q4')) return 'q4'
  if (nameWithoutExt.includes('q8')) return 'q8'
  if (nameWithoutExt.includes('fp16')) return 'fp16'
  if (nameWithoutExt.includes('fp32')) return 'fp32'
  if (nameWithoutExt.includes('quantized')) return 'quantized'

  // Default to fp32 if no match (for "model.onnx" files)
  return 'fp32'
}

/**
 * Ensure manifest exists for given repos (matches TabAgent's ensureManifestForDropdownRepos)
 * Fetches HuggingFace API, determines quants, checks sizes, and builds manifest
 */
export async function ensureManifestForRepos(
  repos: string[],
  forceRebuild: boolean = false
): Promise<void> {
  if (LOG_MANIFEST_GENERATION) {
    console.log(`${prefix} [ensureManifestForRepos] Repos to check/update:`, repos)
  }

  const processedRepos: string[] = []
  const skippedRepos: string[] = []
  const errorRepos: string[] = []

  for (const repo of repos) {
    if (!forceRebuild) {
      const existingManifest = await getManifestEntry(repo)
      if (existingManifest) {
        if (LOG_MANIFEST_GENERATION) {
          console.log(
            `${prefix} [ensureManifestForRepos] Manifest for ${repo} already exists. Skipping fetch/build.`
          )
        }
        processedRepos.push(repo)
        continue
      }
    } else {
      if (LOG_MANIFEST_GENERATION) {
        console.log(
          `${prefix} [ensureManifestForRepos] Force rebuild requested for ${repo}. Will update/create manifest.`
        )
      }
    }

    let oldManifest: ManifestEntry | null = null
    try {
      oldManifest = await getManifestEntry(repo)
      if (oldManifest && oldManifest.manifestVersion !== CURRENT_MANIFEST_VERSION) {
        if (LOG_MANIFEST_GENERATION) {
          console.warn(
            `${prefix} [ensureManifestForRepos] Manifest version mismatch for ${repo}: found ${oldManifest.manifestVersion}, expected ${CURRENT_MANIFEST_VERSION}. Will re-create.`
          )
        }
        oldManifest = null // Force re-creation
      }
    } catch (e) {
      if (LOG_MANIFEST_GENERATION) {
        console.warn(
          `${prefix} [ensureManifestForRepos] Error fetching existing manifest for ${repo}, will create anew if possible.`,
          e
        )
      }
    }

    try {
      const { siblings, task } = await fetchRepoFiles(repo)
      if (!siblings || siblings.length === 0) {
        if (LOG_MANIFEST_GENERATION) {
          console.warn(
            `${prefix} [ensureManifestForRepos] No files (siblings) found for repo: ${repo}. Skipping manifest update for this repo.`
          )
        }
        skippedRepos.push(repo)
        continue
      }

      const allFileNamesInRepo = new Set(siblings.map((f) => f.rfilename))
      if (LOG_MANIFEST_GENERATION) {
        console.log(`${prefix} [ensureManifestForRepos] All files in repo ${repo}:`, allFileNamesInRepo)
      }

      const quantMap: Record<string, QuantInfo> = {}

      for (const file of siblings) {
        if (file.rfilename && file.rfilename.endsWith('.onnx')) {
          const quantKey = file.rfilename
          if (!allFileNamesInRepo.has(quantKey)) {
            if (LOG_MANIFEST_GENERATION) {
              console.warn(
                `${prefix} [ensureManifestForRepos] Quant model file missing for quantKey: ${quantKey} in repo ${repo}. Skipping this quant.`
              )
            }
            continue
          }
          if (LOG_MANIFEST_GENERATION) {
            console.log(
              `${prefix} [ensureManifestForRepos] Found quant file (quantKey): ${quantKey} in repo ${repo}`
            )
          }

          const currentQuantRequiredFiles = new Set<string>()
          currentQuantRequiredFiles.add(quantKey)

          const quantDir = quantKey.includes('/') ? quantKey.substring(0, quantKey.lastIndexOf('/')) : ''

          // Add all subfolder files matching the pattern
          for (const sibling of siblings) {
            if (sibling.rfilename === quantKey) continue
            if (
              SUPPORTING_FILE_REGEX.test(sibling.rfilename) &&
              quantDir &&
              sibling.rfilename.startsWith(quantDir + '/')
            ) {
              currentQuantRequiredFiles.add(sibling.rfilename)
            }
          }

          // Add root-level files matching the pattern only if not already present
          for (const sibling of siblings) {
            if (sibling.rfilename === quantKey) continue
            if (SUPPORTING_FILE_REGEX.test(sibling.rfilename) && !sibling.rfilename.includes('/')) {
              const fileName = sibling.rfilename
              if (quantDir) {
                const subfolderVersion = `${quantDir}/${fileName}`
                if (!currentQuantRequiredFiles.has(subfolderVersion)) {
                  currentQuantRequiredFiles.add(fileName)
                }
              } else {
                currentQuantRequiredFiles.add(fileName)
              }
            }
          }

          // Determine serverOnly status based on quant type and associated data file
          let isServerOnly = false
          const serverOnlySizeLimit = getServerOnlySizeLimit()
          const bypassModels = getBypassSizeLimitModels()

          if (LOG_MANIFEST_GENERATION) {
            console.log(`${prefix} [ensureManifestForRepos] Processing ${quantKey} for ${repo}:`)
            console.log(
              `${prefix} [ensureManifestForRepos] Size limit: ${serverOnlySizeLimit / (1024 * 1024 * 1024)} GB`
            )
            console.log(`${prefix} [ensureManifestForRepos] Bypass models:`, Array.from(bypassModels))
            console.log(
              `${prefix} [ensureManifestForRepos] Required files for ${quantKey}:`,
              Array.from(currentQuantRequiredFiles)
            )
          }

          if (quantKey.endsWith('.onnx')) {
            // For any .onnx, check for .onnx_data or .onnx.data file of the same quant family
            const baseName = quantKey.replace(/\.onnx$/, '')
            const dataFile = siblings.find(
              (f) =>
                f.rfilename === `${baseName}.onnx_data` || f.rfilename === `${baseName}.onnx.data`
            )
            if (dataFile && typeof dataFile.size === 'number') {
              const dataFileSizeGB = dataFile.size / (1024 * 1024 * 1024)
              const limitGB = serverOnlySizeLimit / (1024 * 1024 * 1024)
              const isOverLimit = dataFile.size > serverOnlySizeLimit

              if (LOG_MANIFEST_GENERATION) {
                console.log(`${prefix} [ensureManifestForRepos] ${quantKey} size check:`)
                console.log(`${prefix} [ensureManifestForRepos] - Data file: ${dataFile.rfilename}`)
                console.log(
                  `${prefix} [ensureManifestForRepos] - Data file size: ${dataFile.size} bytes (${dataFileSizeGB.toFixed(2)} GB)`
                )
                console.log(
                  `${prefix} [ensureManifestForRepos] - Size limit: ${serverOnlySizeLimit} bytes (${limitGB.toFixed(2)} GB)`
                )
                console.log(`${prefix} [ensureManifestForRepos] - Is over limit: ${isOverLimit}`)
                console.log(`${prefix} [ensureManifestForRepos] - Is in bypass: ${bypassModels.has(repo)}`)
              }

              if (isOverLimit) {
                // Check if this model is in the bypass list
                if (!bypassModels.has(repo)) {
                  isServerOnly = true
                  if (LOG_MANIFEST_GENERATION) {
                    console.log(
                      `${prefix} [ensureManifestForRepos] - Setting server_only=true (over limit and not bypassed)`
                    )
                  }
                } else {
                  if (LOG_MANIFEST_GENERATION) {
                    console.log(
                      `${prefix} [ensureManifestForRepos] - NOT setting server_only (over limit but bypassed)`
                    )
                  }
                }
              } else {
                if (LOG_MANIFEST_GENERATION) {
                  console.log(
                    `${prefix} [ensureManifestForRepos] - NOT setting server_only (under limit)`
                  )
                }
              }
            }
          }

          const oldStatus = oldManifest?.quants[quantKey]?.status
          const status = isServerOnly ? QuantStatus.ServerOnly : QuantStatus.Available

          if (LOG_MANIFEST_GENERATION) {
            console.log(`${prefix} [ensureManifestForRepos] Status calculation for ${quantKey}:`)
            console.log(`${prefix} [ensureManifestForRepos] - isServerOnly: ${isServerOnly}`)
            console.log(`${prefix} [ensureManifestForRepos] - oldStatus: ${oldStatus}`)
            console.log(`${prefix} [ensureManifestForRepos] - final status: ${status}`)
          }

          // Build fileSizes info
          const fileSizes: Record<string, number> = {}
          for (const fname of currentQuantRequiredFiles) {
            let size: number | undefined = undefined
            const entry = siblings.find((f) => f.rfilename === fname)
            if (entry && typeof entry.size === 'number' && entry.size > 0) {
              size = entry.size
            }
            if (typeof size === 'number' && size > 0) {
              fileSizes[fname] = size
            }
          }

          // Check if external data file exists for this quant
          const hasExternalData = allFileNamesInRepo.has(`${quantKey}_data`)
          if (LOG_MANIFEST_GENERATION) {
            console.log(
              `${prefix} [ensureManifestForRepos] ${quantKey} hasExternalData: ${hasExternalData}`
            )
          }

          quantMap[quantKey] = {
            files: Array.from(currentQuantRequiredFiles).sort(),
            status,
            dtype: extractCleanDtypeFromPath(quantKey),
            hasExternalData,
          }
          if (LOG_MANIFEST_GENERATION) {
            console.log(
              `${prefix} [ensureManifestForRepos] For quantKey ${quantKey}, required files:`,
              Array.from(currentQuantRequiredFiles).sort(),
              `Status: ${status}`,
              `fileSizes:`,
              fileSizes
            )
          }
        }
      }

      if (Object.keys(quantMap).length === 0) {
        if (LOG_MANIFEST_GENERATION) {
          console.warn(
            `${prefix} [ensureManifestForRepos] No .onnx models found for repo ${repo}. Skipping manifest creation/update for this repo.`
          )
        }
        skippedRepos.push(repo)
        continue
      }

      const newManifestEntry: ManifestEntry = {
        repo,
        quants: quantMap,
        task,
        manifestVersion: CURRENT_MANIFEST_VERSION,
      }
      await addManifestEntry(repo, newManifestEntry)
      processedRepos.push(repo)
      if (LOG_MANIFEST_GENERATION) {
        console.log(
          `${prefix} [ensureManifestForRepos] Successfully created/updated manifest for repo: ${repo}`,
          newManifestEntry
        )
      }
    } catch (e) {
      console.error(`${prefix} [ensureManifestForRepos] Failed to fetch repo files or process manifest for repo: ${repo}`, e)
      errorRepos.push(repo)
    }
  }

  if (LOG_MANIFEST_GENERATION) {
    console.log(`${prefix} [ensureManifestForRepos] Finished processing all repos.`)
    console.log(`${prefix} [ensureManifestForRepos] Processed repos:`, processedRepos)
    if (skippedRepos.length > 0) {
      console.warn(
        `${prefix} [ensureManifestForRepos] Skipped repos (no models or missing files):`,
        skippedRepos
      )
    }
    if (errorRepos.length > 0) {
      console.error(`${prefix} [ensureManifestForRepos] Repos with errors:`, errorRepos)
    }
  }
}

