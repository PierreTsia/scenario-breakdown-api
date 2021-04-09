import { Field, ObjectType, ID } from '@nestjs/graphql';
import { ChapterType } from '../../chapters/dto/chapter.type';
import { Annotation } from '../../schema/annotation.schema';
import { AnnotationType } from '../../annotations/dto/annotation.type';
import { Paragraph } from '../../schema/paragraph.schema';
import { PaginatedType } from '../../pagination/dto/paginated.type';

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

  @Field(() => [AnnotationType])
  readonly annotations: Annotation[];
}

@ObjectType()
export class PaginatedParagraphType extends PaginatedType {
  @Field(() => [ParagraphType])
  results: Paragraph[];
}
