import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { SearchTextInput } from './search-text.input';

@InputType()
export class SearchWordsInput extends SearchTextInput {
  @IsMongoId()
  @Field()
  readonly chapterId: string;
  @Field()
  @IsNotEmpty()
  readonly queryString: string;
}
