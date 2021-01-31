import { Field, InputType, Int } from '@nestjs/graphql';
import { Length, ValidationArguments } from 'class-validator';
import { TranslationKeyBuilder } from '../../translation/translationKeyBuilder';
import { CONSTRAINTS } from '../../utils/constants';
const translateKey = new TranslationKeyBuilder();
const titleKey = (
  key: string,
  { constraints, value, property }: ValidationArguments,
) => {
  const [min, max] = constraints;
  return translateKey.generate(key, { property, value, min, max });
};
@InputType()
export class ItemInput {
  @Length(CONSTRAINTS.ITEM.TITLE.MIN, CONSTRAINTS.ITEM.TITLE.MAX, {
    message: (args: ValidationArguments) =>
      titleKey('validation.ITEM.TITLE', args),
  })
  @Field()
  readonly title: string;
  @Field(() => Int)
  readonly price: number;
  @Field()
  readonly description: string;
}
