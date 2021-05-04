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

  match(field: string, query: string, isMongoId = true) {
    this.pipes.push({
      $match: { [field]: isMongoId ? mongoose.Types.ObjectId(query) : query },
    });
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
    this.pipes.push({
      $unwind: { path: `$${prop}`, preserveNullAndEmptyArrays: true },
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

  populateAnnotationAttribute(annotationId: string) {
    this.match('_id', annotationId);
    this.populateUser();
    this.lookup('attributes', 'attributeId', '_id', 'attribute');
    this.unwind('attribute');
    this.lookup('entities', 'attribute.entityId', '_id', 'attribute.entity');
    this.unwind('attribute.entity');
  }

  populateAttributeEntities() {
    this.pipes.push({
      $lookup: {
        let: { projectId: '$project' },
        from: 'attributes',
        pipeline: [
          { $sort: { index: 1 } },
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
    });
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
                { $limit: 1 },
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
