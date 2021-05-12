import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationMetaType {
  @Field()
  result: number;
  @Field()
  total: number;
  @Field({ nullable: true })
  pageIndex: number;
  @Field()
  pagesCount: number;
  @Field()
  pageSize: number;
}
@ObjectType()
export class PaginatedType {
  @Field(() => PaginationMetaType)
  readonly meta: PaginationMetaType;
}
