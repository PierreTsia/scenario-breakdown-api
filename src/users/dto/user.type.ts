import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  readonly id?: string;

  @Field()
  readonly username: string;

  @Field()
  readonly email: string;
}
