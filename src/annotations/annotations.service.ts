import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AnnotationInput, FetchAnnotationInput } from './dto/annotation.input';
import { InjectModel } from '@nestjs/mongoose';
import { Annotation } from '../schema/annotation.schema';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';
import { plainToClass } from 'class-transformer';
import { AnnotationType } from './dto/annotation.type';
import { AttributesService } from '../attributes/attributes.service';
import { EntitiesService } from '../entities/entities.service';
import { SearchAnnotationsService } from './search-annotations.service';

@Injectable()
export class AnnotationsService {
  constructor(
    @InjectModel(Annotation.name) private annotationModel: Model<Annotation>,
    @InjectModel(User.name) private userModel: Model<User>,
    private attributesService: AttributesService,
    private entitiesService: EntitiesService,
    private searchAnnotationsService: SearchAnnotationsService,
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

  // 🛠 CRUD
  async create(input: AnnotationInput, userId: string): Promise<any> {
    const {
      attributeId,
      projectId,
      entityId,
      slug,
      value,
      end,
      chapterId,
      start,
    } = input;
    const user = await this.userModel.findById(userId);
    const entity = await this.entitiesService.findById(entityId);
    if (!user || !entity) {
      throw new BadRequestException('no user or no entity exist');
    }
    let attrId: string;
    if (!attributeId) {
      // 🌱 CREATE NEW
      const createdAttribute = await this.attributesService.create({
        slug,
        projectId,
        entityId,
      });
      attrId = createdAttribute._id;
    } else {
      // 🌀 FETCH EXISTING
      const existingAttr = await this.attributesService.findById(attributeId);
      attrId = existingAttr._id;
    }

    const createdAnnotation = await this.annotationModel.create({
      attributeId: attrId,
      projectId,
      value,
      start,
      end,
      chapterId,
      createdBy: user,
    });
    if (!createdAnnotation) {
      throw new InternalServerErrorException();
    }

    await createdAnnotation.save();

    // 🔦  AGGREGATE && 🏭  SERIALIZE
    return plainToClass(
      AnnotationType,
      await this.getAnnotationWithAttribute(createdAnnotation._id),
    );
  }

  // 🔦  SEARCH
  async searchProjectAnnotations({
    projectId,
    chapterId,
  }: FetchAnnotationInput) {
    const annotations = await this.searchAnnotationsService.projectAnnotations({
      projectId,
      chapterId,
    });
    return plainToClass(AnnotationType, annotations);
  }

  async getAnnotationWithAttribute(annotationId: string) {
    const [agg] = await this.searchAnnotationsService.annotationWithAttribute(
      annotationId,
    );
    return agg;
  }
}
