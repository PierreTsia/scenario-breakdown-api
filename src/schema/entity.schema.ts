import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from './user.schema';
import { randomColor } from '../utils/helpers.utils';

@Schema()
export class Entity extends Document {
  @Prop({ required: true, unique: true })
  label: string;
  @Prop({ required: true, default: randomColor })
  color: string;
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  createdBy: User;
}

export const EntitySchema = SchemaFactory.createForClass(Entity);
