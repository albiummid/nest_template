import { Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import { requestContext } from '../context/request.context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    requestContext.run(
      {
        userId: req.user?.id,
        tenantId: req.headers['x-tenant-id'],
        requestId: crypto.randomUUID(),
      },
      () => next(),
    );
  }
}
