import { Field, ID, InputType } from '@nestjs/graphql';
import { Coord } from '../../schema/annotation.schema';

@InputType()
export class AnnotationInput {
  @Field(() => ID, { nullable: true })
  readonly id?: string;
  @Field(() => ID)
  readonly chapter: string;
  @Field()
  readonly label: string;
  @Field(() => CoordInput)
  readonly start: Coord;
  @Field(() => CoordInput)
  readonly end: Coord;
  @Field()
  readonly type: string;
}

@InputType()
export class CoordInput {
  @Field()
  readonly paragraphIndex: number;
  @Field()
  readonly wordIndex: number;
}
