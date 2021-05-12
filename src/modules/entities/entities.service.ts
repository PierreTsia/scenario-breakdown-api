import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityInput } from './dto/entity.input';
import { InjectModel } from '@nestjs/mongoose';
import { Entity } from '../../schema/entity.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { SUBFIELDS } from '../../utils/constants';
import { plainToClass } from 'class-transformer';
import { EntityType } from './dto/entity.type';
import { SearchEntitiesService } from './search-entities.service';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectModel(Entity.name) private entityModel: Model<Entity>,
    private usersService: UsersService,
    private searchEntitiesService: SearchEntitiesService,
  ) {}

  /* CRUD */
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

  /* SEARCH  DEPENDENCY ENTITY MODEL*/
  async findById(entityId: string): Promise<Entity> {
    return this.entityModel.findById(entityId).lean();
  }

  async getUserEntities(userId: string): Promise<EntityType[]> {
    const entities = await this.searchEntitiesService.userEntities(userId);
    return entities.map((d) => plainToClass(EntityType, d));
  }

  async getProjectEntities(projectId: string): Promise<EntityType[]> {
    const entities = await this.searchEntitiesService.projectEntities(
      projectId,
    );
    return entities.map((d) => plainToClass(EntityType, d));
  }
}
