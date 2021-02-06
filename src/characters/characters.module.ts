import { Module } from '@nestjs/common';
import { CharactersResolver } from './characters.resolver';
import { CharactersService } from './characters.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { TranslationService } from '../translation/translation.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { TextParserModule } from '../text-parser/text-parser.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterSchema } from '../schema/chapter.schema';
import { ProjectSchema } from '../schema/project.schema';
import { CharacterSchema } from '../schema/character.schema';
import { CommentSchema } from '../schema/comment.schema';
import { UsersService } from '../users/users.service';
import { UserSchema } from '../users/user.schema';
import { ProjectsService } from '../projects/projects.service';
import { WordSchema } from '../text-parser/word.schema';
import { ParagraphSchema } from '../schema/paragraph.schema';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12hr' },
    }),
    AuthModule,
    TextParserModule,
    MongooseModule.forFeature([
      { name: 'Chapter', schema: ChapterSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'Character', schema: CharacterSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Word', schema: WordSchema },
      { name: 'Paragraph', schema: ParagraphSchema },
    ]),
  ],
  providers: [
    CharactersResolver,
    CharactersService,
    AuthService,
    TranslationService,
    UsersService,
    ProjectsService,
  ],
})
export class CharactersModule {}
