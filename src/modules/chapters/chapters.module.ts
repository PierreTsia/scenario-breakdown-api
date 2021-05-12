import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersResolver } from './chapters.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterSchema } from '../../schema/chapter.schema';
import { ProjectSchema } from '../../schema/project.schema';
import { ProjectsModule } from '../projects/projects.module';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from '../../schema/user.schema';
import { jwtConstants } from '../auth/constants';
import { TranslationService } from '../../common/services/translation/translation.service';
import { ProjectDeletedListener } from './listeners/project-deleted.listener';
import { ParagraphSchema } from '../../schema/paragraph.schema';
import { PaginationService } from '../pagination/pagination.service';
import { PaginationModule } from '../pagination/pagination.module';
import { NerService } from '../ner/ner.service';
import { ParagraphsAnalyzedListener } from './listeners/paragraphs-analyzed.listener';
import { ParagraphsAnalyzingListener } from './listeners/paragraphs-analyzing.listener';
import { SearchChaptersService } from './search-chapters.service';
import { ProjectsService } from '../projects/projects.service';
import { SearchProjectsService } from '../projects/search-projects.service';
import { SearchParagraphsService } from './search-paragraphs.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12hr' },
    }),
    PaginationModule,
    MongooseModule.forFeature([
      { name: 'Chapter', schema: ChapterSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Paragraph', schema: ParagraphSchema },
      { name: 'Project', schema: ProjectSchema },
    ]),
  ],
  providers: [
    ChaptersService,
    ProjectsService,
    ChaptersResolver,
    AuthService,
    UsersService,
    TranslationService,
    ParagraphsAnalyzedListener,
    ParagraphsAnalyzingListener,
    ProjectDeletedListener,
    PaginationService,
    NerService,
    SearchChaptersService,
    SearchProjectsService,
    SearchParagraphsService,
  ],
  exports: [ChaptersService, SearchChaptersService, SearchParagraphsService],
})
export class ChaptersModule {}
