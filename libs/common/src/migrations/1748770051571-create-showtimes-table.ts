import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShowtimesTable1748770051571 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS flick_finder.showtimes (
        id VARCHAR(24) PRIMARY KEY,
        movie_id VARCHAR(24) NOT NULL,
        hall_id VARCHAR(24) NOT NULL,
        showtime TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT showtimes_movie_id_fk FOREIGN KEY (movie_id) REFERENCES flick_finder.movies(id) ON DELETE CASCADE,
        CONSTRAINT showtimes_hall_id_fk FOREIGN KEY (hall_id) REFERENCES flick_finder.halls(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TABLE IF EXISTS flick_finder.showtimes CASCADE;
    `);
  }
}
