// generate-claim-asset.ts
// Script to generate initial claim.asset file from ClaimGameMode
// Run this to create the initial asset file: tsx scripts/generate-claim-asset.ts

import { serialize } from '../src/lib/serialization/Serializable';
import { ClaimGameMode } from '../src/gameMode/ClaimGameMode';
import { SCHEMA_VERSION_KEY } from '../src/lib/serialization/Serializable';
import { writeFile } from 'fs/promises';
import { join } from 'path';

async function generateClaimAsset() {
  // Create ClaimGameMode instance
  const claimGameMode = new ClaimGameMode();
  
  // Wait for initialization to complete
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Serialize to JSON
  const serialized = serialize(claimGameMode);
  
  // Add metadata for asset file
  const assetData = {
    [SCHEMA_VERSION_KEY]: (ClaimGameMode.constructor as { schemaVersion?: number }).schemaVersion || 1,
    __assetType: 'GameMode',
    __assetId: 'claim',
    metadata: {
      gameId: 'claim',
      gameName: 'Claim',
      displayName: 'Claim',
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    ...serialized,
  };
  
  // Write to file
  const assetPath = join(process.cwd(), 'public', 'GameMode', 'claim.asset');
  await writeFile(assetPath, JSON.stringify(assetData, null, 2), 'utf8');
  
  console.log(`✅ Generated ${assetPath}`);
  console.log(`Schema version: ${assetData[SCHEMA_VERSION_KEY]}`);
  console.log(`Properties serialized: ${Object.keys(serialized).length}`);
}

generateClaimAsset().catch(console.error);

