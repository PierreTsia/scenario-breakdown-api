import { Injectable } from '@nestjs/common';
import { AnnotationInput } from './dto/annotation.input';
import { AnnotationType } from './dto/annotation.type';

@Injectable()
export class AnnotationsService {
  async create(input: AnnotationInput, userId: string) {
    return {} as AnnotationType;
  }
}
