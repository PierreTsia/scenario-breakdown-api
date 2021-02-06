import { Field, ObjectType, ID } from '@nestjs/graphql';
import { ChapterType } from './chapter.type';

@ObjectType()
export class ParagraphType {
  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field(() => ChapterType)
  readonly chapter: ChapterType;

  @Field()
  readonly index: number;

  @Field(() => [String])
  readonly words: string[];

  @Field(() => [String])
  readonly annotations: string[];
}
