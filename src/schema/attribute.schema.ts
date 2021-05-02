import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';
@Schema()
export class Attribute extends Document {
  @Prop({ required: true })
  slug: string;
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Project' })
  projectId: string;
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Entity' })
  entityId: string;
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);
