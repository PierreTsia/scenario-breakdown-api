import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemInput } from './dto/item.input';
import { ItemType } from './dto/item.type';
import { Item } from './item.schema';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  async findAll(): Promise<ItemType[]> {
    return await this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<ItemType> {
    return await this.itemModel.findOne({ _id: id }).exec();
  }

  async delete(id: string): Promise<ItemType> {
    return await this.itemModel.findByIdAndRemove(id).exec();
  }

  async update(id: string, item: ItemInput): Promise<ItemType> {
    return await this.itemModel
      .findByIdAndUpdate(id, item, { new: true })
      .exec();
  }

  async create(createItemInput: ItemInput): Promise<ItemType> {
    const newItem = await this.itemModel.create(createItemInput);
    return await newItem.save();
  }
}
