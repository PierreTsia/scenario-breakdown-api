export class ChapterDeletedEvent {
  chapterId: string;
  description?: string;
  constructor(chapterId: string, description?: string) {
    this.chapterId = chapterId;
    this.description = description;
  }
}
