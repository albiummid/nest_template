import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
  userId?: number;
  tenantId?: number;
  requestId?: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();
