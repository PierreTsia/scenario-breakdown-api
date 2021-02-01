import { RandomDataFactory } from './RandomData.factory';
import { Gender, Locale } from './types';
import * as faker from 'faker';

export const RANDOM_INT = new RandomDataFactory<number>(
  (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
);
export const RANDOM_FIRST_NAME = new RandomDataFactory<string>(
  (locale: Locale = Locale.Fr, gender: Gender = Gender.Male) => {
    faker.locale = locale;
    return faker.name.firstName(gender);
  },
);
export const RANDOM_LAST_NAME = new RandomDataFactory<string>(
  (locale: Locale = Locale.Fr, gender: Gender = Gender.Male) => {
    faker.locale = locale;
    return faker.name.lastName(gender);
  },
);
export const RANDOM_EMAIL = new RandomDataFactory<string>(
  (firstname?: string, lastname?: string) => {
    return faker.internet.exampleEmail(firstname, lastname);
  },
);
export const RANDOM_USER_NAME = new RandomDataFactory<string>(
  (firstname?: string, lastname?: string) => {
    return faker.internet.userName(firstname, lastname);
  },
);
export const RANDOM_STREET_ADDRESS = new RandomDataFactory<string>(
  (locale: Locale = Locale.Fr, usefulAddress = true) => {
    faker.locale = locale;
    return faker.address.streetAddress(usefulAddress);
  },
);
export const RANDOM_CITY = new RandomDataFactory<string>(
  (locale: Locale = Locale.Fr) => {
    faker.locale = locale;
    return faker.address.city();
  },
);
export const RANDOM_WORD = new RandomDataFactory<string>(
  (locale: Locale = Locale.Fr) => {
    faker.locale = locale;
    return faker.random.word();
  },
);
export const RANDOM_ID = new RandomDataFactory<string>(() => {
  return faker.random.uuid();
});
export const RANDOM_DATE = new RandomDataFactory<string>(
  (from: Date = new Date(0), to: Date = new Date()) => {
    return faker.date.between(from, to);
  },
);
export const RANDOM_PHONE_NUMBER = new RandomDataFactory<string>(
  (format = '+33 6 ## ## ## ##') => {
    return faker.phone.phoneNumber(format);
  },
);
export const RANDOM_AVATAR = new RandomDataFactory<string>(() => {
  return faker.image.avatar();
});
export const RANDOM_BOOLEAN = new RandomDataFactory<boolean>(
  (falseThreshold = 0.5) => Math.random() > falseThreshold,
);
export const RANDOM_NUMBER = new RandomDataFactory<number>(
  (min = 0, max = 100, digits = 2) => {
    return (Math.random() * (max - min + 1) + min).toFixed(digits);
  },
);
