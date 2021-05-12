import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class PaginatedInput {
  @Field({ nullable: true })
  readonly limit?: number;
  @Field()
  readonly start: number;
}
