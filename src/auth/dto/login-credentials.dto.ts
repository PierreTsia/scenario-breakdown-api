import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class LoginCredentials {
  @Field()
  @IsEmail()
  readonly email: string;
  @Field()
  readonly password: string;
}
