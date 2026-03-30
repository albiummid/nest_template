import { Controller } from '@nestjs/common';
import { ApiStandardErrors } from '../decorators/api-response.decorator';

@ApiStandardErrors()
@Controller()
export class BaseController {
  successResponse<T>(result: T, message?: string): SuccessResponse<T> {
    return {
      message,
      result,
    };
  }
}

export type SuccessResponse<T> = {
  message?: string;
  result: T;
};
