import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Events } from '../../../common/types/events.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ChaptersService } from '../chapters.service';
import { Chapter, Status } from '../../../schema/chapter.schema';

@Injectable()
export class ParagraphsAnalyzingListener {
  constructor(
    private eventEmitter: EventEmitter2,
    private chaptersService: ChaptersService,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
  ) {}
  @OnEvent(Events.ParagraphsAnalyzing)
  async handleParagraphsAnalyzingEvent({ chapterId }: { chapterId: string }) {
    await this.chapterModel.findByIdAndUpdate(chapterId, {
      status: Status.Uploaded,
    });
  }
}
