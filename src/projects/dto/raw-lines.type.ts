import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RawLinesType {
  @Field({ nullable: true })
  readonly line: number;

  @Field({ nullable: true })
  readonly text: string;
}
