import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, Matches, NotContains } from 'class-validator';

const rules = {
  password: {
    format: /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/,
    message:
      'Password must contain 1 lowercase letter, 1 uppercase letter, 1 number, and be at least 8 characters long',
  },
};

@ArgsType()
export class SignupCredentials {
  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @NotContains(' ', { message: 'No whitespaces allowed in username field' })
  readonly username: string;

  @Field()
  @Matches(rules.password.format, { message: rules.password.message })
  readonly password: string;
}
