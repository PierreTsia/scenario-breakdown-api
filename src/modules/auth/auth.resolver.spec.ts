import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { USER_FACTORY } from '../../factories/User.factory';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

const mockUserService = () => ({
  findById: jest.fn(),
});
const mockAuthService = () => ({
  validateUser: jest.fn(),
  login: jest.fn(),
  signUp: jest.fn(),
});
const mockUser = USER_FACTORY.getSingleRecord();
const mockToken = { access_token: 'token' };
const mockAuthPayload = {
  user: mockUser,
  ...mockToken,
};

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: any;
  let userService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: 'AuthService', useFactory: mockAuthService },
        { provide: 'UsersService', useFactory: mockUserService },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('login()', () => {
    it('should return authPayload if user validation succeeds', async () => {
      authService.validateUser.mockResolvedValue(mockUser as any);

      authService.login.mockResolvedValue(mockAuthPayload as any);

      expect(authService.validateUser).not.toHaveBeenCalled();
      expect(authService.login).not.toHaveBeenCalled();

      const res = await resolver.login({
        email: mockUser.email,
        password: '123',
      });
      expect(authService.validateUser).toHaveBeenCalledWith(
        mockUser.email,
        '123',
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(res).toEqual(mockAuthPayload);
    });

    it('should throw unauthorized exception if user validation fails ', async () => {
      authService.validateUser.mockResolvedValue(false as any);
      expect(authService.validateUser).not.toHaveBeenCalled();

      await expect(
        resolver.login({
          email: mockUser.email,
          password: '123',
        }),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        mockUser.email,
        '123',
      );
      expect(authService.login).not.toHaveBeenCalledWith(mockUser);
    });
  });
  describe('me()', () => {
    it('should return userService.findById() ', async () => {
      userService.findById.mockResolvedValue(mockUser as any);
      expect(userService.findById).not.toHaveBeenCalled();
      const res = await resolver.me(mockUser);
      expect(userService.findById).toHaveBeenCalledWith(mockUser.id);
      expect(res).toEqual(mockUser);
    });
  });

  describe('signUp()', () => {
    it('should return authService.signUp()', async () => {
      authService.signUp.mockResolvedValue(mockAuthPayload as any);
      expect(authService.signUp).not.toHaveBeenCalled();
      const res = await resolver.signup({ ...mockUser, password: 'test' });
      expect(authService.signUp).toHaveBeenCalledWith({
        ...mockUser,
        password: 'test',
      });
      expect(res).toEqual(mockAuthPayload);
    });
  });
});
