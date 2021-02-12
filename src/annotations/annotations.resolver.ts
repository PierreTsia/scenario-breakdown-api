import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AnnotationsService } from './annotations.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AllExceptionsFilter } from '../utils/exceptions.filters';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { AnnotationType } from './dto/annotation.type';
import { CurrentUser } from '../auth/current-user.decorator';
import { AnnotationInput } from './dto/annotation.input';

@Resolver()
export class AnnotationsResolver {
  constructor(private annotationsService: AnnotationsService) {}

  @Roles(Role.Admin)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => AnnotationType)
  async annotate(
    @CurrentUser() user: { id: string },
    @Args('input') input: AnnotationInput,
  ): Promise<AnnotationType> {
    return await this.annotationsService.create(input, user.id);
  }
}
