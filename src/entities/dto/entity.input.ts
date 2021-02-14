import { Field, InputType } from '@nestjs/graphql';
import { IsHexColor, IsOptional } from 'class-validator';

@InputType()
export class EntityInput {
  @Field()
  readonly label: string;
  @IsHexColor()
  @IsOptional()
  @Field({ nullable: true })
  readonly color?: string;
}
