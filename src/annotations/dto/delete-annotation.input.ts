import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteAnnotationInput {
  @Field(() => [ID])
  readonly annotationIds: string[];
}
