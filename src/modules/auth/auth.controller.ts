import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicController } from 'src/common/controllers/public.controller';
import { ApiSuccessResponse } from 'src/common/decorators/api-response.decorator';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends PublicController {
  @Inject()
  private readonly authService: AuthService;

  @Post('register')
  @ApiSuccessResponse(LoginResponseDto, 201)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiSuccessResponse(LoginResponseDto, 201)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
