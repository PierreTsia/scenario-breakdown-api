import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectInput } from './dto/project.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../schema/project.schema';
import { UsersService } from '../users/users.service';
import { Chapter } from '../schema/chapter.schema';
import { Paragraph } from '../schema/paragraph.schema';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '../common/events.enum';
import { ProjectDeletedEvent } from './events/project-deleted.event';
import { PipelineFactory } from '../factories/Pipeline.factory';
import { classToPlain, plainToClass } from 'class-transformer';
import { ProjectType } from './dto/project.type';
import { ParagraphType } from './dto/paragraph.type';
import { SearchProjectsService } from './search-projects.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Paragraph.name) private paragraphModel: Model<Paragraph>,
    private userService: UsersService,
    private searchProjectsService: SearchProjectsService,
    private eventEmitter: EventEmitter2,
  ) {}

  /* 🛠 CRUD */
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
    const deleteEvent = new ProjectDeletedEvent(projectId);
    this.eventEmitter.emit(Events.ProjectDeleted, deleteEvent);
    return deletedCount;
  }

  // TODO PARAGRAPH SERVICE
  async createParagraphs(paragraphs: ParagraphType[]) {
    const par = classToPlain(paragraphs);
    const saved = await this.paragraphModel.insertMany(par as Paragraph[]);
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

  /* 🔎 SEARCH */
  async findById(projectId: string) {
    const [res] = await this.searchProjectsService.projectById(projectId);
    if (!res) {
      throw new BadRequestException(`Project not found with id ${projectId}`);
    }
    return plainToClass(ProjectType, res);
  }

  async findUserProjects(userId: string): Promise<ProjectType[]> {
    const projectDocs = await this.searchProjectsService.projectsByUser(userId);
    return projectDocs.map((d) => plainToClass(ProjectType, d));
  }
}
