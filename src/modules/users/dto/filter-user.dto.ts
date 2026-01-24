import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FilterCommonDto } from 'src/common/dto/filter-common.dto';
import { Role } from 'src/common/utils/enums';
import { enumToString, enumValuesToArray } from 'src/common/utils/util/util';
import { IsValueIn } from 'src/common/utils/validators/is-value-in.validator';

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
