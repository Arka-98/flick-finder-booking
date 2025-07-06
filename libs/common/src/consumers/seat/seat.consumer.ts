import { Public, TOPICS } from '@flick-finder/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SeatEventDto } from './dto/seat-event.dto';
import { SeatConsumerService } from './seat.service';

@Public()
@Controller('consumers')
export class SeatConsumerController {
  constructor(private readonly consumerService: SeatConsumerService) {}

  @EventPattern(TOPICS.SEAT.CREATED)
  async handleSeatCreated(@Payload() seat: SeatEventDto) {
    return this.consumerService.createSeat(seat);
  }

  @EventPattern(TOPICS.SEAT.UPDATED)
  async handleSeatUpdated(@Payload() { _id, ...seatUpdateBody }: SeatEventDto) {
    return this.consumerService.updateSeat(_id, seatUpdateBody);
  }

  @EventPattern(TOPICS.SEAT.DELETED)
  async handleSeatDeleted(@Payload() seatId: string) {
    return this.consumerService.deleteSeat(seatId);
  }
}
