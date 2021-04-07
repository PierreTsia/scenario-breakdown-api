import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Paragraph } from '../../schema/paragraph.schema';
import { ParagraphType } from '../../projects/dto/paragraph.type';

@ObjectType()
export class ChapterType {
  @Field(() => ID)
  readonly id?: string;
  @Field()
  readonly title: string;
  @Field(() => [ParagraphType])
  readonly paragraphs: Paragraph[];
}
