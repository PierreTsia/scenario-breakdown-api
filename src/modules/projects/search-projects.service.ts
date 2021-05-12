import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Pipe, SearchService } from '../../common/services/search/search.service';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from '../../schema/project.schema';
// noinspection JSMethodCanBeStatic
@Injectable()
export class SearchProjectsService extends SearchService<Project> {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {
    super(projectModel);
  }

  async projectById(projectId: string, includeParagraphs = false) {
    this.init();
    this.match('_id', projectId);
    this.populateCreator();
    //💵 💵 costly aggregation
    this.projectChapters(includeParagraphs);
    return await this.search();
  }

  async projectsByUser(userId: string) {
    this.init();
    this.matchCreator(userId);
    this.populateCreator();
    this.projectChapters(false);
    return await this.search();
  }

  private projectChapters(includeParagraphs: boolean) {
    const paragraphsPipe = {
      $lookup: {
        from: 'paragraphs',
        let: { chapterId: '$_id' },
        pipeline: [{ $match: { $expr: { $eq: ['$chapter', '$$chapterId'] } } }],
        as: 'paragraphs',
      },
    };
    const pipeline: Pipe[] = [
      { $match: { $expr: { $eq: ['$project', '$$projectId'] } } },
    ];

    if (includeParagraphs) {
      pipeline.push(paragraphsPipe);
    }
    this.addToSearchPipe([
      {
        $lookup: {
          let: { projectId: '$_id' },
          from: 'chapters',
          pipeline,
          as: 'chapters',
        },
      },
    ]);
  }
}
