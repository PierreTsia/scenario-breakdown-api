import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityInput } from './dto/entity.input';
import { InjectModel } from '@nestjs/mongoose';
import { Entity } from '../schema/entity.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { SUBFIELDS } from '../utils/constants';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectModel(Entity.name) private entityModel: Model<Entity>,
    private usersService: UsersService,
  ) {}

  async getUserEntities(userId: string): Promise<Entity[]> {
    return this.entityModel
      .find()
      .where('createdBy')
      .equals(userId)
      .populate([SUBFIELDS.createdBy, SUBFIELDS.project]);
  }
  async getProjectEntities(
    user: { id: string },
    projectId: string,
  ): Promise<Entity[]> {
    return this.entityModel
      .find()
      .where('project')
      .equals(projectId)
      .populate([SUBFIELDS.createdBy, SUBFIELDS.project]);
  }
  async create(input: EntityInput, userId: string) {
    const user = await this.usersService.findById(userId);

    const entity = await this.entityModel.create({
      ...input,
      createdBy: user,
      project: input.projectId,
    });
    if (!entity) {
      throw new InternalServerErrorException();
    }

    return entity
      .populate([SUBFIELDS.createdBy, SUBFIELDS.project])
      .execPopulate();
  }
}
