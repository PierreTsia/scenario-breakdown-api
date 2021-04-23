import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Role } from '../../auth/roles.enum';
import { Expose } from 'class-transformer';

@ObjectType()
export class UserType {
  @Expose({ name: '_id' })
  @Field(() => ID)
  readonly id?: string;

  @Field()
  readonly username: string;

  @Field()
  readonly email: string;

  @Field(() => [String])
  readonly roles: Role[];
}
