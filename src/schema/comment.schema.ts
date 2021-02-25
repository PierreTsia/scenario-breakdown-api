import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema()
export class Comment extends Document {
  @Prop({ required: true })
  content: string;
  @Prop({ default: new Date(), type: Date })
  creationDate: string;
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  createdBy: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
