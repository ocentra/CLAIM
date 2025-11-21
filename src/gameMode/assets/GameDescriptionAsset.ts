import 'reflect-metadata';
import { serializable } from '@/lib/serialization/Serializable';
import { ScriptableObject } from '@/lib/serialization/ScriptableObject';

/**
 * GameDescriptionAsset - Asset containing game description (LLM and Player versions)
 */
export class GameDescriptionAsset extends ScriptableObject {
  @serializable({ label: 'LLM Description' })
  LLM: string = '';

  @serializable({ label: 'Player Description' })
  Player: string = '';
}

