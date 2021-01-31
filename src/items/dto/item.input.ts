import { Field, InputType, Int } from '@nestjs/graphql';
import { Length, ValidationArguments } from 'class-validator';
import { TranslationBuilder } from '../../translation/translation.builder';
import { CONSTRAINTS } from '../../utils/constants';
const builder = new TranslationBuilder();
const titleKey = (
  key: string,
  { constraints, value, property }: ValidationArguments,
) => {
  const [min, max] = constraints;
  return builder.generateKey(key, { property, value, min, max });
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
