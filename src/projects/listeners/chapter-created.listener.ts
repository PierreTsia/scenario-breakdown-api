import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '../../common/events.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Paragraph } from '../../schema/paragraph.schema';
import { Model } from 'mongoose';
import { TextParserService } from '../../text-parser/text-parser.service';
import { ProjectsService } from '../projects.service';
import { ChaptersService } from '../../chapters/chapters.service';
import { ChapterCreatedEvent } from '../../chapters/events/chapter-created.event';

@Injectable()
export class ChapterCreatedListener {
  constructor(
    private textParserService: TextParserService,
    private projectService: ProjectsService,
    private chaptersService: ChaptersService,
    @InjectModel(Paragraph.name) private paragraphModel: Model<Paragraph>,
  ) {}
  @OnEvent(Events.ChapterCreated)
  async handleChapterCreatedEvent({ chapter, file }: ChapterCreatedEvent) {
    const paragraphs = await this.textParserService.generateParagraphs(
      file.buffer,
      chapter,
    );
    const savedParagraphs = await this.projectService.createParagraphs(
      paragraphs,
    );

    await this.chaptersService.addParagraphsToChapter(
      chapter.id,
      savedParagraphs,
    );
  }
}
