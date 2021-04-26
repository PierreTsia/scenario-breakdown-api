import { Field, ID, InputType } from '@nestjs/graphql';
import { Coord } from '../../schema/annotation.schema';

@InputType()
export class AnnotationInput {
  @Field(() => ID, { nullable: true })
  readonly id?: string;
  @Field(() => ID)
  readonly chapterId: string;
  @Field(() => ID)
  readonly projectId: string;
  @Field()
  readonly label: string;
  @Field()
  readonly value: string;
  @Field(() => CoordInput)
  readonly start: Coord;
  @Field(() => CoordInput)
  readonly end: Coord;
  @Field(() => ID)
  readonly entity: string;
}

@InputType()
export class CoordInput {
  @Field()
  readonly paragraphIndex: number;
  @Field()
  readonly wordIndex: number;
}
