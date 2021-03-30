import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChapterDeletedEvent } from '../../chapters/events/chapter-deleted.event';
import { Events } from '../../common/events.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Paragraph } from '../../schema/paragraph.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChapterDeletedListener {
  constructor(
    @InjectModel(Paragraph.name) private paragraphModel: Model<Paragraph>,
  ) {}
  @OnEvent(Events.ChapterDeleted)
  async handleOrderCreatedEvent({ chapterId }: ChapterDeletedEvent) {
    await this.paragraphModel.deleteMany().where('chapter', chapterId);
  }
}
