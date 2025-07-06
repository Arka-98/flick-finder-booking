import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateSeatsTable1748769832041 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS flick_finder.seats (
        id VARCHAR(24) PRIMARY KEY,
        hall_id VARCHAR(24) NOT NULL,
        row_label VARCHAR(10) NOT NULL,
        seat_type_id VARCHAR(24) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT seats_hall_id_fk FOREIGN KEY (hall_id) REFERENCES flick_finder.halls(id) ON DELETE CASCADE,
        CONSTRAINT seats_seat_type_id_fk FOREIGN KEY (seat_type_id) REFERENCES flick_finder.seat_types(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TABLE IF EXISTS flick_finder.seats CASCADE;
    `);
  }
}
