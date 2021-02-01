import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
const mockUserService = () => ({});
const mockAuthService = () => ({});

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: 'AuthService', useFactory: mockAuthService },
        { provide: 'UsersService', useFactory: mockUserService },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
