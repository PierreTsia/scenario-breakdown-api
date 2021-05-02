import { Args, Query, Resolver } from '@nestjs/graphql';
import { AttributesService } from './attributes.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AllExceptionsFilter } from '../utils/exceptions.filters';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { AttributeType } from './dto/attribute.type';

@Resolver()
export class AttributesResolver {
  constructor(private attributeService: AttributesService) {}

  @Roles(Role.Member)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [AttributeType])
  async projectAttributes(
    @Args('projectId') projectId: string,
  ): Promise<AttributeType[]> {
    return await this.attributeService.findProjectAttributes(projectId);
  }
}
