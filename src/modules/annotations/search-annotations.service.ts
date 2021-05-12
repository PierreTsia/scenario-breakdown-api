import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SearchService } from '../../common/services/search/search.service';
import { InjectModel } from '@nestjs/mongoose';
import { Annotation } from '../../schema/annotation.schema';
import { FetchAnnotationInput } from './dto/annotation.input';
// noinspection JSMethodCanBeStatic
@Injectable()
export class SearchAnnotationsService extends SearchService<Annotation> {
  constructor(
    @InjectModel(Annotation.name) private annotationModel: Model<Annotation>,
  ) {
    super(annotationModel);
  }

  async projectAnnotations({ chapterId, projectId }: FetchAnnotationInput) {
    this.init();
    if (chapterId) {
      this.match('chapterId', chapterId);
    } else {
      this.match('projectId', projectId);
    }
    this.lookup('attributes', 'attributeId', '_id', 'attribute');
    this.unwind('attribute');
    this.lookup('entities', 'attribute.entityId', '_id', 'attribute.entity');
    this.unwind('attribute.entity');
    this.lookup('users', 'createdBy', '_id');
    this.unwind('createdBy');
    return await this.search();
  }

  async annotationWithAttribute(annotationId: string) {
    this.init();
    this.match('_id', annotationId);
    this.populateCreator();
    this.lookup('attributes', 'attributeId', '_id', 'attribute');
    this.unwind('attribute');
    this.lookup('entities', 'attribute.entityId', '_id', 'attribute.entity');
    this.unwind('attribute.entity');
    return await this.search();
  }
}
