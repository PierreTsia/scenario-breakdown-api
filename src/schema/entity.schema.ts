import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from './user.schema';
import { randomColor } from '../utils/helpers.utils';
import { Project } from './project.schema';

@Schema()
export class Entity extends Document {
  @Prop({ required: true })
  label: string;
  @Prop({ required: true, default: '' })
  description: string;
  @Prop({ required: true, default: randomColor })
  color: string;
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  createdBy: User;
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Project' })
  project: Project;
}

export const EntitySchema = SchemaFactory.createForClass(Entity);
