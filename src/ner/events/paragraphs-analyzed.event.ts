import { ParagraphToken } from '../ner.service';

export default class ParagraphsAnalyzedEvent {
  paragraphsTokens: ParagraphToken[];
  chapterId: string;
  constructor(paragraphsTokens: ParagraphToken[], chapterId: string) {
    this.paragraphsTokens = paragraphsTokens;
    this.chapterId = chapterId;
  }
}
