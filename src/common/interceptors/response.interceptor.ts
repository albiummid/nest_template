import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: any;
  path: string;
  method: string;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;

        const responseData =
          data && typeof data === 'object' && 'result' in data
            ? data.result
            : data;
        const message =
          data && typeof data === 'object' && 'message' in data
            ? data.message
            : 'Success';

        const isPaginated = !!(
          responseData &&
          typeof responseData === 'object' &&
          'items' in responseData &&
          'meta' in responseData
        );

        return {
          success: true,
          statusCode,
          message: message as string,
          data: (isPaginated ? responseData.items : responseData) as T,
          meta: isPaginated ? responseData.meta : undefined,
          path: request.url,
          method: request.method,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
