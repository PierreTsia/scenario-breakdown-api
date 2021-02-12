import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../users/user.schema';
import { ChapterType } from '../chapters/dto/chapter.type';

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Chapter' })
  chapters: ChapterType[];
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  user: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
