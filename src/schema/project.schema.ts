import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from './user.schema';
import { ChapterType } from '../chapters/dto/chapter.type';
import * as dayjs from 'dayjs';

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Chapter' })
  chapters: ChapterType[];
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  createdBy: User;
  @Prop({ type: SchemaTypes.Date, default: dayjs(new Date()) })
  readonly creationDate: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
