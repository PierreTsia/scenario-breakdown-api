import { Field, InputType } from '@nestjs/graphql';
import { IsLowercase, IsMongoId, IsOptional } from 'class-validator';
import { CreateCommentInput } from './create-comment.input';

@InputType()
export class UpdateCharacterInput {
  @IsMongoId()
  @Field()
  readonly id: string;

  @IsLowercase()
  @IsOptional()
  @Field({ nullable: true })
  readonly label?: string;

  @IsLowercase()
  @IsOptional()
  @Field({ nullable: true })
  readonly description?: string;

  @IsOptional()
  @Field(() => CreateCommentInput, { nullable: true })
  readonly comment?: CreateCommentInput;
}
