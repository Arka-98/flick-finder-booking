import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateBookingRequestsTable1750580689407
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TABLE IF NOT EXISTS flick_finder.booking_requests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            job_id VARCHAR(30) UNIQUE NOT NULL,
            user_id VARCHAR(24) NOT NULL,
            showtime_id VARCHAR(24) NOT NULL,
            seat_ids VARCHAR(24)[] NOT NULL,
            booking_id UUID,
            status 
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT booking_requests_user_id_fk FOREIGN KEY (user_id) REFERENCES flick_finder.users(id) ON DELETE CASCADE,
            CONSTRAINT booking_requests_showtime_id_fk FOREIGN KEY (showtime_id) REFERENCES flick_finder.showtimes(id) ON DELETE CASCADE
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP TABLE IF EXISTS flick_finder.booking_requests CASCADE;
    `);
  }
}
