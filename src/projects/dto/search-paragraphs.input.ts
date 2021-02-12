import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';
import { SearchInput } from './search.input';

@InputType()
export class SearchParagraphsInput extends SearchInput {
  @IsMongoId()
  @Field()
  @IsOptional()
  readonly chapterId?: string;
}
