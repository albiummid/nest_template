import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ type: String, example: 'John Doe', description: 'User name' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    type: String,
    example: 'user@example.com',
    description: 'User email',
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    type: String,
    example: 'SecurePass123!',
    description:
      'User password (min 8 chars, must contain uppercase, lowercase, number, and special character)',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    },
  )
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
