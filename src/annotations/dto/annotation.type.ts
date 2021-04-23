import { Field, ObjectType, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Chapter } from '../../schema/chapter.schema';
import { ChapterType } from '../../chapters/dto/chapter.type';
import { Coord } from '../../schema/annotation.schema';
import { CommentType } from '../../comments/dto/comment.type';
import { UserType } from '../../users/dto/user.type';
import { User } from '../../schema/user.schema';
import { EntityType } from '../../entities/dto/entity.type';
import { Entity } from '../../schema/entity.schema';

@ObjectType()
export class AnnotationType {
  @Field(() => ID)
  readonly id?: string;

  @Field()
  readonly chapterId: string;

  @Field()
  readonly projectId: string;

  @Field()
  @IsNotEmpty()
  readonly label: string;

  @Field(() => CoordType)
  readonly start: Coord;

  @Field(() => CoordType)
  readonly end: Coord;

  @Field(() => EntityType)
  readonly entity: Entity;

  @Field(() => UserType)
  readonly createdBy: User;

  @Field()
  readonly creationDate: string;

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
