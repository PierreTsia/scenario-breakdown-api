import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Chapter } from './chapter.schema';
import { Annotation } from './annotation.schema';
import * as FuzzySearch from 'mongoose-fuzzy-searching-v2';

@Schema()
export class Paragraph extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Chapter' })
  chapter: Chapter;
  @Prop({ required: true })
  index: number;
  @Prop({ required: true, type: [SchemaTypes.String] })
  words: string[];
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ParagraphSchema = SchemaFactory.createForClass(Paragraph);
ParagraphSchema.plugin(FuzzySearch, { fields: ['words'] });
