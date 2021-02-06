import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Project } from './project.schema';
import { Comment } from './comment.schema';
import { SUBFIELDS } from './populate-subfields.helper';

@Schema()
export class Character extends Document {
  @Prop({ required: true, unique: true })
  label: string;
  @Prop()
  description: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Comment' })
  comment: Comment;
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Comment' })
  comments: Comment[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Project' })
  project: Project;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
CharacterSchema.post<Character>('save', async (event, next) => {
  await event.populate([SUBFIELDS.project, SUBFIELDS.comments]).execPopulate();
  next();
});
