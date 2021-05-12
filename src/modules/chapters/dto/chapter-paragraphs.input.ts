import { Field, InputType } from '@nestjs/graphql';
import { PaginatedInput } from '../../pagination/dto/paginated.input';

@InputType()
export class ChapterParagraphsInput extends PaginatedInput {
  @Field()
  readonly chapterId: string;
}
