import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectInput } from './dto/project.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../schema/project.schema';
import { UsersService } from '../users/users.service';
import { Chapter } from '../schema/chapter.schema';
import { WordType } from '../text-parser/dto/word.type';
import { Word } from '../text-parser/word.schema';
import { RawLinesType } from './dto/raw-lines.type';
import { ChapterTextInput } from './dto/chapter-text.input';
import { RawTextType } from './dto/raw-text.type';
import { getArrayLimits } from '../utils/helpers.utils';
import { SearchWordsResultsType } from './dto/search-words-results.type';
import { SearchWordsInput } from './dto/search-words.input';
import { Paragraph } from '../schema/paragraph.schema';
import { fuzzyMatch } from '../helpers';
import { SearchResultType } from './dto/search-result.type';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Word.name) private wordModel: Model<Word>,
    @InjectModel(Paragraph.name) private paragraphModel: Model<Paragraph>,
    private userService: UsersService,
  ) {}

  async findById(projectId: string) {
    const found = await this.projectModel.findById(projectId);
    if (!found) {
      throw new BadRequestException();
    }
    return found;
  }

  async create(
    createProjectInput: ProjectInput,
    userId: string,
  ): Promise<Project> {
    const newProject = await this.projectModel.create({
      ...createProjectInput,
      user: userId,
    });
    if (!newProject) {
      throw new BadRequestException();
    }
    return await newProject.save();
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

  async addTextToChapter(chapterId: string, text: string[]): Promise<Chapter> {
    const found = await this.chapterModel
      .findByIdAndUpdate(chapterId, {
        text,
      })
      .exec();
    if (!found) {
      throw new BadRequestException();
    }
    return found;
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

  async findUserProjects(userId: string): Promise<Project[]> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.projectModel.find({ user: userId });
  }

  async populateWords(wordsRaw: WordType[]) {
    return await this.wordModel.insertMany(wordsRaw);
  }

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

  async getLinesText(input: ChapterTextInput): Promise<RawLinesType[]> {
    const { chapterId } = input;
    const chapter = await this.chapterModel.findById(chapterId);
    if (!chapter) {
      throw new BadRequestException();
    }
    const allLines = [].map((l, i) => ({ text: l, line: i }));
    const { start, end } = getArrayLimits(
      input.start,
      input.end,
      allLines.length,
    );
    return allLines.slice(start, end);
  }

  async getFullText(chapterId: string): Promise<RawTextType> {
    const chapter = await this.chapterModel.findById(chapterId);
    if (!chapter) {
      throw new BadRequestException();
    }
    return { text: 'chapter.text.join' };
  }

  async searchWords(
    searchInput: SearchWordsInput,
  ): Promise<SearchWordsResultsType> {
    const { chapterId, queryString, projectWide } = searchInput;
    const words = await (this.wordModel as any)
      .fuzzySearch(queryString)
      .populate({ path: 'chapter', model: 'Chapter' });

    const foundWords = projectWide
      ? words
      : words.filter((w: Word) => w.chapter.id === chapterId);

    const results = this.mapResults(foundWords);

    return {
      count: foundWords.length,
      results,
    };
  }

  async searchParagraphs(
    searchInput: SearchWordsInput,
  ): Promise<SearchResultType[]> {
    const { chapterId, queryString, projectWide } = searchInput;
    const paragraphs: Paragraph[] = await (this.paragraphModel as any)
      .fuzzySearch(queryString)
      .populate({ path: 'chapter', model: 'Chapter' });

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

  mapResults(words: Word[]): { word: Word; extract: string }[] {
    return words.map((w: Word) => {
      const { start, end } = getArrayLimits(
        w.paragraphIndex - 1,
        w.paragraphIndex + 1,
        1,
      );
      const wordExtract = [];
      return { word: w, extract: wordExtract.join(' ') };
    });
  }
}
