import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHallsTable1748769081947 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS flick_finder.halls (
        id VARCHAR(24) PRIMARY KEY,
        theater_id VARCHAR(24) NOT NULL,
        total_seats INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT halls_theater_id_fk FOREIGN KEY (theater_id) REFERENCES flick_finder.theaters(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TABLE IF EXISTS flick_finder.halls CASCADE;
    `);
  }
}
