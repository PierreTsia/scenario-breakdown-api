import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SearchService } from '../../common/services/search/search.service';
import { InjectModel } from '@nestjs/mongoose';
import { Entity } from '../../schema/entity.schema';
// noinspection JSMethodCanBeStatic
@Injectable()
export class SearchEntitiesService extends SearchService<Entity> {
  constructor(@InjectModel(Entity.name) private entityModel: Model<Entity>) {
    super(entityModel);
  }

  async userEntities(userId: string) {
    this.init();
    this.matchCreator(userId);
    this.populateCreator();
    this.lookup('projects', 'project');
    this.unwind('project');
    this.lookup('chapters', 'project.chapters', '_id', 'chapters');
    return await this.search();
  }

  async projectEntities(projectId: string) {
    this.init();
    this.match('project', projectId);
    this.populateCreator();
    this.lookup('projects', 'project', '_id');
    this.unwind('project');
    return await this.search();
  }
}
