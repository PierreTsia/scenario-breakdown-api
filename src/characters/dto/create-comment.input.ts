import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @IsOptional()
  @Field()
  readonly content?: string;
}
