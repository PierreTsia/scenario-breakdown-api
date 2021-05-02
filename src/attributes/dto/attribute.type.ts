import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EntityType } from '../../entities/dto/entity.type';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class AttributeType {
  @Expose({ name: '_id' })
  @Field()
  id: string;
  @Expose()
  @Field()
  slug: string;
  @Expose()
  @Field(() => ID)
  projectId: string;
  @Expose()
  @Type(() => EntityType)
  @Field(() => EntityType)
  entity: EntityType;
}
