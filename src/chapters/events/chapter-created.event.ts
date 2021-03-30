import { Chapter } from '../../schema/chapter.schema';

export class ChapterCreatedEvent {
  chapter: Chapter;
  file: { buffer: any };
  description?: string;
  constructor(chapter: Chapter, file: { buffer: any }, description?: string) {
    this.chapter = chapter;
    this.file = file;
    this.description = description;
  }
}
