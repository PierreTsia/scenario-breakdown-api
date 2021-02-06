import { Field, ObjectType } from '@nestjs/graphql';
import { ParagraphType } from './paragraph.type';

@ObjectType()
export class SearchResultType {
  @Field(() => ParagraphType)
  readonly paragraph: ParagraphType;

  @Field()
  readonly paragraphIndex: number;

  @Field()
  readonly wordIndex: number;

  @Field()
  readonly label: string;

  @Field()
  readonly extract: string;
}
