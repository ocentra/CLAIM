import 'reflect-metadata';
import { serializable } from '@/lib/serialization/Serializable';
import { ScriptableObject } from '@/lib/serialization/ScriptableObject';
import { CardRanking } from '../CardRanking';

/**
 * CardRankingAsset - Asset containing card rankings
 */
export class CardRankingAsset extends ScriptableObject {
  @serializable({ label: 'Card Rankings', elementType: CardRanking })
  rankings: CardRanking[] = [];
}

