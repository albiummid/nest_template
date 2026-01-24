import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserBasicInfoDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  photo_url: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  phone_number: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  address: string;
}
