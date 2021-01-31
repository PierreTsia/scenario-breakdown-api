import { Test, TestingModule } from '@nestjs/testing';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';

const mockItemsService = () => ({});

describe('ItemsResolver', () => {
  let resolver: ItemsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsResolver,
        { provide: ItemsService, useFactory: mockItemsService },
      ],
    }).compile();

    resolver = module.get<ItemsResolver>(ItemsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
