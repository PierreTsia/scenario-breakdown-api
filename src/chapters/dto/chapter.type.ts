import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class ChapterType {
  @Field(() => ID)
  readonly id?: string;
  @Field()
  readonly title: string;
}
