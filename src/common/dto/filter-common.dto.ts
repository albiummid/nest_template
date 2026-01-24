import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { RowStatus, SortOrder } from '../utils/enums';
import { enumValuesToArray } from '../utils/util/util';
import { IsNumeric } from '../utils/validators/is-number-string.validator';
import { IsValueIn } from '../utils/validators/is-value-in.validator';

export class FilterCommonDto {
  @IsOptional()
  @IsNumeric()
  @ApiPropertyOptional({ type: String })
  page: number;

  @IsOptional()
  @IsNumeric()
  @ApiPropertyOptional({ type: String })
  limit: number;

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
