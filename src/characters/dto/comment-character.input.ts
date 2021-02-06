import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { CreateCommentInput } from './create-comment.input';

@InputType()
export class CommentCharacterInput extends CreateCommentInput {
  @IsMongoId()
  @Field()
  readonly characterId: string;
}
