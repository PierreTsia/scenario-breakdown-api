import { Test, TestingModule } from '@nestjs/testing';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';
import { AuthService } from '../auth/auth.service';

const mockItemsService = () => ({});
const mockAuthService = () => ({});

describe('ItemsResolver', () => {
  let resolver: ItemsResolver;
  let authService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsResolver,
        { provide: ItemsService, useFactory: mockItemsService },
        { provide: AuthService, useFactory: mockAuthService },
      ],
    }).compile();

    resolver = module.get<ItemsResolver>(ItemsResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
