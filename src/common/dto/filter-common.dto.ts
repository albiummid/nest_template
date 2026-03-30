import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Max, Min } from 'class-validator';
import { RowStatus, SortOrder } from '../utils/enums';
import { enumValuesToArray } from '../utils/util/util';
import { IsNumeric } from '../utils/validators/is-number-string.validator';
import { IsValueIn } from '../utils/validators/is-value-in.validator';

export class FilterCommonDto {
  @IsOptional()
  @IsNumeric()
  @Min(1)
  @ApiPropertyOptional({ type: String, default: 1 })
  page: number = 1;

  @IsOptional()
  @IsNumeric()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ type: String, default: 20 })
  limit: number = 20;

  @IsNumeric()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    enum: RowStatus,
    default: RowStatus.ACTIVE,
  })
  row_status: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  sort_by?: string;

  @IsOptional()
  @IsString()
  @IsValueIn(enumValuesToArray(SortOrder))
  @ApiPropertyOptional({
    type: String,
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  sort_order?: SortOrder;
}
