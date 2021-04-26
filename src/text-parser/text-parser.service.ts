import { Injectable } from '@nestjs/common';
import * as mammoth from 'mammoth';
import * as fs from 'fs';
import * as path from 'path';
import { Chapter } from '../schema/chapter.schema';
import { plainToClass } from 'class-transformer';

import * as tokenizer from 'wink-tokenizer';
import * as utils from 'wink-nlp-utils';
import { SECTION_LIMIT, REGXP } from '../utils/constants';
import { ParagraphType } from '../projects/dto/paragraph.type';

type TransformFunction = (arg: unknown) => unknown;

const STR_REPLACE: [RegExp, string][] = [
  [REGXP.OL, SECTION_LIMIT],
  [REGXP.OL_CLOSED, '</p>'],
  [REGXP.H1, SECTION_LIMIT],
  [REGXP.H1_CLOSED, '</p>'],
  [REGXP.P, SECTION_LIMIT],
];

abstract class TransformPipe {
  fns: TransformFunction[] = [];
  data!: unknown;
  protected constructor(data: unknown) {
    this.data = data;
  }

  addToPipe(fns: TransformFunction[]): void {
    this.fns = [...this.fns, ...fns];
  }

  execute(): void {
    if (this.fns?.length) {
      this.fns.forEach((f) => {
        this.data = f(this.data);
      });
    }
  }

  get(): unknown {
    return this.data;
  }
}

class TextReplacePipe extends TransformPipe {
  constructor(data: string, entries: [RegExp, string][]) {
    super(data);
    this.addToPipe(this.replaceFns(entries));
  }

  replaceFns(entries: [RegExp | string, string][]): TransformFunction[] {
    return entries.map(([regexp, replaceValue]) => (s: string) =>
      s.replace(regexp, replaceValue),
    );
  }
}

class SanitizeWordToHtmlTextPipe extends TextReplacePipe {
  constructor(data: string) {
    super(data, STR_REPLACE);
    this.addToPipe([
      utils.string.removeHTMLTags,
      utils.string.removeExtraSpaces,
      (s: string) => s.split(SECTION_LIMIT),
    ]);
  }
}

@Injectable()
export class TextParserService {
  async convertToWords(
    buffer: Buffer,
    chapter: Chapter,
    projectId: string,
  ): Promise<ParagraphType[]> {
    const { value } = await this.convertDocx(buffer);

    return await this.formatParagraphs(value, chapter, projectId);
  }

  async generateParagraphs(
    buffer: Buffer,
    chapter: Chapter,
    projectId: string,
  ): Promise<ParagraphType[]> {
    const { value } = await this.convertDocx(buffer);
    return await this.formatParagraphs(value, chapter, projectId);
  }

  sanitizeParagraphs(html: any): string[] {
    const textSanitizer = new SanitizeWordToHtmlTextPipe(html);
    textSanitizer.execute();
    return textSanitizer.get() as string[];
  }

  async formatParagraphs(
    value: string,
    chapter: Chapter,
    projectId: string,
  ): Promise<ParagraphType[]> {
    const TokenFactory = tokenizer();
    TokenFactory.defineConfig({ quoted_phrase: true });
    return this.sanitizeParagraphs(value).reduce(
      (acc, par, i) =>
        par.length
          ? [
              ...acc,
              plainToClass(ParagraphType, {
                tokens: TokenFactory.tokenize(par),
                chapterId: chapter.id,
                projectId,
                fullText: par,
                index: i,
              }),
            ]
          : acc,
      [],
    );
  }

  async convertDocx(
    buffer: Buffer,
  ): Promise<{ value: string; messages: string[] }> {
    await fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buffer);

    return await mammoth.convertToHtml({
      path: path.resolve(__dirname, 'output.docx'),
    });
  }
}
