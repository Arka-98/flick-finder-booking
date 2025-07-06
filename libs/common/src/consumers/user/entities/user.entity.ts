import { BaseTimestampEntity } from '@app/common/entities/base-timestamp.entity';
import { IUserEvent, RolesEnum } from '@flick-finder/common';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User
  extends BaseTimestampEntity
  implements Omit<IUserEvent, '_id'>
{
  @PrimaryColumn({ type: 'varchar', length: 24 })
  readonly id: string;

  @Column({ type: 'varchar', length: 200 })
  readonly name: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  readonly email: string;

  @Column({ type: 'varchar', length: 10 })
  readonly phone: string;

  @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.CUSTOMER })
  readonly role: RolesEnum;
}
