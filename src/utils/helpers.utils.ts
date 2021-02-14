import { RANDOM_INT } from '../factories/Base.factory';
import { COLORS } from './constants';

export const getArrayLimits = (
  claimedStart: number,
  claimedEnd: number,
  collectionLength: number,
): { start: number; end: number } => ({
  start: claimedStart < 0 ? 0 : claimedStart,
  end: claimedEnd > collectionLength ? collectionLength : claimedEnd,
});

export const randomColor = () => {
  const i = RANDOM_INT.getOne(0, COLORS.length);
  return COLORS[i];
};
