import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Events } from '../../common/events.enum';
import { ProjectDeletedEvent } from '../../projects/events/project-deleted.event';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter } from '../../schema/chapter.schema';
import { ChapterDeletedEvent } from '../events/chapter-deleted.event';

@Injectable()
export class ProjectDeletedListener {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
  ) {}
  @OnEvent(Events.ProjectDeleted)
  async handleOrderCreatedEvent({ projectId }: ProjectDeletedEvent) {
    const chaptersToDelete = await this.chapterModel
      .find()
      .where('project', projectId);
    for (const chapter of chaptersToDelete) {
      await chapter.delete();
      const event = new ChapterDeletedEvent(chapter.id);
      this.eventEmitter.emit(Events.ChapterDeleted, event);
    }
  }
}
