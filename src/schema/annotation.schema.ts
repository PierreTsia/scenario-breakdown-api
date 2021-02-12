import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Chapter } from './chapter.schema';
import { User } from './user.schema';

export type Coord = { paragraphIndex: number; wordIndex: number };

@Schema()
export class Annotation extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Chapter' })
  chapter: Chapter;
  @Prop({ required: true })
  label: string;
  @Prop({ required: true, type: SchemaTypes.Mixed })
  start: Coord;
  @Prop({ required: true, type: SchemaTypes.Mixed })
  end: Coord;
  @Prop({ required: true })
  type: string;
  @Prop({ required: true, type: [SchemaTypes.ObjectId], ref: 'Comment' })
  comments: Comment[];
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  createdBy: User;
  @Prop({ required: true, default: new Date(), type: SchemaTypes.Date })
  createdAt: string;
}

export const AnnotationSchema = SchemaFactory.createForClass(Annotation);
