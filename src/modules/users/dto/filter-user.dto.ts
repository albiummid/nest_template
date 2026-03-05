import { FilterCommonDto } from '@/common/dto/filter-common.dto';
import { Role } from '@/common/utils/enums';
import { enumToString, enumValuesToArray } from '@/common/utils/util/util';
import { IsValueIn } from '@/common/utils/validators/is-value-in.validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterUserDto extends FilterCommonDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  address?: string;

  @IsOptional()
  @IsString()
  @IsValueIn(enumValuesToArray(Role))
  @ApiPropertyOptional({ type: String, description: enumToString(Role) })
  role?: 'ADMIN' | 'MANAGER' | 'HR' | 'EMPLOYEE';
}
