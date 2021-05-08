import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EntitySchema } from '../schema/entity.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { AuthModule } from '../auth/auth.module';
import { EntitiesResolver } from './entities.resolver';
import { UsersModule } from '../users/users.module';
import { TranslationService } from '../translation/translation.service';
import { SearchEntitiesService } from './search-entities.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12hr' },
    }),
    AuthModule,
    UsersModule,
    MongooseModule.forFeature([{ name: 'Entity', schema: EntitySchema }]),
  ],
  providers: [
    EntitiesService,
    EntitiesResolver,
    TranslationService,
    SearchEntitiesService,
  ],
  exports: [EntitiesService, SearchEntitiesService],
})
export class EntitiesModule {}
