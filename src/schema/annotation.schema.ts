import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Chapter } from './chapter.schema';

@Schema()
export class Annotation extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Chapter' })
  chapter: Chapter;
  @Prop({ required: true })
  index: number;
  @Prop({ required: true, type: [SchemaTypes.Number] })
  start: number[];
  @Prop({ required: true, type: [SchemaTypes.Number] })
  end: number[];
  @Prop({ required: true })
  text: string;
  @Prop({ required: true })
  type: string;
  @Prop({ required: true, type: [SchemaTypes.ObjectId], ref: 'Comment' })
  comments: Comment[];
}

export const AnnotationSchema = SchemaFactory.createForClass(Annotation);
