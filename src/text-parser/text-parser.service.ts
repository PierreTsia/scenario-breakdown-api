import { Injectable } from '@nestjs/common';
import { WordType } from './dto/word.type';
import * as mammoth from 'mammoth';
import * as fs from 'fs';
import * as path from 'path';
import { plainToClass } from 'class-transformer';
import { Chapter } from '../schema/chapter.schema';
import { Paragraph } from '../schema/paragraph.schema';

@Injectable()
export class TextParserService {
  async generateParagraphs(
    buffer: Buffer,
    chapter: Chapter,
  ): Promise<Paragraph[]> {
    const { value } = await this.convertDocx(buffer);
    return await this.formatParagraphs(value, chapter);
  }

  async formatParagraphs(value: any, chapter: Chapter): Promise<Paragraph[]> {
    return JSON.stringify(value)
      .substr(1, JSON.stringify(value).length - 2)
      .replace(/<ol[^>]*>/g, '__START__%P')
      .replace(/<\/?ol[^>]*>/g, '</p>')
      .replace(/<h1[^>]*>/g, '__START__%P')
      .replace(/<\/?h1[^>]*>/g, '</p>')
      .replace(/<p[^>]*>/g, '__START__%P')
      .split('__START__%P')
      .reduce((acc, par, i) => {
        console.log(par);
        return par.length > 1
          ? [
              ...acc,
              {
                index: i,
                chapter,
                words: par
                  .replace(/<[^>]*>/g, '')
                  .split(' ')
                  .filter((w) => w.length),
                annotations: [],
              },
            ]
          : acc;
      }, []);
  }

  /*
  async extractParagraphsContent(value: any): Promise<ParagraphType[]> {
    return JSON.stringify(value)
      .substr(1, JSON.stringify(value).length - 2)
      .replace(/<ol[^>]*>/g, '__START__%P')
      .replace(/<\/?ol[^>]*>/g, '</p>')
      .replace(/<h1[^>]*>/g, '__START__%P')
      .replace(/<\/?h1[^>]*>/g, '</p>')
      .replace(/<p[^>]*>/g, '__START__%P')
      .split('__START__')
      .reduce((acc, par, i) => {
        return par.length > 1
          ? [
              ...acc,
              {
                html: par.replace(/%P/g, `<p id="paragraph_${i}">`),
                text: par.replace(/%P/g, ``).replace(/<[^>]*>/g, ''),
              },
            ]
          : acc;
      }, []);
  }
*/

  /*async buildParagraphs(
    buffer: Buffer,
    chapter: Chapter,
  ): Promise<{
    wordsByParagraphs: WordType[][];
    text: string[];
    html: string;
  }> {
    //const json = await this.convertDocx(buffer);
    const { value } = await this.convertDocx(buffer);
    const paragraphs: ParagraphType[] = await this.extractParagraphsContent(
      value,
    );
    console.log(paragraphs);
    const { text, html } = paragraphs.reduce(
      (acc, p) => {
        acc.html += p.html;
        acc.text.push(p.text);
        return acc;
      },
      {
        text: [],
        html: '',
      },
    );
    const wordsByParagraphs = this.extractWords(paragraphs, chapter);
    /!* const rawText = this.extractRawText(json);
    const rawLines = this.parseLines(rawText, chapter);
    const wordsByLine: string[] = rawLines.reduce((acc, line) => {
      return [...acc, line.map((l) => l.label).join(' ')];
    }, [] as string[]);

    return {
      words: this.flatten(rawLines),
      text: wordsByLine,
    };*!/

    return {
      wordsByParagraphs,
      text,
      html,
    };
  }*/

  /*extractWords(paragraphs: ParagraphType[], chapter: Chapter): WordType[][] {
    return paragraphs.map(
      (p: { html: string; text: string }, paragraphIndex) => {
        const words: string[] = p.text.split(' ');
        return words.reduce((acc, w, wordIndex) => {
          return w.length
            ? [
                ...acc,
                {
                  chapter,
                  ...plainToClass(WordType, {
                    label: w,
                    paragraphIndex,
                    wordIndex,
                  }),
                },
              ]
            : acc;
        }, []);
      },
    );
  }*/

  parseLines(lines: string[], chapter: Chapter): WordType[][] {
    return lines.map((line: string, lineIndex: number) => {
      const words: string[] = line.split(' ');
      return words.reduce((acc, w, wordIndex) => {
        return w.length
          ? [
              ...acc,
              {
                chapter,
                ...plainToClass(WordType, {
                  label: w,
                  lineIndex,
                  wordIndex,
                }),
              },
            ]
          : acc;
      }, []);
    });
  }

  flatten(lines: WordType[][]): WordType[] {
    return lines.flat();
  }

  extractRawText(json: any): string[] {
    return json.reduce(
      (acc: string[], node: { text?: string; items?: any[] }) => {
        let text = node?.text?.trim() ?? '';
        if (Array.isArray(node.items)) {
          text += node.items
            .map((child) => child?.text ?? '')
            .join(' ')
            .trim();
        }
        return text.length ? [...acc, text] : acc;
      },
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
