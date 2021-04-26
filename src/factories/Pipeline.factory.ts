import * as mongoose from 'mongoose';

type LookupArgs = {
  from: string;
  localField?: string;
  foreignField?: string;
  as?: string;
  let?: { [key: string]: string };
  pipeline?: Pipe[];
};

type Pipe = {
  [key: string]: any;
};

export class PipelineFactory {
  pipes: Pipe[] = [];

  match(field: string, query: string) {
    this.pipes.push({ $match: { [field]: mongoose.Types.ObjectId(query) } });
  }
  lookup(collection: string, local: string, foreign?: string, alias?: string) {
    this.pipes.push({
      $lookup: {
        from: collection,
        localField: local,
        foreignField: foreign || '_id',
        as: alias || local,
      },
    });
  }

  unwind(prop: string) {
    this.pipes.push({ $unwind: `$${prop}` });
  }

  count(start: number, limit?: number) {
    const collectPipe: Pipe[] = [{ $skip: start }];
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

  populateChaptersParagraphs() {
    this.pipes.push({
      $lookup: {
        let: { projectId: '$_id' },
        from: 'chapters',
        pipeline: [
          { $sort: { index: 1 } },
          { $match: { $expr: { $eq: ['$project', '$$projectId'] } } },
          {
            $lookup: {
              from: 'paragraphs',
              let: { chapterId: '$_id' },
              pipeline: [
                { $sort: { index: 1 } },
                { $match: { $expr: { $eq: ['$chapter', '$$chapterId'] } } },
              ],
              as: 'paragraphs',
            },
          },
        ],
        as: 'chapters',
      },
    });
  }

  populateUser() {
    this.lookup('users', 'createdBy');
    this.unwind('createdBy');
  }

  matchCreator(id: string) {
    this.match('createdBy', id);
  }

  create() {
    return this.pipes;
  }
}
