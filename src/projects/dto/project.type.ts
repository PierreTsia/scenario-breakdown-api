import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Chapter } from '../../schema/chapter.schema';
import { ChapterType } from '../../chapters/dto/chapter.type';

@ObjectType()
export class ProjectType {
  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field()
  readonly title: string;

  @Field()
  readonly description: string;

  @Field(() => [ChapterType])
  readonly chapters: Chapter[];
}
