import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AnnotationInput } from './dto/annotation.input';
import { InjectModel } from '@nestjs/mongoose';
import { Annotation } from '../schema/annotation.schema';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';
import { SUBFIELDS } from '../utils/constants';
import { ProjectsService } from '../projects/projects.service';
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

  async searchProjectAnnotations(projectId: string) {
    const annotations = await this.annotationModel
      .find()
      .populate([SUBFIELDS.chapter])
      .exec();
    if (!annotations.length) {
      return [];
    }
    return annotations.filter((a) => a.chapter.project.id === projectId);
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
      .populate([SUBFIELDS.createdBy, SUBFIELDS.chapter])
      .execPopulate();
  }
}
