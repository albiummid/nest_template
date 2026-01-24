import { TableColumnOptions } from 'typeorm';

export const baseMigrationFields: TableColumnOptions[] = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
  },
  {
    name: 'row_status',
    type: 'tinyint',
    default: 1,
  },
  {
    name: 'created_at',
    type: 'datetime',
    default: 'CURRENT_TIMESTAMP',
  },
  {
    name: 'updated_at',
    type: 'datetime',
    default: 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  },
  {
    name: 'deleted_at',
    type: 'datetime',
    default: null,
  },
  {
    name: 'created_by',
    type: 'int',
    default: 0,
  },
  {
    name: 'updated_by',
    type: 'int',
    default: 0,
  },
  {
    name: 'deleted_by',
    type: 'int',
    default: 0,
  },
];
