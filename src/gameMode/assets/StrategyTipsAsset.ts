import 'reflect-metadata';
import { serializable } from '@/lib/serialization/Serializable';
import { ScriptableObject } from '@/lib/serialization/ScriptableObject';

/**
 * StrategyTipsAsset - Asset containing strategy tips (LLM and Player versions)
 */
export class StrategyTipsAsset extends ScriptableObject {
  @serializable({ label: 'LLM Strategy Tips' })
  LLM: string = '';

  @serializable({ label: 'Player Strategy Tips' })
  Player: string = '';
}

