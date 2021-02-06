import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { LoginCredentials } from './dto/login-credentials.dto';
import { UserType } from '../users/dto/user.type';
import { AuthService } from './auth.service';
import { SignupCredentials } from './dto/signup-credentials.dto';
import { UnauthorizedException, UseFilters, UseGuards } from '@nestjs/common';
import { AuthPayload } from './dto/auth-payload.dto';
import { CurrentUser } from './current-user.decorator';
import { Public } from './public.decorator';
import { AllExceptionsFilter } from '../utils/exceptions.filters';
import { Role } from './roles.enum';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './guards/roles.guards';

@Resolver()
export class AuthResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Member)
  @Query(() => UserType)
  @UseFilters(AllExceptionsFilter)
  async me(@CurrentUser() user: UserType) {
    return this.usersService.findById(user.id);
  }

  @Public()
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

  @Public()
  @Mutation(() => AuthPayload)
  async signup(@Args() credentials: SignupCredentials): Promise<AuthPayload> {
    return await this.authService.signUp(credentials);
  }
}
