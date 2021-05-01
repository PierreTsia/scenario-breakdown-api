import { Field, ObjectType, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { UserType } from '../../users/dto/user.type';
import { Project } from '../../schema/project.schema';
import { ProjectType } from '../../projects/dto/project.type';
import { ChapterType } from '../../chapters/dto/chapter.type';
import { Chapter } from '../../schema/chapter.schema';

@ObjectType()
export class CommentType {
  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field()
  content: string;

  @Field(() => GraphQLISODateTime)
  creationDate: Date;

  @Field(() => UserType)
  createdBy: UserType;

  @Field(() => ProjectType, { nullable: true })
  project?: Project;

  @Field(() => ChapterType, { nullable: true })
  chapter?: Chapter;
}
