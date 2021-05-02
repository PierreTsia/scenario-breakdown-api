import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attribute } from '../schema/attribute.schema';
import { CreateAttributeInput } from './dto/create-attribute.input';
import { PipelineFactory } from '../factories/Pipeline.factory';

import * as mongoose from 'mongoose';
import { plainToClass } from 'class-transformer';
import { AttributeType } from './dto/attribute.type';

@Injectable()
export class AttributesService {
  constructor(
    @InjectModel(Attribute.name) private attributeModel: Model<Attribute>,
  ) {}

  async findById(id: string) {
    const attribute = await this.attributeModel.findById(id);
    if (!attribute) {
      throw new NotFoundException();
    }
    return attribute;
  }
  async create(input: CreateAttributeInput) {
    const attribute = await this.attributeModel.create(input);
    return attribute.save();
  }

  async findProjectAttributes(projectId: string): Promise<any> {
    const pipeline = new PipelineFactory();
    pipeline.match('projectId', projectId);
    pipeline.lookup('entities', 'entityId', '_id', 'entity');
    pipeline.unwind('entity');
    const agg = await this.attributeModel.aggregate(pipeline.create());
    return agg.map((a) => plainToClass(AttributeType, a));
  }
}
