import { Test, TestingModule } from '@nestjs/testing';
import { AnnotationsResolver } from './annotations.resolver';

describe('AnnotationsResolver', () => {
  let resolver: AnnotationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnnotationsResolver],
    }).compile();

    resolver = module.get<AnnotationsResolver>(AnnotationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
