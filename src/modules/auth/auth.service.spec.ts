import { Role } from '@/common/utils/enums';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
    role: Role.EMPLOYEE,
  };

  const mockUsersService = {
    findUserById: jest.fn(),
    findUserByEmailWithPassword: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      mockUsersService.findUserByEmailWithPassword.mockResolvedValue(mockUser);
      jest
        .spyOn(authService as any, 'matchHashedPassword')
        .mockResolvedValue(true);

      const result = await authService.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).not.toHaveProperty('password');
      expect(usersService.findUserByEmailWithPassword).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findUserByEmailWithPassword.mockResolvedValue(null);

      await expect(
        authService.validateUser('wrong@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUsersService.findUserByEmailWithPassword.mockResolvedValue(mockUser);
      jest
        .spyOn(authService as any, 'matchHashedPassword')
        .mockResolvedValue(false);

      await expect(
        authService.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens with user data', async () => {
      mockUsersService.findUserByEmailWithPassword.mockResolvedValue(mockUser);
      jest
        .spyOn(authService as any, 'matchHashedPassword')
        .mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValueOnce('accessToken');
      mockJwtService.signAsync.mockResolvedValueOnce('refreshToken');

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('user');
      expect(result.user.id).toBe(mockUser.id);
    });
  });

  describe('register', () => {
    it('should throw BadRequestException if user already exists', async () => {
      mockUsersService.findUserByEmailWithPassword.mockResolvedValue(mockUser);

      await expect(
        authService.register({
          name: 'New User',
          email: 'test@example.com',
          password: 'StrongPass123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create new user and return tokens', async () => {
      mockUsersService.findUserByEmailWithPassword.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValueOnce('accessToken');
      mockJwtService.signAsync.mockResolvedValueOnce('refreshToken');

      const result = await authService.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'StrongPass123!',
      });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(usersService.create).toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    it('should return new token pair if refresh token is valid', async () => {
      const mockPayload = { sub: 1, email: 'test@example.com' };
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUsersService.findUserById.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValueOnce('newAccessToken');
      mockJwtService.signAsync.mockResolvedValueOnce('newRefreshToken');

      const result = await authService.refreshTokens('validRefreshToken');

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(jwtService.verify).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshTokens('invalidToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
