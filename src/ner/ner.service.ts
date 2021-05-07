import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from '../schema/chapter.schema';
import { Model } from 'mongoose';
import NerCorpusInput from './dto/ner-corpus.input';
import * as ner from 'wink-ner';
import * as winkTokenizer from 'wink-tokenizer';
import * as nlp from 'wink-nlp-utils';
import NerChapterText from './dto/ner-chapter-text.input';
import NerTrainingData from './dto/ner-traing-data.type';
import { Expose, plainToClass } from 'class-transformer';
import { Token } from '../projects/dto/paragraph.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChapterDeletedEvent } from '../chapters/events/chapter-deleted.event';
import { Events } from '../common/events.enum';
import ParagraphsAnalyzedEvent from './events/paragraphs-analyzed.event';
import ParagraphsAnalyzingEvent from './events/paragraphs-analyzing.event';
export class ParagraphToken {
  @Expose()
  paragraphId: string;
  @Expose()
  tokens: Token[];
}

@Injectable()
export class NerService {
  attributesNer = ner();
  corpus: NerCorpusInput;
  chapterText: NerChapterText;
  chapterId: string;
  trainingData: NerTrainingData[];

  constructor(
    private eventEmitter: EventEmitter2,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
  ) {}

  async analyze(
    corpus: NerCorpusInput,
    chapterText: NerChapterText,
    chapterId: string,
  ): Promise<void> {
    const analyzingEvent = new ParagraphsAnalyzingEvent(chapterId);
    console.log('COCUOUC', analyzingEvent);
    this.eventEmitter.emit(Events.ParagraphsAnalyzing, analyzingEvent);
    this.corpus = corpus;
    this.chapterText = chapterText;
    this.chapterId = chapterId;
    this.trainingData = await this.formatData();
    await this.attributesNer.learn(this.trainingData);
    //const learnings = this.attributesNer.exportJSON();
    await this.tokenizeParagraphs();
  }

  async tokenizeParagraphs(): Promise<void> {
    const tokenize = winkTokenizer().tokenize;
    const paragraphTokens: ParagraphToken[] = [];
    const paragraphsWords = [];
    for (const paragraph of this.chapterText.paragraphs) {
      let tokens = await tokenize(...paragraph.text);
      const words = nlp.string.removePunctuations(paragraph.text[0]).split(' ');
      paragraphsWords.push(...words);
      tokens = await this.attributesNer.recognize(tokens);
      paragraphTokens.push(
        plainToClass(ParagraphToken, {
          paragraphId: paragraph.paragraphId,
          tokens,
        }),
      );
    }
    const paragraphsAnalyzedEvent = new ParagraphsAnalyzedEvent(
      paragraphTokens,
      this.chapterId,
    );

    this.eventEmitter.emit(Events.ParagraphsAnalyzed, paragraphsAnalyzedEvent);
  }

  private async formatData(): Promise<NerTrainingData[]> {
    return this.corpus.annotations.map((annotation) => {
      const attribute = this.corpus.attributes.find(
        (attr) => attr.id === annotation.attributeId,
      );

      return plainToClass(NerTrainingData, {
        text: annotation.text,
        entityType: attribute?.entity?.id,
        uid: attribute.id,
      });
    });
  }
}
