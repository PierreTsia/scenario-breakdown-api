import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesResolver } from './entities.resolver';

describe('EntitiesResolver', () => {
  let resolver: EntitiesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntitiesResolver],
    }).compile();

    resolver = module.get<EntitiesResolver>(EntitiesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
