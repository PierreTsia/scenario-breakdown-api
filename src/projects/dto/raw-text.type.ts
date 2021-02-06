import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RawTextType {
  @Field({ nullable: true })
  readonly text: string;
}
