import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SearchService } from '../services/search.service';
import { InjectModel } from '@nestjs/mongoose';
import { Attribute } from '../schema/attribute.schema';
// noinspection JSMethodCanBeStatic
@Injectable()
export class SearchAttributesService extends SearchService<Attribute> {
  constructor(
    @InjectModel(Attribute.name) private attributeModel: Model<Attribute>,
  ) {
    super(attributeModel);
  }

  async projectAttributes(projectId: string) {
    this.init();
    this.match('projectId', projectId);
    this.lookup('entities', 'entityId', '_id', 'entity');
    this.unwind('entity');
    return await this.search();
  }


}
