import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const hashPassword = async (clearPwd: string, saltRounds = 10) =>
  bcrypt.hash(clearPwd, saltRounds);

UserSchema.pre<User>('save', async function (next) {
  this.password = await hashPassword(this.password);
  next();
});
