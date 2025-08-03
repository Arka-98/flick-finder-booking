import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateBookingDto {
  @IsMongoId()
  @ApiProperty()
  userId: string;

  @IsMongoId()
  @ApiProperty()
  showtimeId: string;

  @IsMongoId({ each: true })
  @ApiProperty({ type: [String] })
  seatIds: string[];
}
