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
import { RawLinesType } from './dto/raw-lines.type';
import { ChapterTextInput } from './dto/chapter-text.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AllExceptionsFilter } from '../utils/exceptions.filters';
import { RawTextType } from './dto/raw-text.type';
import { SearchWordsResultsType } from './dto/search-words-results.type';
import { SearchWordsInput } from './dto/search-words.input';
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

  @Roles(Role.Member)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [ProjectType])
  async findProjects(@CurrentUser() user: { id: string }): Promise<Project[]> {
    return this.projectService.findUserProjects(user.id);
  }

  @Roles(Role.Member)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [RawLinesType])
  async chapterLines(@Args('input') chapterTextInput: ChapterTextInput) {
    return this.projectService.getLinesText(chapterTextInput);
  }

  @Roles(Role.Member)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => RawTextType)
  async fullText(@Args('chapterId') chapterId: string) {
    return this.projectService.getFullText(chapterId);
  }

  @Roles(Role.Member)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => SearchWordsResultsType)
  async searchWords(
    @Args('searchInput') searchInput: SearchWordsInput,
  ): Promise<SearchWordsResultsType> {
    return this.projectService.searchWords(searchInput);
  }

  @Roles(Role.Member)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [SearchResultType])
  async searchParagraphs(
    @Args('searchInput') searchInput: SearchWordsInput,
  ): Promise<SearchResultType[]> {
    const res = await this.projectService.searchParagraphs(searchInput);
    console.log(res);
    return res;
  }
}
