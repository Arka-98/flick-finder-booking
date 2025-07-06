import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseTimestampEntity {
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: 'CURRENT_TIMESTAMP',
  })
  readonly createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: 'CURRENT_TIMESTAMP',
  })
  readonly updatedAt: string;
}
