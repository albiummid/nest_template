import { baseMigrationFields } from '@/common/constants/base-migration-fields.constant';
import { TABLE_USERS } from '@/common/constants/table-name.constant';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1767521158649 implements MigrationInterface {
  name = 'CreateUserTable1767521158649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // CREATE
    await queryRunner.createTable(
      new Table({
        name: TABLE_USERS,
        columns: [
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'role',
            type: 'int',
          },
          {
            name: 'photo_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
          },
          ...baseMigrationFields,
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_USERS, true, true, true);
  }
}
