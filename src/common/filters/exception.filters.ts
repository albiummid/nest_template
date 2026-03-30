import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ENV } from '../../config/env';

interface ErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
  path: string;
  method: string;
  timestamp: string;
  errors?: string[] | null;
  stack?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errors: string[] | null = null;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const responseObj = res as Record<string, unknown>;
        if (Array.isArray(responseObj.message)) {
          errors = responseObj.message as string[];
          message = 'Validation failed';
        } else {
          message = String(responseObj.message);
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        'UnhandledException',
      );
    }

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      message,
      data: null,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      errors: errors,
      stack:
        ENV.NODE_ENV === 'development' && exception instanceof Error
          ? exception.stack
          : undefined,
    };

    response.status(status).send(errorResponse);
  }
}
