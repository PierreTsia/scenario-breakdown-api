import { Module } from '@nestjs/common';
import { AnnotationsService } from './annotations.service';
import { AnnotationsResolver } from './annotations.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnotationSchema } from '../schema/annotation.schema';
import { ChapterSchema } from '../schema/chapter.schema';
import { UserSchema } from '../schema/user.schema';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { TranslationService } from '../translation/translation.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12hr' },
    }),
    MongooseModule.forFeature([
      { name: 'Annotation', schema: AnnotationSchema },
      { name: 'Chapter', schema: ChapterSchema },
      { name: 'User', schema: UserSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [
    AnnotationsService,
    AnnotationsResolver,
    AuthService,
    UsersService,
    TranslationService,
  ],
})
export class AnnotationsModule {}
