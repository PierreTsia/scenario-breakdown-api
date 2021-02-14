import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityInput } from './dto/entity.input';
import { InjectModel } from '@nestjs/mongoose';
import { Entity } from '../schema/entity.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectModel(Entity.name) private entityModel: Model<Entity>,
    private usersService: UsersService,
  ) {}

  async getAll(): Promise<Entity[]> {
    return this.entityModel.find();
  }
  async create(input: EntityInput, userId: string) {
    const user = await this.usersService.findById(userId);

    const entity = await this.entityModel.create({
      ...input,
      createdBy: user,
    });
    if (!entity) {
      throw new InternalServerErrorException();
    }

    return await entity.save();
  }
}
