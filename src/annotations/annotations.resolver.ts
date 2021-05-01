import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AnnotationsService } from './annotations.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AllExceptionsFilter } from '../utils/exceptions.filters';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { AnnotationType } from './dto/annotation.type';
import { CurrentUser } from '../auth/current-user.decorator';
import { AnnotationInput, FetchAnnotationInput } from './dto/annotation.input';
import { DeleteAnnotationInput } from './dto/delete-annotation.input';

@Resolver()
export class AnnotationsResolver {
  constructor(private annotationsService: AnnotationsService) {}

  @Roles(Role.Member)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => AnnotationType)
  async annotate(
    @CurrentUser() user: { id: string },
    @Args('input') input: AnnotationInput,
  ): Promise<AnnotationType> {
    return await this.annotationsService.create(input, user.id);
  }

  @Roles(Role.Member)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [AnnotationType])
  async projectAnnotations(
    @Args('input') input: FetchAnnotationInput,
  ): Promise<AnnotationType[]> {
    return await this.annotationsService.searchProjectAnnotations(input);
  }

  @Roles(Role.Admin)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  async deleteAnnotations(
    @Args('deleteInput') deleteInput: DeleteAnnotationInput,
  ): //
  Promise<boolean> {
    return await this.annotationsService.delete(deleteInput.annotationIds);
  }
}
