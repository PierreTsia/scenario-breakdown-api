import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Events } from '../../common/events.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import ParagraphsAnalyzedEvent from '../../ner/events/paragraphs-analyzed.event';
import { ChaptersService } from '../chapters.service';
import { Chapter, Status } from '../../schema/chapter.schema';

@Injectable()
export class ParagraphsAnalyzedListener {
  constructor(
    private eventEmitter: EventEmitter2,
    private chaptersService: ChaptersService,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
  ) {}
  @OnEvent(Events.ParagraphsAnalyzed)
  async handleParagraphsAnalyzedEvent(event: ParagraphsAnalyzedEvent) {
    await this.chaptersService.updateChapterParagraphsTokens(
      event.paragraphsTokens,
    );
    await this.chapterModel.findByIdAndUpdate(event.chapterId, {
      status: Status.Analyzed,
    });
  }
}
