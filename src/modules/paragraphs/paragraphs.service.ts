import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ParagraphType } from '../projects/dto/paragraph.type';
import { classToPlain } from 'class-transformer';
import { Paragraph } from '../../schema/paragraph.schema';
import { Model } from 'mongoose';

@Injectable()
export class ParagraphsService {
  constructor(
    @InjectModel(Paragraph.name) private paragraphModel: Model<Paragraph>,
  ) {}
  async createParagraphs(paragraphs: ParagraphType[]) {
    const par = classToPlain(paragraphs);
    const saved = await this.paragraphModel.insertMany(par as Paragraph[]);
    if (!saved) {
      throw new InternalServerErrorException();
    }

    return saved;
  }
}
