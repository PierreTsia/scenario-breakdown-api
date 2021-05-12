import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupCredentials } from './dto/signup-credentials.dto';
import { User } from '../../schema/user.schema';
import { AuthPayload } from './dto/auth-payload.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private signPayload = (user: User): AuthPayload => {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  };

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne(email);
    const isValid = await bcrypt.compare(pass, user.password);
    return isValid ? user : null;
  }

  async decodeToken(payload: any): Promise<any> {
    return this.jwtService.decode(payload);
  }

  async signUp(credentials: SignupCredentials): Promise<AuthPayload> {
    const newUser = await this.usersService.createUser(credentials);
    if (!newUser) {
      throw new InternalServerErrorException();
    }
    const user = await newUser.save();
    return this.signPayload(user);
  }

  async login(user: User): Promise<AuthPayload> {
    return this.signPayload(user);
  }
}
