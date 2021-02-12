import {
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

@Injectable()
export class AnnotationsService {
  constructor(
    @InjectModel(Annotation.name) private annotationModel: Model<Annotation>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
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
