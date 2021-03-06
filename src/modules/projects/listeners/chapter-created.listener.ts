import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Events } from '../../../common/types/events.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Paragraph } from '../../../schema/paragraph.schema';
import { Model } from 'mongoose';
import { TextParserService } from '../../text-parser/text-parser.service';
import { ChaptersService } from '../../chapters/chapters.service';
import { ChapterCreatedEvent } from '../../chapters/events/chapter-created.event';
import { ParagraphsCreatedEvent } from '../events/paragraphs-created.event';
import { ParagraphsService } from '../../paragraphs/paragraphs.service';

@Injectable()
export class ChapterCreatedListener {
  constructor(
    private textParserService: TextParserService,
    private chaptersService: ChaptersService,
    private eventEmitter: EventEmitter2,
    private paragraphsService: ParagraphsService,
    @InjectModel(Paragraph.name) private paragraphModel: Model<Paragraph>,
  ) {}
  @OnEvent(Events.ChapterCreated)
  async handleChapterCreatedEvent({
    chapter,
    file,
    projectId,
  }: ChapterCreatedEvent) {
    const paragraphs = await this.textParserService.generateParagraphs(
      file.buffer,
      chapter,
      projectId,
    );

    const savedParagraphs = await this.paragraphsService.createParagraphs(
      paragraphs,
    );
    const event = new ParagraphsCreatedEvent(chapter.id, savedParagraphs);
    this.eventEmitter.emit(Events.ParagraphsCreated, event);

    await this.chaptersService.addParagraphsToChapter(
      chapter.id,
      savedParagraphs,
    );
  }
}
