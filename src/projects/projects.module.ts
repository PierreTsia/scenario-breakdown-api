import { Module } from '@nestjs/common';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from '../schema/project.schema';
import { ChapterSchema } from '../schema/chapter.schema';
import { UserSchema } from '../schema/user.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthModule } from '../auth/auth.module';
import { TextParserModule } from '../text-parser/text-parser.module';
import { TextParserService } from '../text-parser/text-parser.service';
import { ProjectsController } from './projects.controller';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { TranslationService } from '../translation/translation.service';
import { ParagraphSchema } from '../schema/paragraph.schema';
import { ChaptersService } from '../chapters/chapters.service';
import { ChapterDeletedListener } from './listeners/chapter-deleted.listener';
import { ChapterCreatedListener } from './listeners/chapter-created.listener';
import { PaginationModule } from '../pagination/pagination.module';
import { SearchChaptersService } from '../chapters/search-chapters.service';
import { SearchProjectsService } from './search-projects.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12hr' },
    }),
    AuthModule,
    TextParserModule,
    PaginationModule,
    MongooseModule.forFeature([
      { name: 'Chapter', schema: ChapterSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Paragraph', schema: ParagraphSchema },
    ]),
    UsersModule,
  ],
  providers: [
    ProjectsResolver,
    ProjectsService,
    UsersService,
    TextParserService,
    AuthService,
    TranslationService,
    ChaptersService,
    SearchChaptersService,
    SearchProjectsService,
    ChapterDeletedListener,
    ChapterCreatedListener,
  ],
  controllers: [ProjectsController],
  exports: [ProjectsService, SearchProjectsService],
})
export class ProjectsModule {}
