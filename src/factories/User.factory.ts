import { MockDataFactory } from './MockData.factory';
import { Gender, Locale } from './types';
import { UserType } from '../users/dto/user.type';
import {
  RANDOM_BOOLEAN,
  RANDOM_EMAIL,
  RANDOM_FIRST_NAME,
  RANDOM_ID,
  RANDOM_LAST_NAME,
  RANDOM_USER_NAME,
} from './Base.factory';
import { Role } from '../auth/roles.enum';

export const USER_FACTORY: MockDataFactory<UserType> = new MockDataFactory<UserType>(
  ({ locale = Locale.Fr, gender }: { locale: Locale; gender?: Gender }) => {
    const randomGender = RANDOM_BOOLEAN.getOne() ? Gender.Male : Gender.Female;
    const firstname = RANDOM_FIRST_NAME.getOne(locale, gender ?? randomGender);
    const lastname = RANDOM_LAST_NAME.getOne();
    const email = RANDOM_EMAIL.getOne(firstname, lastname);
    const username = RANDOM_USER_NAME.getOne(firstname, lastname);
    const id = RANDOM_ID.getOne();

    return { username, email, id, roles: [Role.Member] };
  },
);
