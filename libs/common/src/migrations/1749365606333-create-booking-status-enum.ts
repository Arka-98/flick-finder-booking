import { type MigrationInterface, type QueryRunner } from 'typeorm';
import { BookingStatusEnum } from '../enums/booking-status.enum';

export class CreateBookingStatusEnum1750582323591
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TYPE flick_finder.booking_status_enum AS ENUM (${Object.values(
          BookingStatusEnum,
        )
          .map((type) => `'${type}'`)
          .join(', ')});
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP TYPE IF EXISTS flick_finder.booking_status_enum;  
    `);
  }
}
