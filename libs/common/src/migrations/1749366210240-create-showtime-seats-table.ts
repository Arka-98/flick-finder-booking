import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateShowtimeSeatsTable1749365606334
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS flick_finder.showtime_seats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        showtime_id VARCHAR(24) NOT NULL,
        seat_id VARCHAR(24) NOT NULL,
        status flick_finder.showtime_seat_status_enum NOT NULL DEFAULT 'available',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT showtime_seats_showtime_id_fk FOREIGN KEY (showtime_id) REFERENCES flick_finder.showtimes(id) ON DELETE CASCADE,
        CONSTRAINT showtime_seats_seat_id_fk FOREIGN KEY (seat_id) REFERENCES flick_finder.seats(id) ON DELETE CASCADE,
        CONSTRAINT showtime_seats_booking_id_fk FOREIGN KEY (booking_id) REFERENCES flick_finder.bookings(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TABLE IF EXISTS flick_finder.showtime_seats CASCADE;
    `);
  }
}
