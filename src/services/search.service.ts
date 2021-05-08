import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type Pipe = {
  [key: string]: any;
};

@Injectable()
export abstract class SearchService<T extends Document> {
  private readonly model: Model<T>;
  private searchPipeline: Pipe[] = [];
  protected constructor(private readonly searchModel: Model<T>) {
    this.model = searchModel;
  }

  addToSearchPipe(pipes: Pipe[]) {
    this.searchPipeline.push(...pipes);
  }

  match(field: string, query: string, isMongoId = true) {
    this.searchPipeline.push({
      $match: { [field]: isMongoId ? mongoose.Types.ObjectId(query) : query },
    });
  }
  lookup(collection: string, local: string, foreign?: string, alias?: string) {
    this.searchPipeline.push({
      $lookup: {
        from: collection,
        localField: local,
        foreignField: foreign || '_id',
        as: alias || local,
      },
    });
  }

  unwind(prop: string) {
    this.searchPipeline.push({
      $unwind: { path: `$${prop}`, preserveNullAndEmptyArrays: true },
    });
  }

  matchCreator(id: string) {
    this.match('createdBy', id);
  }

  populateCreator() {
    this.lookup('users', 'createdBy');
    this.unwind('createdBy');
  }

  init() {
    this.searchPipeline = [];
  }

  async search() {
    return this.model.aggregate(this.searchPipeline);
  }
}
