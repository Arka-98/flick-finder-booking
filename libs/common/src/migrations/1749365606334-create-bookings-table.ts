import { MigrationInterface, QueryRunner } from 'typeorm';
import { BookingStatusEnum } from '../enums/booking-status.enum';

export class CreateBookingsTable1749365606334 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS flick_finder.bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id VARCHAR(30) UNIQUE,
        status flick_finder.booking_status_enum NOT NULL DEFAULT '${BookingStatusEnum.PROCESSING}',
        seat_ids_snapshot VARCHAR(24)[] NOT NULL,
        showtime_id VARCHAR(24) NOT NULL,
        user_id VARCHAR(24) NOT NULL,
        stripe_checkout_session_id TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT bookings_showtime_id_fk FOREIGN KEY (showtime_id) REFERENCES flick_finder.showtimes(id) ON DELETE CASCADE,
        CONSTRAINT bookings_user_id_fk FOREIGN KEY (user_id) REFERENCES flick_finder.users(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TABLE IF EXISTS flick_finder.bookings CASCADE;
    `);
  }
}
