import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errors = null;

    if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      message = typeof res === 'object' ? res.message : res;
      if (Array.isArray(res.message)) {
        errors = res.message;
        message = 'Validation failed';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        'UnhandledException',
      );
    }

    const errorResponse: any = {
      success: false,
      statusCode: status,
      message,
      data: null,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      errors: errors,
      stack: exception instanceof Error ? exception.stack : exception,
    };

    response.status(status).send(errorResponse);
  }
}
