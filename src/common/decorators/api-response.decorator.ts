import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiErrorResponseDto, ApiResponseDto } from '../dto/response.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, model),
    ApiResponse({
      status: 200,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: {
                type: 'object',
                properties: {
                  itemCount: { type: 'number' },
                  totalItems: { type: 'number' },
                  itemsPerPage: { type: 'number' },
                  totalPages: { type: 'number' },
                  currentPage: { type: 'number' },
                },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiSuccessResponse = <TModel extends Type<any>>(
  model?: TModel,
  status: number = 200,
) => {
  const decorators = [ApiExtraModels(ApiResponseDto)];
  if (model) {
    decorators.push(ApiExtraModels(model));
  }

  return applyDecorators(
    ...decorators,
    ApiResponse({
      status: status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: model
                ? { $ref: getSchemaPath(model) }
                : { type: 'object', nullable: true },
            },
          },
        ],
      },
    }),
  );
};

export const ApiErrorResponse = (status: number, message?: string) => {
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto),
    ApiResponse({
      status: status,
      description: message || `Error response for status ${status}`,
      schema: {
        $ref: getSchemaPath(ApiErrorResponseDto),
      },
    }),
  );
};

export const ApiStandardErrors = () => {
  return applyDecorators(
    ApiErrorResponse(400, 'Bad Request - Validation failed or invalid input'),
    ApiErrorResponse(401, 'Unauthorized - Authentication required'),
    ApiErrorResponse(403, 'Forbidden - Insufficient permissions'),
    ApiErrorResponse(404, 'Not Found - Resource not found'),
    ApiErrorResponse(500, 'Internal Server Error'),
  );
};
