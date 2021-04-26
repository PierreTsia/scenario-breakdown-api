import { Chapter } from '../../schema/chapter.schema';

export class ChapterCreatedEvent {
  chapter: Chapter;
  file: { buffer: any };
  projectId: string;
  description?: string;
  constructor(
    chapter: Chapter,
    file: { buffer: any },
    projectId: string,
    description?: string,
  ) {
    this.chapter = chapter;
    this.file = file;
    this.description = description;
    this.projectId = projectId;
  }
}
