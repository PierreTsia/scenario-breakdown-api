import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChapterInput {
  @Field()
  readonly title: string;
  @Field()
  readonly projectId: string;
  @Field()
  readonly lines: any[];
}
