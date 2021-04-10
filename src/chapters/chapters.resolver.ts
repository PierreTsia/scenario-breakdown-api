import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AllExceptionsFilter } from '../utils/exceptions.filters';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { CurrentUser } from '../auth/current-user.decorator';

import { ChaptersService } from './chapters.service';
import { DeletedType } from '../common/dtos/deleted.type';
import { PaginatedParagraphType } from '../projects/dto/paragraph.type';
import { ChapterParagraphsInput } from './dto/chapter-paragraphs.input';

@Resolver()
export class ChaptersResolver {
  constructor(private chaptersService: ChaptersService) {}
  @Roles(Role.Member)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => DeletedType)
  async deleteChapter(
    @CurrentUser() user: { id: string },
    @Args('chapterId') chapterId: string,
  ): Promise<{ id: string }> {
    return this.chaptersService.deleteChapter(chapterId, user.id);
  }

  @Roles(Role.Member)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => PaginatedParagraphType)
  async chapterParagraphs(
    @CurrentUser() user: { id: string },
    @Args('chapterParagraphsInput') input: ChapterParagraphsInput,
  ): Promise<any> {
    return this.chaptersService.getChapterParagraphs(input);
  }
}
