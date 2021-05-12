import { Module } from '@nestjs/common';
import { ParagraphsService } from './paragraphs.service';
import { ParagraphsResolver } from './paragraphs.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ParagraphSchema } from '../../schema/paragraph.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Paragraph', schema: ParagraphSchema }]),
  ],
  providers: [ParagraphsService, ParagraphsResolver],
  exports: [ParagraphsService],
})
export class ParagraphsModule {}
