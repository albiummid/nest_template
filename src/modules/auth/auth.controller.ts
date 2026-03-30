import { PublicController } from '@/common/controllers/public.controller';
import { ApiSuccessResponse } from '@/common/decorators/api-response.decorator';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
} from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends PublicController {
  @Inject()
  private readonly authService: AuthService;

  @Post('register')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiSuccessResponse(LoginResponseDto, 201)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiSuccessResponse(LoginResponseDto, 200)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiSuccessResponse(RefreshTokenResponseDto, 200)
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refresh_token);
  }
}
