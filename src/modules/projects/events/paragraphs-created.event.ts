import { Paragraph } from '../../../schema/paragraph.schema';

export class ParagraphsCreatedEvent {
  paragraphs: Paragraph[];
  chapterId: string;
  description?: string;
  constructor(
    chapterId: string,
    paragraphs: Paragraph[],
    description?: string,
  ) {
    this.paragraphs = paragraphs;
    this.chapterId = chapterId;
    this.description = description;
  }
}
