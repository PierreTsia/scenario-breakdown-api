import { Field, ObjectType, ID } from '@nestjs/graphql';
import { CommentType } from './comment.type';
import { Project } from '../../schema/project.schema';
import { ProjectType } from '../../projects/dto/project.type';
import { Comment } from '../../schema/comment.schema';

@ObjectType()
export class CharacterType {
  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  label: string;

  @Field(() => CommentType, { nullable: true })
  comment: Comment;

  @Field(() => [CommentType], { nullable: true })
  comments: [Comment];

  @Field(() => ProjectType)
  project: Project;
}
