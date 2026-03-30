import { SanitizedEntity } from '@/common/types/utils.types';
import { Role } from '@/common/utils/enums';
import { ENV } from '@/config/env';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface RefreshTokenPayload {
  sub: number;
  email: string;
  refreshTokenVersion: number;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  @Inject()
  private readonly usersService: UsersService;

  @Inject()
  private readonly jwtService: JwtService;

  async getUserById(id: number) {
    return this.usersService.findUserById(id);
  }

  /**
   * Validates user credentials
   * @returns user object without password
   * @throws UnauthorizedException
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<SanitizedEntity<UserEntity, 'password'>> {
    const user = await this.usersService.findUserByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.matchHashedPassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  /**
   * Login method - returns JWT access token and refresh token
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const isUserExist = await this.usersService.findUserByEmailWithPassword(
      registerDto.email,
    );
    if (isUserExist) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await this.hashPassword(registerDto.password);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role: Role.EMPLOYEE,
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(
    userId: number,
    email: string,
  ): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, email }),
      this.jwtService.signAsync(
        { sub: userId, email, refreshTokenVersion: Date.now() },
        {
          secret: ENV.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(
        refreshToken,
        {
          secret: ENV.JWT_REFRESH_SECRET,
        },
      );

      const user = await this.usersService.findUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return await this.generateTokens(user.id, user.email);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Optional: Helper method to hash password (useful during registration)
   */
  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async matchHashedPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
