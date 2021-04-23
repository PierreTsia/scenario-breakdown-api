import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityInput } from './dto/entity.input';
import { InjectModel } from '@nestjs/mongoose';
import { Entity } from '../schema/entity.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { SUBFIELDS } from '../utils/constants';
import { PipelineFactory } from '../factories/Pipeline.factory';
import { plainToClass } from 'class-transformer';
import { EntityType } from './dto/entity.type';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectModel(Entity.name) private entityModel: Model<Entity>,
    private usersService: UsersService,
  ) {}

  async getUserEntities(userId: string): Promise<EntityType[]> {
    const pipeline = new PipelineFactory();
    pipeline.matchCreator(userId);
    pipeline.populateUser();
    pipeline.lookup('projects', 'project');
    pipeline.unwind('project');
    pipeline.lookup('chapters', 'project.chapters', '_id', 'chapters');
    const entitiesDocs = await this.entityModel.aggregate(pipeline.create());
    return entitiesDocs.map((d) => plainToClass(EntityType, d));
  }
  async getProjectEntities(projectId: string): Promise<EntityType[]> {
    const pipeline = new PipelineFactory();
    pipeline.match('project', projectId);
    pipeline.populateUser();
    pipeline.lookup('projects', 'project', '_id');
    pipeline.unwind('project');

    const entitiesDocs = await this.entityModel.aggregate(pipeline.create());
    return entitiesDocs.map((d) => plainToClass(EntityType, d));
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
