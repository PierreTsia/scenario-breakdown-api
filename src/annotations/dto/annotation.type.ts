import { Field, ObjectType, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Chapter } from '../../schema/chapter.schema';
import { ChapterType } from '../../chapters/dto/chapter.type';
import { Coord } from '../../schema/annotation.schema';
import { CommentType } from '../../comments/dto/comment.type';
import { UserType } from '../../users/dto/user.type';
import { User } from '../../schema/user.schema';

@ObjectType()
export class AnnotationType {
  @Field(() => ID)
  readonly id?: string;

  @Field(() => ChapterType)
  readonly chapter: Chapter;

  @Field()
  @IsNotEmpty()
  readonly label: string;

  @Field(() => CoordType)
  readonly start: Coord;

  @Field(() => CoordType)
  readonly end: Coord;

  @Field()
  readonly type: string;

  @Field(() => UserType)
  createdBy: User;

  @Field()
  createdAt: string;

  @Field(() => [CommentType])
  readonly comments: Comment[];
}

@ObjectType()
export class CoordType {
  @Field()
  readonly paragraphIndex: number;
  @Field()
  readonly wordIndex: number;
}
