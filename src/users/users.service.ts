import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginCredentials } from '../auth/dto/login-credentials.dto';
import { SignupCredentials } from '../auth/dto/signup-credentials.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async findById(id: string): Promise<User> {
    const found = await this.userModel.findById(id).exec();
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async findOne(email: string): Promise<User> {
    const found = await this.userModel.findOne({ email }).exec();
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async signIn(signInCredentials: LoginCredentials) {
    const { email } = signInCredentials;
    return this.findOne(email);
  }

  async createUser(credentials: SignupCredentials) {
    const user = await this.userModel.create(credentials);
    return await user.save();
  }
}
