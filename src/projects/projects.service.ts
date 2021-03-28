import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectInput } from './dto/project.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../schema/project.schema';
import { UsersService } from '../users/users.service';
import { Chapter } from '../schema/chapter.schema';
import { RawLinesType } from './dto/raw-lines.type';
import { ChapterTextInput } from '../chapters/dto/chapter-text.input';
import { getArrayLimits } from '../utils/helpers.utils';
import { SearchParagraphsInput } from './dto/search-paragraphs.input';
import { Paragraph } from '../schema/paragraph.schema';
import { fuzzyMatch } from '../helpers';
import { SearchResultType } from './dto/search-result.type';
import { SUBFIELDS } from '../utils/constants';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Paragraph.name) private paragraphModel: Model<Paragraph>,
    private userService: UsersService,
  ) {}

  async findById(projectId: string) {
    const found = await this.projectModel
      .findById(projectId)
      .populate([SUBFIELDS.createdBy, SUBFIELDS.chapters]);
    if (!found) {
      throw new BadRequestException();
    }
    return found;
  }

  async findProject(userId: string, projectId: string) {
    const project = await this.findById(projectId);
    if (!project) {
      throw new BadRequestException(`No project found with id ${projectId}`);
    } else if (project.createdBy?.id !== userId) {
      throw new UnauthorizedException();
    }
    return project;
  }

  async create(
    createProjectInput: ProjectInput,
    userId: string,
  ): Promise<Project> {
    const user = await this.userService.findById(userId);
    const newProject = await this.projectModel.create({
      ...createProjectInput,
      createdBy: user,
    });
    if (!newProject) {
      throw new BadRequestException();
    }
    return await newProject.save();
  }

  async delete(projectId: string, userId: string) {
    const toDelete = await this.projectModel
      .find({ _id: projectId })
      .where('createdBy')
      .equals(userId);

    if (!toDelete.length) {
      throw new NotFoundException();
    }

    const { deletedCount } = await this.projectModel.deleteOne({
      _id: projectId,
    });
    return deletedCount;
  }

  async findUserProjects(userId: string): Promise<Project[]> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const projects = await this.projectModel
      .find({ createdBy: user })
      .populate([SUBFIELDS.chapters, SUBFIELDS.createdBy])
      .exec();

    return projects;
  }

  // TODO PARAGRAPH SERVICE
  async createParagraphs(paragraphs: Paragraph[]) {
    const saved = await this.paragraphModel.insertMany(paragraphs);
    if (!saved) {
      throw new InternalServerErrorException();
    }

    return saved;
  }

  async addChapterToProject(chapter: Chapter, projectId: string) {
    const updateProject = await this.projectModel.findById(projectId, {});

    if (!updateProject) {
      throw new BadRequestException();
    }
    updateProject.chapters.push(chapter);

    return await updateProject.save();
  }

  async getChapterParagraphs(input: ChapterTextInput): Promise<RawLinesType[]> {
    const { chapterId } = input;
    const chapter = await this.chapterModel
      .findById(chapterId)
      .populate([SUBFIELDS.paragraphs]);
    if (!chapter) {
      throw new BadRequestException();
    }
    const allParagraphs = chapter.paragraphs.map((p, i) => ({
      text: p.words.join(' '),
      line: i,
    }));
    const { start, end } = getArrayLimits(
      input.start,
      input.end,
      allParagraphs.length,
    );
    return allParagraphs.slice(start, end);
  }

  async searchParagraphs(
    searchInput: SearchParagraphsInput,
  ): Promise<SearchResultType[]> {
    const { chapterId, queryString, projectWide } = searchInput;
    const paragraphs: Paragraph[] = await (this.paragraphModel as any)
      .fuzzySearch(queryString)
      .populate(SUBFIELDS.chapter);

    const searchedSample = projectWide
      ? paragraphs
      : paragraphs.filter((p) => p.chapter.id === chapterId);

    return searchedSample.reduce((acc, p) => {
      const found = p.words
        .filter((w) => fuzzyMatch(w.toLowerCase(), queryString.toLowerCase()))
        .map((foundWord) => {
          const wordIndex = p.words.indexOf(foundWord);
          const { start, end } = getArrayLimits(
            wordIndex - 5,
            wordIndex + 5,
            p.words.length,
          );
          return {
            paragraph: p,
            paragraphIndex: p.index,
            wordIndex,
            label: foundWord,
            extract: p.words.slice(start, end).join(' '),
          };
        });

      return [...acc, ...found];
    }, []);
  }
}
