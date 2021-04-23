import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Paragraph } from './paragraph.schema';
import { Project } from './project.schema';

@Schema()
export class Chapter extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Project' })
  project: Project;
  @Prop({ required: true })
  title: string;
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Paragraphs' })
  paragraphs: Paragraph[];
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
