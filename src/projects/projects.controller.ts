import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TextParserService } from '../text-parser/text-parser.service';
import { ProjectsService } from './projects.service';
import { UploadGuards } from '../auth/guards/upload.guards';
import { Project } from '../schema/project.schema';
import { ChaptersService } from '../chapters/chapters.service';
import { SUBFIELDS } from '../utils/constants';

@Controller('projects')
export class ProjectsController {
  constructor(
    private textParserService: TextParserService,
    private projectService: ProjectsService,
    private chaptersService: ChaptersService,
  ) {}

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

    const paragraphs = await this.textParserService.generateParagraphs(
      file.buffer,
      chapter,
    );

    const savedParagraphs = await this.projectService.createParagraphs(
      paragraphs,
    );

    const updatedChapter = await this.chaptersService.addParagraphsToChapter(
      chapter.id,
      savedParagraphs,
    );

    const updatedProject = await this.projectService.addChapterToProject(
      updatedChapter,
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
