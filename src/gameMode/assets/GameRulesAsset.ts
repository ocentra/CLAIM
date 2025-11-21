import 'reflect-metadata';
import { serializable } from '@/lib/serialization/Serializable';
import { ScriptableObject } from '@/lib/serialization/ScriptableObject';

/**
 * GameRulesAsset - Asset containing game rules (LLM and Player versions)
 */
export class GameRulesAsset extends ScriptableObject {
  @serializable({ label: 'LLM Rules' })
  LLM: string = '';

  @serializable({ label: 'Player Rules' })
  Player: string = '';
}

