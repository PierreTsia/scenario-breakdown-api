import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Paragraph } from './paragraph.schema';
import { Project } from './project.schema';
export enum Status {
  Uploaded = 'UPLOADED',
  Parsed = 'PARSED',
  Analyzed = 'ANALYZED',
}

@Schema()
export class Chapter extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Project' })
  project: Project;
  @Prop({ required: true })
  title: string;
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Paragraphs' })
  paragraphs: Paragraph[];
  @Prop({ default: Status.Uploaded })
  status: Status;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
