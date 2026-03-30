import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { requestContext } from '../context/request.context';

interface RequestWithUser extends FastifyRequest {
  user?: { id: number };
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: RequestWithUser, _res: FastifyReply, next: () => void) {
    const tenantIdHeader = (req.headers['x-tenant-id'] as string) || undefined;
    const tenantId = tenantIdHeader ? Number(tenantIdHeader) : undefined;

    requestContext.run(
      {
        userId: req.user?.id,
        tenantId,
        requestId: crypto.randomUUID(),
      },
      () => next(),
    );
  }
}
