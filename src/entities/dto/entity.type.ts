import { Field, ObjectType, ID } from '@nestjs/graphql';
import { UserType } from '../../users/dto/user.type';
import { ProjectType } from '../../projects/dto/project.type';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class EntityType {
  @Expose({ name: '_id' })
  @Field(() => ID)
  readonly id?: string;
  @Expose()
  @Field()
  readonly label: string;
  @Expose()
  @Field()
  readonly description: string;
  @Expose()
  @Field()
  readonly color: string;
  @Field(() => ProjectType)
  @Type(() => ProjectType)
  readonly project: ProjectType;
  @Field(() => UserType)
  readonly createdBy: UserType;
}
