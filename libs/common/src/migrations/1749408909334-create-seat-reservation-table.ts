import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateSeatReservationTable1749408909334
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TABLE IF NOT EXISTS flick_finder.seat_reservations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          seat_id UUID NOT NULL,
          booking_id UUID NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          CONSTRAINT seat_reservations_seat_id_fk FOREIGN KEY (seat_id) REFERENCES flick_finder.seats(id) ON DELETE CASCADE,
          CONSTRAINT seat_reservations_booking_id_fk FOREIGN KEY (booking_id) REFERENCES flick_finder.bookings(id) ON DELETE CASCADE
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP TABLE IF EXISTS flick_finder.seat_reservations CASCADE;
    `);
  }
}
