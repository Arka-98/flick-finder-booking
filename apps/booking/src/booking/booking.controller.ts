import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomRequest, Public } from '@flick-finder/common';
import { Request, Response } from 'express';

@ApiBearerAuth()
@Controller('bookings')
@ApiTags('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @HttpCode(HttpStatus.SEE_OTHER)
  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() request: CustomRequest,
    @Res() res: Response,
  ) {
    const { redirectUrl } = await this.bookingService.create(
      createBookingDto,
      request.user.sub,
    );

    res.redirect(HttpStatus.SEE_OTHER, redirectUrl);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('stripe-webhook')
  handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers() headers: Record<string, string>,
  ) {
    return this.bookingService.handleStripeWebhook(
      req.rawBody,
      headers['stripe-signature'],
    );
  }
}
