import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import { TranslationService } from './common/services/translation/translation.service';
import configuration from './config/configuration';
import * as path from 'path';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TextParserModule } from './modules/text-parser/text-parser.module';
import { TextParserService } from './modules/text-parser/text-parser.service';
import { ProjectsModule } from './modules/projects/projects.module';
import { ChaptersModule } from './modules/chapters/chapters.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AnnotationsModule } from './modules/annotations/annotations.module';
import { EntitiesModule } from './modules/entities/entities.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaginationModule } from './modules/pagination/pagination.module';
import { AttributesModule } from './modules/attributes/attributes.module';
import { ParagraphsModule } from './modules/paragraphs/paragraphs.module';

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
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    TextParserModule,
    ProjectsModule,
    ChaptersModule,
    CommentsModule,
    AnnotationsModule,
    EntitiesModule,
    PaginationModule,
    AttributesModule,
    ParagraphsModule,
  ],
  controllers: [AppController],
  providers: [TranslationService, AppService, TextParserService],
})
export class AppModule {}
