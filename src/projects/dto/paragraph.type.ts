import { Field, ObjectType, ID } from '@nestjs/graphql';
import { ChapterType } from '../../chapters/dto/chapter.type';
import { Annotation } from '../../schema/annotation.schema';
import { AnnotationType } from '../../annotations/dto/annotation.type';
import { PaginatedType } from '../../pagination/dto/paginated.type';
import { Expose } from 'class-transformer';

@ObjectType()
export class ParagraphType {
  @Expose({ name: '_id' })
  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field(() => ChapterType)
  readonly chapter: ChapterType;

  @Field()
  @Expose()
  readonly index: number;

  @Field(() => [String])
  @Expose()
  readonly words: string[];

  @Field(() => [AnnotationType])
  @Expose()
  readonly annotations: Annotation[];
}

@ObjectType()
export class PaginatedParagraphType extends PaginatedType {
  @Field(() => [ParagraphType])
  results: ParagraphType[];
}
