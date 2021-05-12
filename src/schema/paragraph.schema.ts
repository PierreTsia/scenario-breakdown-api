import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import * as FuzzySearch from 'mongoose-fuzzy-searching-v2';
import { Token } from '../modules/projects/dto/paragraph.type';

@Schema()
export class Paragraph extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Chapter' })
  chapterId: string;
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Project' })
  projectId: string;
  @Prop({ required: true })
  index: number;
  @Prop({ required: true, type: [SchemaTypes.String] })
  fullText: string[];
  @Prop({ required: true, type: SchemaTypes.Mixed })
  tokens: Token[];
}

export const ParagraphSchema = SchemaFactory.createForClass(Paragraph);
ParagraphSchema.plugin(FuzzySearch, { fields: ['fullText'] });
