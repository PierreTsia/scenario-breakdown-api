import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { LoginCredentials } from './dto/login-credentials.dto';
import { UserType } from '../users/dto/user.type';
import { AuthService } from './auth.service';
import { SignupCredentials } from './dto/signup-credentials.dto';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthPayload } from './dto/auth-payload.dto';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserType)
  async me(@CurrentUser() user: UserType) {
    return this.usersService.findById(user.id);
  }

  @Query(() => AuthPayload)
  async login(
    @Args() { email, password }: LoginCredentials,
  ): Promise<AuthPayload> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Mutation(() => AuthPayload)
  async signup(@Args() credentials: SignupCredentials): Promise<AuthPayload> {
    return await this.authService.signUp(credentials);
  }
}
