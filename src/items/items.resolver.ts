import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { ItemType } from './dto/item.type';
import { ItemInput } from './dto/item.input';
import { ItemArgs } from './dto/item.args';

@Resolver()
export class ItemsResolver {
  constructor(private itemsService: ItemsService) {}

  @Query(() => [ItemType])
  async items(): Promise<ItemType[]> {
    return this.itemsService.findAll();
  }

  @Query(() => ItemType)
  async item(@Args() args: ItemArgs) {
    return await this.itemsService.findOne(args.id);
  }

  @Mutation(() => ItemType)
  async createItem(@Args('input') input: ItemInput): Promise<ItemType> {
    return this.itemsService.create(input);
  }

  @Mutation(() => ItemType)
  async updateItem(
    @Args() item: ItemArgs,
    @Args('input') input: ItemInput,
  ): Promise<ItemInput> {
    return this.itemsService.update(item.id, input);
  }

  @Mutation(() => ItemType)
  async deleteItem(@Args() item: ItemArgs): Promise<ItemInput> {
    return this.itemsService.delete(item.id);
  }
}
