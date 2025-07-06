import { RolesEnum } from '@flick-finder/common';
import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateRolesEnum1748174089696 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TYPE flick_finder.roles_enum AS ENUM (${Object.values(RolesEnum)
          .map((role) => `'${role}'`)
          .join(', ')});
    `);
  }

  // Users
  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP TYPE IF EXISTS flick_finder.roles_enum;  
    `);
  }
}
