import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class EntityType {
  @Field(() => ID)
  readonly id?: string;
  @Field()
  readonly label: string;
  @Field()
  readonly color: string;
}
