import { Public, TOPICS } from '@flick-finder/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SeatPricingConsumerService } from './seat-pricing.service';
import { SeatPricingEventDto } from './dto/seat-pricing-event.dto';

@Public()
@Controller('consumers')
export class SeatPricingConsumerController {
  constructor(private readonly consumerService: SeatPricingConsumerService) {}

  @EventPattern(TOPICS.SEAT_PRICING.CREATED)
  async handleSeatPricingCreated(@Payload() seatPricing: SeatPricingEventDto) {
    return this.consumerService.createSeatPricing(seatPricing);
  }

  @EventPattern(TOPICS.SEAT_PRICING.UPDATED)
  async handleSeatPricingUpdated(
    @Payload() { _id, ...seatUpdateBody }: SeatPricingEventDto,
  ) {
    return this.consumerService.updateSeatPricing(_id, seatUpdateBody);
  }

  @EventPattern(TOPICS.SEAT_PRICING.DELETED)
  async handleSeatPricingDeleted(@Payload() seatPricingId: string) {
    return this.consumerService.deleteSeatPricing(seatPricingId);
  }
}
