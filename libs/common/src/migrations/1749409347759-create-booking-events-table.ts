import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateBookingEventsTable1749409347759
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TABLE IF NOT EXISTS flick_finder.booking_events (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            booking_id UUID NOT NULL,
            event_type flick_finder.booking_event_type_enum NOT NULL,
            message TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT booking_events_seat_id_fk FOREIGN KEY (seat_id) REFERENCES flick_finder.seats(id) ON DELETE CASCADE,
            CONSTRAINT booking_events_booking_id_fk FOREIGN KEY (booking_id) REFERENCES flick_finder.bookings(id) ON DELETE CASCADE
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP TABLE IF EXISTS flick_finder.booking_events CASCADE;
    `);
  }
}
