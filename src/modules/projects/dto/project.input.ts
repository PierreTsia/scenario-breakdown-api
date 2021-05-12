import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProjectInput {
  @Field()
  readonly title: string;
  @Field()
  readonly description: string;
}
