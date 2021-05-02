import { Field, ObjectType, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CommentType } from '../../comments/dto/comment.type';
import { UserType } from '../../users/dto/user.type';
import { User } from '../../schema/user.schema';
import { Expose, Type } from 'class-transformer';
import { AttributeType } from '../../attributes/dto/attribute.type';

@ObjectType()
export class CoordType {
  @Expose()
  @Field()
  readonly paragraphIndex: number;
  @Expose()
  @Field()
  readonly wordIndex: number;
}

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
  readonly value: string;
  @Expose()
  @Type(() => CoordType)
  @Field(() => CoordType)
  readonly start: CoordType;
  @Expose()
  @Type(() => CoordType)
  @Field(() => CoordType)
  readonly end: CoordType;
  @Expose()
  @Type(() => AttributeType)
  @Field(() => AttributeType)
  readonly attribute: AttributeType;
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
