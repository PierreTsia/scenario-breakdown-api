import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationMeta } from '../pagination.service';

@ObjectType()
export class PaginatedType {
  @Field(() => PaginationMetaType)
  readonly meta: PaginationMeta;
}

@ObjectType()
export class PaginationMetaType {
  @Field()
  result: number;
  @Field()
  total: number;
  @Field()
  pageNumber: number;
  @Field()
  pagesCount: number;
  @Field()
  pageSize: number;
}
