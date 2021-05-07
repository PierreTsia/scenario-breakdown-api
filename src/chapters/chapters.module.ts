import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersResolver } from './chapters.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterSchema } from '../schema/chapter.schema';
import { ProjectSchema } from '../schema/project.schema';
import { ProjectsModule } from '../projects/projects.module';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from '../schema/user.schema';
import { jwtConstants } from '../auth/constants';
import { TranslationService } from '../translation/translation.service';
import { ProjectDeletedListener } from './listeners/project-deleted.listener';
import { ParagraphSchema } from '../schema/paragraph.schema';
import { PaginationService } from '../pagination/pagination.service';
import { PaginationModule } from '../pagination/pagination.module';
import { NerService } from '../ner/ner.service';
import { ParagraphsAnalyzedListener } from './listeners/paragraphs-analyzed.listener';
import { ParagraphsAnalyzingListener } from './listeners/paragraphs-analyzing.listener';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12hr' },
    }),
    ProjectsModule,
    PaginationModule,
    MongooseModule.forFeature([
      { name: 'Chapter', schema: ChapterSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Paragraph', schema: ParagraphSchema },
    ]),
  ],
  providers: [
    ChaptersService,
    ChaptersResolver,
    AuthService,
    UsersService,
    TranslationService,
    ParagraphsAnalyzedListener,
    ParagraphsAnalyzingListener,
    ProjectDeletedListener,
    PaginationService,
    NerService,
  ],
  exports: [ChaptersService],
})
export class ChaptersModule {}
