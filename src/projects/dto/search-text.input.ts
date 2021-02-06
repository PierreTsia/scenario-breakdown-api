import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SearchTextInput {
  @Field()
  readonly projectWide?: boolean;
}
