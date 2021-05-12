import { Module } from '@nestjs/common';
import { AnnotationsService } from './annotations.service';
import { AnnotationsResolver } from './annotations.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnotationSchema } from '../../schema/annotation.schema';
import { ChapterSchema } from '../../schema/chapter.schema';
import { UserSchema } from '../../schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { TranslationService } from '../../common/services/translation/translation.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { AttributesService } from '../attributes/attributes.service';
import { AttributeSchema } from '../../schema/attribute.schema';
import { EntitiesService } from '../entities/entities.service';
import { EntitySchema } from '../../schema/entity.schema';
import { SearchEntitiesService } from '../entities/search-entities.service';
import { SearchAnnotationsService } from './search-annotations.service';
import { SearchAttributesService } from '../attributes/search-attributes.service';

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
      { name: 'Attribute', schema: AttributeSchema },
      { name: 'Entity', schema: EntitySchema },
    ]),
  ],
  providers: [
    AnnotationsService,
    AnnotationsResolver,
    AuthService,
    UsersService,
    TranslationService,
    AttributesService,
    EntitiesService,
    SearchEntitiesService,
    SearchAnnotationsService,
    SearchAttributesService,
  ],
})
export class AnnotationsModule {}
