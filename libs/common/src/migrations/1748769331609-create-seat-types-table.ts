import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateSeatTypesTable1748769331609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS flick_finder.seat_types (
        id VARCHAR(24) PRIMARY KEY,
        theater_id VARCHAR(24) NOT NULL,
        type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT seat_types_theater_id_fk FOREIGN KEY (theater_id) REFERENCES flick_finder.theaters(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TABLE IF EXISTS flick_finder.seats_types CASCADE;
    `);
  }
}
