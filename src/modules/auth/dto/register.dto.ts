import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ type: String, example: 'John Doe', description: 'User name' })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'user@example.com',
    description: 'User email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: 'very_strong_password',
    description: 'User password',
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    type: String,
    example: '12345678',
    description: 'User phone number',
  })
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional({
    type: String,
    example: '12345678',
    description: 'User address',
  })
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    type: String,
    example: '12345678',
    description: 'User photo url',
  })
  @IsString()
  photo_url?: string;
}
