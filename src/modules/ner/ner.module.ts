import { Module } from '@nestjs/common';
import { NerService } from './ner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterSchema } from '../../schema/chapter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chapter', schema: ChapterSchema }]),
  ],
  providers: [NerService],
  exports: [NerService],
})
export class NerModule {}
