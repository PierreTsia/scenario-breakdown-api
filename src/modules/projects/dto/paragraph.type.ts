import { Field, ObjectType, ID } from '@nestjs/graphql';
import { ChapterType } from '../../chapters/dto/chapter.type';
import { Annotation } from '../../../schema/annotation.schema';
import { AnnotationType } from '../../annotations/dto/annotation.type';
import { PaginatedType } from '../../pagination/dto/paginated.type';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class ParagraphType {
  @Expose({ name: '_id' })
  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field(() => ID)
  @Expose()
  readonly chapterId: string;

  @Field(() => ID)
  @Expose()
  readonly projectId: string;

  @Field()
  @Expose()
  readonly index: number;

  @Field(() => [String])
  @Expose()
  readonly fullText: string[];

  @Field(() => [Token])
  @Type(() => Token)
  @Expose()
  readonly tokens: Token[];
}

@ObjectType()
export class PaginatedParagraphType extends PaginatedType {
  @Field(() => [ParagraphType])
  results: ParagraphType[];
}

@ObjectType()
export class Token {
  @Field()
  @Expose()
  value: string;
  @Field()
  @Expose()
  tag: string;
  @Field(() => ID, { nullable: true })
  @Expose()
  entityType?: string;
  @Field(() => ID, { nullable: true })
  @Expose()
  uid?: string;
  @Expose()
  @Field(() => [String], { nullable: true })
  originalSeq?: string[];
}
