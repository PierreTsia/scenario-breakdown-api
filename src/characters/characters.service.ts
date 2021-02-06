import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from '../schema/character.schema';
import { Comment } from '../schema/comment.schema';
import { Project } from '../schema/project.schema';
import { Chapter } from '../schema/chapter.schema';
import { CreateCharacterInput } from './dto/create-character.input';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { UpdateCharacterInput } from './dto/update-character.input';
import { pickBy } from 'lodash';
import { CommentCharacterInput } from './dto/comment-character.input';
import { SUBFIELDS } from '../schema/populate-subfields.helper';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel(Character.name) private characterModel: Model<Character>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    private usersService: UsersService,
    private projectsService: ProjectsService,
  ) {}
  async find(id: string) {
    const found = await this.characterModel
      .findById(id)
      .populate([SUBFIELDS.project, SUBFIELDS.comments])
      .exec();
    if (!found) {
      throw new BadRequestException();
    }
    console.log(found);
    return found;
  }

  async create(
    { projectId, description, label }: CreateCharacterInput,
    userId: string,
  ) {
    const user = await this.usersService.findById(userId);
    const project = await this.projectsService.findById(projectId);

    if (!user || !project) {
      throw new BadRequestException();
    }
    const newChar = await this.characterModel.create({
      createBy: user,
      description,
      label,
      project,
    });

    if (!newChar) {
      throw new InternalServerErrorException();
    }
    return await newChar.save();
  }

  async comment(input: CommentCharacterInput, userId: string) {
    const user = await this.usersService.findById(userId);
    const character = await this.characterModel.findById(input.characterId);
    if (!character || !user) {
      throw new BadRequestException();
    }
    const newComment = await this.commentModel.create({
      ...input,
      createdBy: user,
      createdAt: new Date(),
    });
    if (!newComment) {
      throw new InternalServerErrorException();
    }
    const savedComment = await newComment.save();

    const updatedChar = await this.characterModel
      .findByIdAndUpdate(
        character.id,
        { $push: { comments: savedComment } },
        { new: true },
      )
      .populate([SUBFIELDS.project, SUBFIELDS.comments])
      .exec();

    console.log(updatedChar);
    return updatedChar;
  }

  async update(input: UpdateCharacterInput, userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const updates = pickBy({ ...input });
    const updatedChar = await this.characterModel
      .findByIdAndUpdate(input.id, { ...updates }, { new: true })
      .exec();

    if (!updatedChar) {
      throw new BadRequestException();
    }

    return updatedChar;
  }

  async getAll() {
    return this.characterModel
      .find()
      .populate([SUBFIELDS.project, SUBFIELDS.comments]);
  }
  /*
  async getOne() {}
  async delete() {}
  */
}
