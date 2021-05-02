import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Role } from '../../auth/roles.enum';
import { Expose } from 'class-transformer';

@ObjectType()
export class UserType {
  @Expose({ name: '_id' })
  @Field(() => ID)
  readonly id?: string;
  @Expose()
  @Field()
  readonly username: string;
  @Expose()
  @Field()
  readonly email: string;

  @Field(() => [String])
  readonly roles: Role[];
}
