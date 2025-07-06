import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('bookings')
@ApiTags('bookings')
export class BookingController {
  constructor(private readonly bookingRequestService: BookingService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingRequestService.create(createBookingDto);
  }
}
