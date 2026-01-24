import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RowStatus } from '../utils/enums';

@Entity('abstract_entity')
export abstract class AbstractEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ enum: RowStatus, default: RowStatus.ACTIVE })
  @Column({ type: 'int', default: RowStatus.ACTIVE })
  row_status: number;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;

  @Column({ select: false })
  created_by: number;

  @Column({ select: false })
  updated_by: number;

  @Column({ select: false })
  deleted_by: number;

  getId(): number {
    return this.id;
  }
}
