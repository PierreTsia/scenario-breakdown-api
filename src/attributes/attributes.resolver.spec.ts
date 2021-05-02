import { Test, TestingModule } from '@nestjs/testing';
import { AttributesResolver } from './attributes.resolver';

describe('AttributesResolver', () => {
  let resolver: AttributesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttributesResolver],
    }).compile();

    resolver = module.get<AttributesResolver>(AttributesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
