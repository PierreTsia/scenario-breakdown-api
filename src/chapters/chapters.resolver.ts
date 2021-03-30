import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AllExceptionsFilter } from '../utils/exceptions.filters';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { CurrentUser } from '../auth/current-user.decorator';

import { ChaptersService } from './chapters.service';
import { DeletedType } from '../common/dtos/deleted.type';

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
}
