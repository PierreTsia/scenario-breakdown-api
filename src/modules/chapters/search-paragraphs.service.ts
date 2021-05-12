import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Pipe, SearchService } from '../../common/services/search/search.service';
import { InjectModel } from '@nestjs/mongoose';
import { Paragraph } from '../../schema/paragraph.schema';
import mongoose from 'mongoose';
// noinspection JSMethodCanBeStatic
@Injectable()
export class SearchParagraphsService extends SearchService<Paragraph> {
  constructor(
    @InjectModel(Paragraph.name) private paragraphModel: Model<Paragraph>,
  ) {
    super(paragraphModel);
  }

  async paragraphsTextForChapter(chapterId: string) {
    this.init();
    this.addToSearchPipe([
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
    ]);

    return await this.search();
  }

  async paragraphsForChapter(chapterId: string, start: number, limit?: number) {
    this.init();
    this.match('chapterId', chapterId);
    this.count(start, limit);
    return await this.search();
  }

  private count(start: number, limit?: number) {
    const $skip = start - 1 > 0 ? start - 1 : 0;
    const collectPipe: Pipe[] = [{ $skip }];
    if (limit) {
      collectPipe.push({ $limit: limit });
    }
    this.addToSearchPipe([
      {
        $facet: {
          count: [{ $group: { _id: null, total: { $sum: 1 } } }],
          collect: collectPipe,
        },
      },
      { $unwind: '$count' },
      { $project: { total: '$count.total', data: '$collect' } },
    ]);
  }
}
