import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChapterTextInput {
  @Field()
  readonly chapterId: string;
  @Field({ nullable: true })
  readonly start?: number;
  @Field({ nullable: true })
  readonly end?: number;
}
