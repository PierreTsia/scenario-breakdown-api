import { Injectable } from '@nestjs/common';
import * as mammoth from 'mammoth';
import * as fs from 'fs';
import * as path from 'path';
import { Chapter } from '../schema/chapter.schema';
import { Paragraph } from '../schema/paragraph.schema';
import { REGXP, HTML_SEPARATOR } from '../utils/constants';

@Injectable()
export class TextParserService {
  async generateParagraphs(
    buffer: Buffer,
    chapter: Chapter,
  ): Promise<Paragraph[]> {
    const { value } = await this.convertDocx(buffer);
    return await this.formatParagraphs(value, chapter);
  }

  sanitizeHtml(html: any): string[] {
    return JSON.stringify(html)
      .substr(1, JSON.stringify(html).length - 2)
      .replace(REGXP.OL, HTML_SEPARATOR)
      .replace(REGXP.OL_CLOSED, '</p>')
      .replace(REGXP.H1, HTML_SEPARATOR)
      .replace(REGXP.H1_CLOSED, '</p>')
      .replace(REGXP.P, HTML_SEPARATOR)
      .split(HTML_SEPARATOR);
  }

  async formatParagraphs(value: any, chapter: Chapter): Promise<Paragraph[]> {
    return this.sanitizeHtml(value).reduce((acc, par, i) => {
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

  async convertDocx(
    buffer: Buffer,
  ): Promise<{ value: string; messages: string[] }> {
    await fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buffer);

    return await mammoth.convertToHtml({
      path: path.resolve(__dirname, 'output.docx'),
    });
  }
}
