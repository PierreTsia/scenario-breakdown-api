import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../schema/user.schema';
import { UserType } from '../../users/dto/user.type';

@ObjectType()
export class AuthPayload {
  @Field()
  readonly access_token: string;
  @Field(() => UserType)
  readonly user: User;
}
