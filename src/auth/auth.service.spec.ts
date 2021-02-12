import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { USER_FACTORY } from '../factories/User.factory';
import { UsersService } from '../users/users.service';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../schema/user.schema';
import { Role } from './roles.enum';
jest.mock('bcrypt');

const mockUser = USER_FACTORY.getSingleRecord();

const mockUserService = () => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
});
const mockJwtService = () => ({
  sign: jest.fn(),
});
describe('AuthService', () => {
  let service: AuthService;
  let jwtService: any;
  let usersService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'UsersService', useFactory: mockUserService },
        { provide: 'JwtService', useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('login()', () => {
    it('should return a payload', async () => {
      jwtService.sign.mockImplementation(() => 'token');
      expect(jwtService.sign).not.toHaveBeenCalled();
      const test = await service.login(mockUser as User);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        roles: [Role.Member],
      });
      expect(test).toEqual({ access_token: 'token', user: mockUser });
    });
  });

  describe('validateUser()', () => {
    const mockUser = { username: 'test', email: 'test@mail.com' };
    let bcryptCompare: jest.Mock;

    const validateUserTestCases: [string, string, boolean, any][] = [
      ['user', 'user is found and password is ok', true, [true, mockUser]],
      ['null', 'user is not found', false, [true, undefined]],
      ['null', 'password is wrong', false, [false, mockUser]],
    ];

    test.each(validateUserTestCases)(
      'should return %s if %s',
      async (returnValue, condition, isValid, [bcryptValue, findOneValue]) => {
        bcryptCompare = jest.fn().mockReturnValue(bcryptValue);
        (bcrypt.compare as jest.Mock) = bcryptCompare;
        usersService.findOne.mockResolvedValue(findOneValue);
        expect(usersService.findOne).not.toHaveBeenCalled();
        const test = await service.validateUser('test@mail.com', 'password');
        expect(usersService.findOne).toHaveBeenCalledWith('test@mail.com');
        expect(test).toEqual(isValid ? mockUser : null);
      },
    );
  });
  describe('signUp()', () => {
    it('should throw server exception if createUser fails', async () => {
      usersService.createUser.mockResolvedValue(undefined);
      expect(usersService.createUser).not.toHaveBeenCalled();
      expect(usersService.createUser).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
      await expect(
        service.signUp({
          email: mockUser.email,
          password: '123',
          username: mockUser.username,
        }),
      ).rejects.toThrow(InternalServerErrorException);

      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should return access token and user if createUser succeeds', async () => {
      usersService.createUser.mockResolvedValue({
        ...mockUser,
        save: jest.fn().mockReturnValue(mockUser),
      } as any);
      jwtService.sign.mockImplementation(() => 'token');
      expect(jwtService.sign).not.toHaveBeenCalled();
      expect(usersService.createUser).not.toHaveBeenCalled();
      const test = await service.signUp({
        email: mockUser.email,
        password: '123',
        username: mockUser.username,
      });

      expect(usersService.createUser).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
      expect(test).toEqual({ access_token: 'token', user: mockUser });
    });
  });
});
