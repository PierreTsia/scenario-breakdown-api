import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SearchService } from '../../common/services/search/search.service';
import { Chapter } from '../../schema/chapter.schema';
import { InjectModel } from '@nestjs/mongoose';
// noinspection JSMethodCanBeStatic
@Injectable()
export class SearchChaptersService extends SearchService<Chapter> {
  constructor(@InjectModel(Chapter.name) private chapterModel: Model<Chapter>) {
    super(chapterModel);
  }

  async chapterCorpus(chapterId: string) {
    this.init();
    this.match('_id', chapterId);
    this.attributesAndEntities();
    this.lookup('annotations', 'project', 'projectId', 'annotations');
    return await this.search();
  }

  private attributesAndEntities() {
    this.addToSearchPipe([
      {
        $lookup: {
          let: { projectId: '$project' },
          from: 'attributes',
          pipeline: [
            { $match: { $expr: { $eq: ['$projectId', '$$projectId'] } } },
            {
              $lookup: {
                from: 'entities',
                let: { entityId: '$entityId' },
                pipeline: [
                  { $sort: { index: 1 } },
                  { $match: { $expr: { $eq: ['$_id', '$$entityId'] } } },
                ],
                as: 'entity',
              },
            },
            { $unwind: '$entity' },
          ],
          as: 'attributes',
        },
      },
    ]);
  }
}
