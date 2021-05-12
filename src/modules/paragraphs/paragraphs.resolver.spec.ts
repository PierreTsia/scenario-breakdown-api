import { Test, TestingModule } from '@nestjs/testing';
import { ParagraphsResolver } from './paragraphs.resolver';

describe('ParagraphsResolver', () => {
  let resolver: ParagraphsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParagraphsResolver],
    }).compile();

    resolver = module.get<ParagraphsResolver>(ParagraphsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
