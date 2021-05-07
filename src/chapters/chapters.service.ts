import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter, Status } from '../schema/chapter.schema';
import { Model } from 'mongoose';
import { Project } from '../schema/project.schema';
import { Paragraph } from '../schema/paragraph.schema';
import { SUBFIELDS } from '../utils/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChapterDeletedEvent } from './events/chapter-deleted.event';
import { Events } from '../common/events.enum';
import { PaginationService } from '../pagination/pagination.service';
import { ChapterParagraphsInput } from './dto/chapter-paragraphs.input';
import { PipelineFactory } from '../factories/Pipeline.factory';
import { plainToClass } from 'class-transformer';
import NerCorpusInput from '../ner/dto/ner-corpus.input';
import NerChapterText from '../ner/dto/ner-chapter-text.input';
import { ParagraphToken } from '../ner/ner.service';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Paragraph.name) private paragraphModel: Model<Paragraph>,
    private eventEmitter: EventEmitter2,
    private paginationService: PaginationService,
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
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new BadRequestException();
    }
    const newChapter = await this.chapterModel.create({
      project: project,
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
    const pipeline = new PipelineFactory();
    pipeline.match('_id', chapterId);
    pipeline.populateAttributeEntities();
    pipeline.lookup('annotations', 'project', 'projectId', 'annotations');
    const [agg] = await this.chapterModel.aggregate(pipeline.create());
    return plainToClass(NerCorpusInput, agg);
  }

  async getChapterText(chapterId: string): Promise<any> {
    const pipeline = new PipelineFactory();
    pipeline.chapterText(chapterId);
    const [agg] = await this.paragraphModel.aggregate(pipeline.create());
    return plainToClass(NerChapterText, agg);
  }
  async findById(chapterId: string): Promise<Chapter> {
    return await this.chapterModel.findById(chapterId).exec();
  }

  async getChapterParagraphs({
    chapterId,
    limit = null,
    start,
  }: ChapterParagraphsInput): Promise<any> {
    const pipeline = new PipelineFactory();
    pipeline.match('chapterId', chapterId);
    pipeline.count(start, limit);
    const aggregate: {
      total: number;
      data: Paragraph[];
    }[] = await this.paragraphModel
      .aggregate(pipeline.create())
      .allowDiskUse(true);

    return this.paginationService.paginateResults(aggregate, limit, start);
  }
}
