import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@flick-finder/common';

@ApiBearerAuth()
@Controller('bookings')
@ApiTags('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }
}
