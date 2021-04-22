import { Field, InputType } from '@nestjs/graphql';
import { IsHexColor, IsMongoId, IsOptional, IsNotEmpty } from 'class-validator';

@InputType()
export class EntityInput {
  @Field()
  @IsNotEmpty()
  readonly label: string;
  @Field({ nullable: true })
  @IsNotEmpty()
  @IsOptional()
  readonly description?: string;
  @IsHexColor()
  @Field()
  readonly color: string;
  @Field()
  @IsMongoId()
  readonly projectId: string;
}
