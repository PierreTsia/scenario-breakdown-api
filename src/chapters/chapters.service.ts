import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from '../schema/chapter.schema';
import { Model } from 'mongoose';
import { Project } from '../schema/project.schema';
import { Paragraph } from '../schema/paragraph.schema';
import { SUBFIELDS } from '../utils/constants';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
  ) {}

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
        paragraphs,
      })
      .exec();
    if (!found) {
      throw new BadRequestException('ici');
    }
    return found;
  }
}
