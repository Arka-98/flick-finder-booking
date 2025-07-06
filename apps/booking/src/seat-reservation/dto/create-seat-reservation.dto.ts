import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateSeatReservationDto {
  @IsUUID('4')
  @ApiProperty()
  seat: string;

  @IsUUID('4')
  @ApiProperty()
  booking: string;
}
