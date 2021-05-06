import { Expose, Type } from 'class-transformer';

class NerParagraph {
  @Expose()
  paragraphId: string;
  @Expose()
  text: [string];
}

export default class NerChapterText {
  @Expose({ name: '_id' })
  chapterId: string;
  @Expose()
  @Type(() => NerParagraph)
  paragraphs: NerParagraph[];
}
