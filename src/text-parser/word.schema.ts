import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Chapter } from '../schema/chapter.schema';
import * as FuzzySearch from 'mongoose-fuzzy-searching-v2';

@Schema()
export class Word extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Chapter' })
  chapter: Chapter;
  @Prop({ required: true })
  label: string;
  @Prop({ required: true })
  paragraphIndex: number;
  @Prop({ required: true })
  wordIndex: number;
  @Prop({ nullable: true })
  character: string;
  @Prop({ nullable: true })
  extract: string;
}
export const WordSchema = SchemaFactory.createForClass(Word);
WordSchema.plugin(FuzzySearch, { fields: ['label'] });
