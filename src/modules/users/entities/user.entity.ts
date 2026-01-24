import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Role } from '../../../common/utils/enums';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @ApiProperty()
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty()
  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ select: false, type: 'varchar' })
  password: string;

  @ApiProperty({ enum: Role, default: Role.EMPLOYEE })
  @Column({ type: 'int', default: Role.EMPLOYEE })
  role: number;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', nullable: true })
  photo_url: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', nullable: true })
  phone_number: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', nullable: true })
  address: string;
}
