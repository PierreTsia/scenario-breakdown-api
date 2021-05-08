import * as mongoose from 'mongoose';
import { Pipe } from '../services/search.service';

export class PipelineFactory {
  pipes: Pipe[] = [];

  match(field: string, query: string, isMongoId = true) {
    this.pipes.push({
      $match: { [field]: isMongoId ? mongoose.Types.ObjectId(query) : query },
    });
  }

  count(start: number, limit?: number) {
    const $skip = start - 1 > 0 ? start - 1 : 0;
    const collectPipe: Pipe[] = [{ $skip }];
    if (limit) {
      collectPipe.push({ $limit: limit });
    }
    this.pipes.push(
      {
        $facet: {
          count: [{ $group: { _id: null, total: { $sum: 1 } } }],
          collect: collectPipe,
        },
      },
      { $unwind: '$count' },
      { $project: { total: '$count.total', data: '$collect' } },
    );
  }

  chapterText(chapterId: string) {
    this.pipes.push(
      {
        $group: {
          _id: '$chapterId',
          paragraphs: { $push: { text: '$fullText', paragraphId: '$_id' } },
        },
      },
      {
        $match: {
          $expr: { $eq: ['$_id', mongoose.Types.ObjectId(chapterId)] },
        },
      },
    );
  }

  create() {
    return this.pipes;
  }
}
