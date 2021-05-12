import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAttributeInput {
  @Field()
  slug: string;
  @Field(() => ID)
  projectId: string;
  @Field(() => ID)
  entityId: string;
}
