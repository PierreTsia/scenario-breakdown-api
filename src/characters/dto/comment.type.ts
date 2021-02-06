import { Field, ObjectType, ID } from '@nestjs/graphql';
import { UserType } from '../../users/dto/user.type';

@ObjectType()
export class CommentType {
  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field()
  content: string;

  @Field()
  createdAt: string;

  @Field(() => UserType)
  createdBy: UserType;
}
