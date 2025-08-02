import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMoviesTable1748768362384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TABLE IF NOT EXISTS flick_finder.movies (
          id VARCHAR(24) PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          duration INT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP TABLE IF EXISTS flick_finder.movies CASCADE;
    `);
  }
}
