import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateFlickFinderSchema1748106194613
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE SCHEMA IF NOT EXISTS flick_finder;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP SCHEMA IF EXISTS flick_finder CASCADE;
    `);
  }
}
