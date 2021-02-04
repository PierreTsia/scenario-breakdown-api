import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemInput } from './dto/item.input';
import { ItemType } from './dto/item.type';
import { Item } from './item.schema';
import { TranslationService } from '../translation/translation.service';
import { ITEM_FACTORY } from '../factories/Item.factory';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    private $t: TranslationService,
  ) {}

  async findAll(): Promise<ItemType[]> {
    return await this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<ItemType> {
    const foundItem = await this.itemModel.findOne({ _id: id }).exec();
    if (!foundItem) {
      throw new NotFoundException(
        await this.$t.transcode('global.NOT_FOUND', { entity: 'item', id }),
      );
    }
    return foundItem;
  }

  async delete(id: string): Promise<ItemType> {
    const deletedItem = await this.itemModel.findByIdAndRemove(id).exec();
    if (!deletedItem) {
      throw new NotFoundException();
    }
    return deletedItem;
  }

  async update(id: string, item: ItemInput): Promise<ItemType> {
    const updated = await this.itemModel
      .findByIdAndUpdate(id, item, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException();
    }
    return updated;
  }

  async create(createItemInput: ItemInput): Promise<ItemType> {
    const newItem = await this.itemModel.create(createItemInput);
    if (!newItem) {
      throw new BadRequestException();
    }
    return await newItem.save();
  }

  async populate(count: number): Promise<ItemType[]> {
    return await this.itemModel.insertMany(ITEM_FACTORY.getArrayRecords(count));
  }
}
