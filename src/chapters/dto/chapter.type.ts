import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Paragraph } from '../../schema/paragraph.schema';
import { ParagraphType } from '../../projects/dto/paragraph.type';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class ChapterType {
  @Expose({ name: '_id' })
  @Field(() => ID)
  readonly id?: string;
  @Field()
  readonly title: string;
  @Field(() => [ParagraphType])
  @Type(() => ParagraphType)
  readonly paragraphs: Paragraph[];
}
