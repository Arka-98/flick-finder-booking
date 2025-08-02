import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSeatPricingsTable1748770300297
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS flick_finder.seat_pricings (
        id VARCHAR(24) PRIMARY KEY,
        showtime_id VARCHAR(24) NOT NULL,
        seat_type_id VARCHAR(50) NOT NULL,
        price REAL NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT seat_pricings_showtime_id_fk FOREIGN KEY (showtime_id) REFERENCES flick_finder.showtimes(id) ON DELETE CASCADE,
        CONSTRAINT seat_pricings_seat_type_id_fk FOREIGN KEY (seat_type_id) REFERENCES flick_finder.seat_types(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TABLE IF EXISTS flick_finder.seat_pricings CASCADE;
    `);
  }
}
