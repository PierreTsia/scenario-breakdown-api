import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attribute } from '../../schema/attribute.schema';
import { CreateAttributeInput } from './dto/create-attribute.input';

import { plainToClass } from 'class-transformer';
import { AttributeType } from './dto/attribute.type';
import { SearchAttributesService } from './search-attributes.service';

@Injectable()
export class AttributesService {
  constructor(
    @InjectModel(Attribute.name) private attributeModel: Model<Attribute>,
    private searchAttributesService: SearchAttributesService,
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
    const agg = await this.searchAttributesService.projectAttributes(projectId);
    return agg.map((a) => plainToClass(AttributeType, a));
  }
}
