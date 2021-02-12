import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Chapter } from '../../schema/chapter.schema';
import { ChapterType } from '../../chapters/dto/chapter.type';

@ObjectType()
export class WordType {
  @Field(() => ID)
  readonly id?: string;

  @Field(() => ChapterType)
  readonly chapter: Chapter;

  @Field()
  readonly label: string;

  @Field()
  readonly paragraphIndex: number;

  @Field()
  readonly wordIndex: number;

  @Field({ nullable: true })
  readonly character: string;

  @Field({ nullable: true })
  readonly extract: string;
}
