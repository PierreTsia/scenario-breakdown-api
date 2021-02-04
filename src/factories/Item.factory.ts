import { MockDataFactory } from './MockData.factory';
import {
  RANDOM_ID,
  RANDOM_INT,
  RANDOM_NUMBER,
  RANDOM_WORD,
} from './Base.factory';
import { ItemType } from '../items/dto/item.type';

export const ITEM_FACTORY: MockDataFactory<ItemType> = new MockDataFactory<ItemType>(
  () => {
    return {
      id: RANDOM_ID.getOne(),
      title: RANDOM_WORD.getArray(3).join(' '),
      price: RANDOM_NUMBER.getOne(),
      description: RANDOM_WORD.getArray(RANDOM_INT.getOne(10, 30)).join(' '),
    };
  },
);
