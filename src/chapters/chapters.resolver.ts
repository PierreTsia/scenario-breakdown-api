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
import { ParagraphType } from '../projects/dto/paragraph.type';
import { Paragraph } from '../schema/paragraph.schema';

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
  @Query(() => [ParagraphType])
  async chapterParagraphs(
    @CurrentUser() user: { id: string },
    @Args('chapterId') chapterId: string,
  ): Promise<Paragraph[]> {
    return this.chaptersService.getChapterParagraphs(chapterId);
  }
}
