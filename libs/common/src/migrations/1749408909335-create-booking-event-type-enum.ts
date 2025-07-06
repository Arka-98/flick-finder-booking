import { type MigrationInterface, type QueryRunner } from 'typeorm';
import { BookingEventTypeEnum } from '../enums/booking-event-type.enum';

export class CreateBookingEventTypeEnum1749408909335
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TYPE flick_finder.booking_event_type_enum AS ENUM (${Object.values(
          BookingEventTypeEnum,
        )
          .map((type) => `'${type}'`)
          .join(', ')});
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP TYPE IF EXISTS flick_finder.booking_event_type_enum;  
    `);
  }
}
