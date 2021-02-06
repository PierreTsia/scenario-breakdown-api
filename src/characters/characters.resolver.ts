import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CharactersService } from './characters.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AllExceptionsFilter } from '../utils/exceptions.filters';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { CharacterType } from './dto/character.type';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateCharacterInput } from './dto/create-character.input';
import { UpdateCharacterInput } from './dto/update-character.input';
import { CommentCharacterInput } from './dto/comment-character.input';

@Resolver()
export class CharactersResolver {
  constructor(private charactersService: CharactersService) {}

  @Roles(Role.Member)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [CharacterType])
  async characters() {
    return this.charactersService.getAll();
  }

  @Roles(Role.Admin)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => CharacterType)
  async createCharacter(
    @CurrentUser() user: { id: string },
    @Args('input') input: CreateCharacterInput,
  ) {
    return this.charactersService.create(input, user.id);
  }

  @Roles(Role.Admin)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => CharacterType)
  async updateCharacter(
    @CurrentUser() user: { id: string },
    @Args('input') input: UpdateCharacterInput,
  ) {
    return this.charactersService.update(input, user.id);
  }

  @Roles(Role.Member)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => CharacterType)
  async commentCharacter(
    @CurrentUser() user: { id: string },
    @Args('input') input: CommentCharacterInput,
  ) {
    return this.charactersService.comment(input, user.id);
  }

  @Roles(Role.Member)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => CharacterType)
  async characterById(@Args('id') id: string) {
    return this.charactersService.find(id);
  }
}
