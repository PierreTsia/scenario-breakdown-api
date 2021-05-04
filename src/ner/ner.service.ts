import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from '../schema/chapter.schema';
import { Model } from 'mongoose';
import NerCorpusInput from './dto/ner-corpus.input';

@Injectable()
export class NerService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
  ) {}
  async recognizeTextEntities(input: NerCorpusInput) {
    console.log(input);
    //recupererer attributes + annotations qui ont le chapter Id
    // annotation chapter id mais attributes project id
    // chapter a un project:ObjectId

    //text
    // chapter > paragraphs > full text
  }
}
