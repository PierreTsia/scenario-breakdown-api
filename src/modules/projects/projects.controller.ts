import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Sse,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TextParserService } from '../text-parser/text-parser.service';
import { ProjectsService } from './projects.service';
import { UploadGuards } from '../auth/guards/upload.guards';
import { Project } from '../../schema/project.schema';
import { ChaptersService } from '../chapters/chapters.service';
import { SUBFIELDS } from '../../utils/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChapterCreatedEvent } from '../chapters/events/chapter-created.event';
import { Events } from '../../common/types/events.enum';
import { interval, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Controller('projects')
export class ProjectsController {
  constructor(
    private eventEmitter: EventEmitter2,
    private textParserService: TextParserService,
    private projectService: ProjectsService,
    private chaptersService: ChaptersService,
  ) {}

  @Sse('chapter/status/:chapterId')
  chapterStatus(@Param('chapterId') chapterId: string): Observable<any> {
    const intervalValue = 5000;
    return interval(intervalValue).pipe(
      switchMap(() => this.chaptersService.findById(chapterId)),
      map((c) => ({ data: { id: c.id, status: c.status } })),
    );
  }

  @Post('chapter/upload')
  @UseGuards(UploadGuards)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file,
    @Body('projectId') projectId: string,
    @Body('chapterName') chapterName: string,
  ): Promise<Project> {
    const project = await this.projectService.findById(projectId);
    if (!project) {
      throw new BadRequestException();
    }
    const chapter = await this.chaptersService.createChapter(
      projectId,
      chapterName,
    );

    const event = new ChapterCreatedEvent(chapter, file, projectId);
    this.eventEmitter.emit(Events.ChapterCreated, event);

    const updatedProject = await this.projectService.addChapterToProject(
      chapter,
      project.id,
    );

    if (!updatedProject) {
      throw new BadRequestException();
    }
    return await updatedProject
      .populate([SUBFIELDS.chapters, SUBFIELDS.createdBy])
      .execPopulate();
  }
}
