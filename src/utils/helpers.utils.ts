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

export const pickSome = (collection = [], picked = [], picksCount = 0) => {
  if (!collection?.length || picksCount <= 0) {
    return picked;
  }
  const [current, rest] = pickOne(collection);
  const newPicked = [...picked, current];
  return picksCount > 1 ? pickSome(rest, newPicked, picksCount - 1) : newPicked;
};

const randomIndex = (max: number) => {
  return RANDOM_INT.getOne(0, max);
};

const pickOne = (collection: any[]) => {
  const i = randomIndex(collection.length - 1);
  const rest = [...collection.slice(0, i), ...collection.slice(i + 1)];
  return [collection[i], rest];
};

export const fuzzyMatch = (str: string, pattern: string) => {
  pattern = pattern.split('').reduce(function (a, b) {
    return a + '.*' + b;
  });
  return new RegExp(pattern).test(str);
};

