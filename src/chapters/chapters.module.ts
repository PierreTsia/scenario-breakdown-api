import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersResolver } from './chapters.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterSchema } from '../schema/chapter.schema';
import { ProjectSchema } from '../schema/project.schema';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    ProjectsModule,
    MongooseModule.forFeature([
      { name: 'Chapter', schema: ChapterSchema },
      { name: 'Project', schema: ProjectSchema },
    ]),
  ],
  providers: [ChaptersService, ChaptersResolver],
  exports: [ChaptersService],
})
export class ChaptersModule {}
