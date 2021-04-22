import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EntitiesService } from './entities.service';
import { Role } from '../auth/roles.enum';
import { Roles } from '../auth/roles.decorator';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AllExceptionsFilter } from '../utils/exceptions.filters';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { CurrentUser } from '../auth/current-user.decorator';
import { EntityType } from './dto/entity.type';
import { EntityInput } from './dto/entity.input';
import { Entity } from '../schema/entity.schema';

@Resolver()
export class EntitiesResolver {
  constructor(private entitiesService: EntitiesService) {}

  @Roles(Role.Member)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => EntityType)
  async createEntity(
    @CurrentUser() user: { id: string },
    @Args('entityInput') input: EntityInput,
  ): Promise<Entity> {
    return this.entitiesService.create(input, user.id);
  }

  @Roles(Role.Member)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [EntityType])
  async projectEntities(
    @CurrentUser() user: { id: string },
    @Args('projectId') projectId: string,
  ): Promise<Entity[]> {
    return this.entitiesService.getProjectEntities(user, projectId);
  }

  @Roles(Role.Member)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [EntityType])
  async userEntities(@CurrentUser() user: { id: string }): Promise<Entity[]> {
    return this.entitiesService.getUserEntities(user.id);
  }
}
