import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import { TranslationService } from './translation/translation.service';
import configuration from './config/configuration';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TextParserModule } from './text-parser/text-parser.module';
import { TextParserService } from './text-parser/text-parser.service';
import { ProjectsModule } from './projects/projects.module';
import { CharactersModule } from './characters/characters.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(process.env.MONGO_URI, { useFindAndModify: false }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: { path: path.join(__dirname, '/i18n/') },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: true,
      introspection: true,
      context: ({ req, connection }) =>
        connection ? { req: connection.context } : { req },
    }),
    ItemsModule,
    AuthModule,
    UsersModule,
    TextParserModule,
    ProjectsModule,
    CharactersModule,
  ],
  controllers: [AppController],
  providers: [TranslationService, AppService, TextParserService],
})
export class AppModule {}
