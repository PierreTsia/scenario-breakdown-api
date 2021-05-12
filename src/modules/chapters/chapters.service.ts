import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter, Status } from '../../schema/chapter.schema';
import { Model } from 'mongoose';
import { Project } from '../../schema/project.schema';
import { Paragraph } from '../../schema/paragraph.schema';
import { SUBFIELDS } from '../../utils/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChapterDeletedEvent } from './events/chapter-deleted.event';
import { Events } from '../../common/types/events.enum';
import { PaginationService } from '../pagination/pagination.service';
import { ChapterParagraphsInput } from './dto/chapter-paragraphs.input';
import { plainToClass } from 'class-transformer';
import NerCorpusInput from '../ner/dto/ner-corpus.input';
import NerChapterText from '../ner/dto/ner-chapter-text.input';
import { ParagraphToken } from '../ner/ner.service';
import { SearchChaptersService } from './search-chapters.service';
import { ProjectsService } from '../projects/projects.service';
import { SearchParagraphsService } from './search-paragraphs.service';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Paragraph.name) private paragraphModel: Model<Paragraph>,
    private eventEmitter: EventEmitter2,
    private paginationService: PaginationService,
    private searchChaptersService: SearchChaptersService,
    private searchParagraphsService: SearchParagraphsService,
    private projectsService: ProjectsService,
  ) {}
  /* CRUD */
  async deleteChapter(
    chapterId: string,
    userId: string,
  ): Promise<{ id: string }> {
    const chapter = await this.chapterModel
      .findById(chapterId)
      .populate([SUBFIELDS.project]);
    if (!chapter || chapter.project.createdBy.id !== userId) {
      throw new BadRequestException();
    }
    try {
      const deletedChapter = await chapter.delete();

      const deletedEvent = new ChapterDeletedEvent(deletedChapter.id);
      this.eventEmitter.emit(Events.ChapterDeleted, deletedEvent);

      return { id: deletedChapter.id };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async createChapter(projectId: string, chapterName: string) {
    const project = await this.projectsService.findById(projectId);
    const newChapter = await this.chapterModel.create({
      project: project.id,
      title: chapterName,
    });

    if (!newChapter) {
      throw new BadRequestException();
    }

    return await newChapter.save();
  }

  async addParagraphsToChapter(
    chapterId: string,
    paragraphs: Paragraph[],
  ): Promise<Chapter> {
    const found = await this.chapterModel
      .findByIdAndUpdate(chapterId, {
        status: Status.Parsed,
        paragraphs,
      })
      .exec();
    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  async updateChapterParagraphsTokens(paragraphTokens: ParagraphToken[]) {
    const updatedParagraphs = [];
    for (const paragraph of paragraphTokens) {
      const updatedPar = await this.paragraphModel.findByIdAndUpdate(
        paragraph.paragraphId,

        { tokens: paragraph.tokens },
        { new: true },
      );
      updatedParagraphs.push(updatedPar);
    }
    return updatedParagraphs;
  }

  /* SEARCH DEPENDENCY CHAPTER MODEL - PARAGRAPH MODEL */
  async getChapterCorpus(chapterId: string): Promise<NerCorpusInput> {
    const [agg] = await this.searchChaptersService.chapterCorpus(chapterId);
    return plainToClass(NerCorpusInput, agg);
  }

  /*TODO SEARCH PARAGRAPH SERVICE*/
  async getChapterText(chapterId: string): Promise<any> {
    const [agg] = await this.searchParagraphsService.paragraphsTextForChapter(
      chapterId,
    );
    return plainToClass(NerChapterText, agg);
  }

  async findById(chapterId: string): Promise<Chapter> {
    return await this.chapterModel.findById(chapterId).exec();
  }

  /*TODO SEARCH PARAGRAPH SERVICE*/
  async getChapterParagraphs({
    chapterId,
    limit = null,
    start,
  }: ChapterParagraphsInput): Promise<any> {
    const aggregate: {
      total: number;
      data: Paragraph[];
    }[] = await this.searchParagraphsService.paragraphsForChapter(
      chapterId,
      start,
      limit,
    );

    return this.paginationService.paginateResults(aggregate, limit, start);
  }
}
