import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attribute } from '../schema/attribute.schema';
import { CreateAttributeInput } from './dto/create-attribute.input';

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
}
