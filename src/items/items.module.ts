import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { TranslationService } from '../translation/translation.service';
import { ItemsResolver } from './items.resolver';
import { ItemSchema } from './item.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12hr' },
    }),
    AuthModule,
    UsersModule,
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
  ],
  providers: [ItemsService, ItemsResolver, TranslationService, AuthService],
})
export class ItemsModule {}
