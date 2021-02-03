import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Role } from '../../auth/roles.enum';

@ObjectType()
export class UserType {
  @Field(() => ID)
  readonly id?: string;

  @Field()
  readonly username: string;

  @Field()
  readonly email: string;

  @Field(() => [String])
  readonly roles: Role[];
}
