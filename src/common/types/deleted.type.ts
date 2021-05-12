import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeletedType {
  @Field(() => ID)
  readonly id: string;
}
