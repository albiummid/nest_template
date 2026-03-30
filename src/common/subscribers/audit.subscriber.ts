import { Logger } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { AuthContext } from '../context/auth.context';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  private readonly logger = new Logger(AuditSubscriber.name);

  constructor() {
    this.logger.log('AuditSubscriber loaded');
  }

  beforeInsert(event: InsertEvent<unknown>): void {
    const entity = event.entity as Record<string, unknown>;
    if (AuthContext.userId) {
      entity.created_by = AuthContext.userId;
    }
  }

  beforeUpdate(event: UpdateEvent<unknown>): void {
    const entity = event.entity as Record<string, unknown>;
    if (!entity.updated_by || !AuthContext.userId) return;
    entity.updated_by = AuthContext.userId;
  }

  beforeRemove(event: RemoveEvent<unknown>): void {
    const entity = event.entity as Record<string, unknown>;
    if (!entity.deleted_by || !AuthContext.userId) return;
    entity.deleted_by = AuthContext.userId;
    entity.deleted_at = new Date();
  }

  beforeSoftRemove(event: SoftRemoveEvent<unknown>): void {
    const entity = event.entity as Record<string, unknown>;
    if (!entity.deleted_by || !AuthContext.userId) return;
    entity.deleted_by = AuthContext.userId;
    entity.deleted_at = new Date();
  }
}
