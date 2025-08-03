import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatPricing } from './entities/seat-pricing.entity';
import { SeatPricingEventDto } from './dto/seat-pricing-event.dto';

@Injectable()
export class SeatPricingConsumerService {
  constructor(
    @InjectRepository(SeatPricing)
    private readonly seatPricingRepository: Repository<SeatPricing>,
  ) {}

  createSeatPricing(seatPricing: SeatPricingEventDto) {
    return this.seatPricingRepository.insert({
      ...seatPricing,
      seatType: { id: seatPricing.seatType },
      showtime: { id: seatPricing.showtime },
    });
  }

  updateSeatPricing(
    seatPricingId: string,
    seatPricingUpdateBody: Omit<SeatPricingEventDto, '_id'>,
  ) {
    return this.seatPricingRepository.update(
      { id: seatPricingId },
      {
        ...seatPricingUpdateBody,
        seatType: { id: seatPricingUpdateBody.seatType },
        showtime: { id: seatPricingUpdateBody.showtime },
      },
    );
  }

  deleteSeatPricing(seatPricingId: string) {
    return this.seatPricingRepository.delete({ id: seatPricingId });
  }
}
