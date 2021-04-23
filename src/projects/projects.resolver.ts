import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { UseFilters, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guards';
import { ProjectType } from './dto/project.type';
import { ProjectInput } from './dto/project.input';
import { CurrentUser } from '../auth/current-user.decorator';
import { Project } from '../schema/project.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AllExceptionsFilter } from '../utils/exceptions.filters';
import { SearchParagraphsInput } from './dto/search-paragraphs.input';
import { SearchResultType } from './dto/search-result.type';

@Resolver()
export class ProjectsResolver {
  constructor(private projectService: ProjectsService) {}
  @Roles(Role.Member)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => ProjectType)
  async createProject(
    @CurrentUser() user: { id: string },
    @Args('projectInput') input: ProjectInput,
  ): Promise<Project> {
    return this.projectService.create(input, user.id);
  }

  @Roles(Role.Admin)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Number)
  async deleteProject(
    @CurrentUser() user: { id: string },
    @Args('projectId') projectId: string,
  ): Promise<number> {
    return this.projectService.delete(projectId, user.id);
  }

  @Roles(Role.Member)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [ProjectType])
  async projects(@CurrentUser() user: { id: string }): Promise<ProjectType[]> {
    return this.projectService.findUserProjects(user.id);
  }

  @Roles(Role.Member)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => ProjectType)
  async project(
    @CurrentUser() user: { id: string },
    @Args('projectId') projectId: string,
  ): Promise<ProjectType> {
    return this.projectService.findProject(user.id, projectId);
  }

  /*  @Roles(Role.Member)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [RawLinesType])
  async chapterParagraphs(@Args('input') chapterTextInput: ChapterTextInput) {
    return this.projectService.getChapterParagraphs(chapterTextInput);
  }*/

  @Roles(Role.Member)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [SearchResultType])
  async searchParagraphs(
    @Args('searchInput') searchInput: SearchParagraphsInput,
  ): Promise<SearchResultType[]> {
    return await this.projectService.searchParagraphs(searchInput);
  }
}
