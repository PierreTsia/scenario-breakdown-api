import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SearchInput {
  @Field()
  readonly projectWide?: boolean;

  @Field()
  @IsNotEmpty()
  readonly queryString: string;
}
