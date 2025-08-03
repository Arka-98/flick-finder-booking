import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { BookingEventTypeEnum } from '../enums/booking-event-type.enum';

export class BookingKafkaEventDto {
  @IsMongoId()
  bookingId: string;

  @IsEnum(BookingEventTypeEnum)
  eventType: BookingEventTypeEnum;

  @IsString()
  @IsOptional()
  message?: string;

  @IsDateString()
  createdAt: Date;
}
