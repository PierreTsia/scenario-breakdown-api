import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Document } from 'mongoose';
import { PipelineFactory } from '../factories/Pipeline.factory';
import * as mongoose from 'mongoose';

@Injectable()
export abstract class SearchService<T extends Document> {
  private readonly model: Model<T>;
  private searchPipeline = new PipelineFactory();
  protected constructor(private readonly searchModel: Model<T>) {
    this.model = searchModel;
  }

  addToSearchPipe(p: unknown[]) {
    this.searchPipeline.pipes.push(...p);
  }

  match(field: string, query: string, isMongoId = true) {
    this.searchPipeline.pipes.push({
      $match: { [field]: isMongoId ? mongoose.Types.ObjectId(query) : query },
    });
  }
  lookup(collection: string, local: string, foreign?: string, alias?: string) {
    this.searchPipeline.pipes.push({
      $lookup: {
        from: collection,
        localField: local,
        foreignField: foreign || '_id',
        as: alias || local,
      },
    });
  }

  unwind(prop: string) {
    this.searchPipeline.pipes.push({
      $unwind: { path: `$${prop}`, preserveNullAndEmptyArrays: true },
    });
  }

  init() {
    this.searchPipeline = new PipelineFactory();
  }

  async search() {
    return this.model.aggregate(this.searchPipeline.create());
  }
}
