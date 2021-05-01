import { Field, ObjectType, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Coord } from '../../schema/annotation.schema';
import { CommentType } from '../../comments/dto/comment.type';
import { UserType } from '../../users/dto/user.type';
import { User } from '../../schema/user.schema';
import { EntityType } from '../../entities/dto/entity.type';
import { Entity } from '../../schema/entity.schema';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class AnnotationType {
  @Expose({ name: '_id' })
  @Field(() => ID)
  readonly id?: string;
  @Expose()
  @Field()
  readonly chapterId: string;
  @Expose()
  @Field()
  readonly projectId: string;
  @Expose()
  @Field()
  @IsNotEmpty()
  readonly label: string;
  @Expose()
  @Field()
  @IsNotEmpty()
  readonly value: string;
  @Expose()
  @Type(() => CoordType)
  @Field(() => CoordType)
  readonly start: Coord;
  @Expose()
  @Type(() => CoordType)
  @Field(() => CoordType)
  readonly end: Coord;
  @Expose()
  @Type(() => EntityType)
  @Field(() => EntityType)
  readonly entity: Entity;
  @Expose()
  @Type(() => UserType)
  @Field(() => UserType)
  readonly createdBy: User;
  @Expose()
  @Field(() => GraphQLISODateTime)
  readonly creationDate: Date;
  @Expose()
  @Type(() => CommentType)
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
