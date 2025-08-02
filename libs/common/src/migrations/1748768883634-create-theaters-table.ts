import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTheatersTable1748768883634 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS flick_finder.theaters (
        id VARCHAR(24) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        address VARCHAR(400) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TABLE IF EXISTS flick_finder.theaters CASCADE;
    `);
  }
}
