import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schema/user.schema';
import { AttributeSchema } from '../schema/attribute.schema';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12hr' },
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Attribute', schema: AttributeSchema },
    ]),
  ],
  providers: [AttributesService],
  exports: [AttributesService],
})
export class AttributesModule {}
