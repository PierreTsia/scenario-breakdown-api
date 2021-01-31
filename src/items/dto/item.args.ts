import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { TranslationKeyBuilder } from '../../translation/translationKeyBuilder';
const translateKey = new TranslationKeyBuilder();

@ArgsType()
export class ItemArgs {
  @IsMongoId({
    message: ({ value }) =>
      translateKey.generate('validation.ITEM.ID', { value }),
  })
  @Field(() => ID)
  readonly id: string;
}
