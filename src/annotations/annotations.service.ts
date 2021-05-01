import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AnnotationInput, FetchAnnotationInput } from './dto/annotation.input';
import { InjectModel } from '@nestjs/mongoose';
import { Annotation } from '../schema/annotation.schema';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';
import { SUBFIELDS } from '../utils/constants';
import { PipelineFactory } from '../factories/Pipeline.factory';
import { plainToClass } from 'class-transformer';
import { AnnotationType } from './dto/annotation.type';

@Injectable()
export class AnnotationsService {
  constructor(
    @InjectModel(Annotation.name) private annotationModel: Model<Annotation>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async delete(annotationIds: string[]): Promise<boolean> {
    const { deletedCount } = await this.annotationModel.deleteMany({
      _id: { $in: annotationIds },
    });
    if (deletedCount < annotationIds.length) {
      throw new BadRequestException();
    }
    return true;
  }

  async searchProjectAnnotations({
    projectId,
    chapterId,
  }: FetchAnnotationInput) {
    const pipeline = new PipelineFactory();
    if (chapterId) {
      pipeline.match('chapterId', chapterId, false);
    } else {
      pipeline.match('projectId', projectId, false);
    }
    pipeline.lookup('entities', 'entity', '_id');
    pipeline.unwind('entity');
    pipeline.lookup('users', 'createdBy', '_id');
    pipeline.unwind('createdBy');
    const annotations = await this.annotationModel.aggregate(pipeline.create());
    return plainToClass(AnnotationType, annotations);
  }

  async create(input: AnnotationInput, userId: string): Promise<Annotation> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const annotation = await this.annotationModel.create({
      ...input,
      createdBy: user,
    });
    if (!annotation) {
      throw new InternalServerErrorException();
    }

    return await annotation
      .populate([SUBFIELDS.createdBy, SUBFIELDS.chapter, SUBFIELDS.entity])
      .execPopulate();
  }
}
