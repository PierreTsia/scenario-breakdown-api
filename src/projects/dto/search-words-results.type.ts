import { Field, ObjectType } from '@nestjs/graphql';

import { WordType } from '../../text-parser/dto/word.type';

@ObjectType()
export class SearchWordsResultsType {
  @Field()
  readonly count: number;

  @Field(() => [WordResultType])
  readonly results: WordResultType[];
}

@ObjectType()
export class WordResultType {
  @Field(() => WordType)
  readonly word: WordType;

  @Field()
  readonly extract: string;
}
