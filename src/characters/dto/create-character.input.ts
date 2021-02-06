import { Field, InputType } from '@nestjs/graphql';
import { IsLowercase, IsMongoId, IsOptional } from 'class-validator';

@InputType()
export class CreateCharacterInput {
  @Field()
  @IsLowercase()
  readonly label: string;

  @IsMongoId()
  @Field()
  readonly projectId: string;

  @IsOptional()
  @Field()
  readonly description?: string;
}
