import { Field, ObjectType, Int, ID } from '@nestjs/graphql';
import { Float } from 'type-graphql';

@ObjectType()
export class ItemType {
  @Field(() => ID)
  readonly id?: string;

  @Field()
  readonly title: string;

  @Field(() => Float)
  readonly price: number;

  @Field()
  readonly description: string;
}
