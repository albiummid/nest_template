import { requestContext } from './request.context';

export class AuthContext {
  static get userId(): number | undefined {
    return requestContext.getStore()?.userId;
  }

  static get tenantId(): number | undefined {
    return requestContext.getStore()?.tenantId;
  }

  static get requestId(): string | undefined {
    return requestContext.getStore()?.requestId;
  }
}
