import {
  EventSubscriber,
  InsertEvent,
  EntitySubscriberInterface,
  UpdateEvent,
  SoftRemoveEvent,
  RemoveEvent,
} from 'typeorm';
import { AuthContext } from '../context/auth.context';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  constructor() {
    console.log('AuditSubscriber loaded');
  }
  beforeInsert(event: InsertEvent<any>) {
    event.entity.created_by = AuthContext.userId;
  }

  beforeUpdate(event: UpdateEvent<any>) {
    if (!event?.entity?.updated_by) return;
    event.entity.updated_by = AuthContext.userId;
  }

  beforeRemove(event: RemoveEvent<any>) {
    if (!event?.entity?.deleted_by) return;
    event.entity.deleted_by = AuthContext.userId;
    event.entity.deleted_at = new Date();
  }

  beforeSoftRemove(event: SoftRemoveEvent<any>) {
    if (!event?.entity?.deleted_by) return;
    event.entity.deleted_by = AuthContext.userId;
    event.entity.deleted_at = new Date();
  }
}
