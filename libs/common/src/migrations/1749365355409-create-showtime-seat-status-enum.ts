import { MigrationInterface, QueryRunner } from 'typeorm';
import { ShowtimeSeatStatusEnum } from '../enums/showtime-seat-status.enum';

export class CreateShowtimeSeatStatusEnum1749365355409
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TYPE flick_finder.showtime_seat_status_enum AS ENUM (${Object.values(
        ShowtimeSeatStatusEnum,
      )
        .map((status) => `'${status}'`)
        .join(', ')});
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TYPE IF EXISTS flick_finder.showtime_seat_status_enum;  
    `);
  }
}
