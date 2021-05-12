import { Field, ObjectType, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { Chapter, Status } from '../../../schema/chapter.schema';
import { ChapterType } from '../../chapters/dto/chapter.type';
import { UserType } from '../../users/dto/user.type';
import { User } from '../../../schema/user.schema';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class ProjectType {
  @Expose({ name: '_id' })
  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field()
  readonly title: string;

  @Field()
  readonly description: string;

  @Field(() => [ChapterType])
  @Type(() => ChapterType)
  readonly chapters: Chapter[];

  @Field(() => UserType)
  @Type(() => UserType)
  readonly createdBy: User;

  @Field(() => GraphQLISODateTime)
  readonly creationDate: Date;

  @Field()
  readonly status: Status;
}
