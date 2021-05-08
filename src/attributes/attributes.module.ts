import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schema/user.schema';
import { AttributeSchema } from '../schema/attribute.schema';
import { AttributesResolver } from './attributes.resolver';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { TranslationService } from '../translation/translation.service';
import { SearchAttributesService } from './search-attributes.service';

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
  providers: [
    TranslationService,
    UsersService,
    AuthService,
    AttributesService,
    AttributesResolver,
    SearchAttributesService,
  ],
  exports: [AttributesService, SearchAttributesService],
})
export class AttributesModule {}
