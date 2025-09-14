import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStripeEventLogTable1757853644669
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TABLE stripe_event_log (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            stripe_event_id TEXT UNIQUE NOT NULL,
            stripe_event_type TEXT NOT NULL,
            stripe_object_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT stripe_event_log_event_type_object_id UNIQUE(stripe_event_type, stripe_object_id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP TABLE IF EXISTS stripe_event_log CASCADE;
    `);
  }
}
