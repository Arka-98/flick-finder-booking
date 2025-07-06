import { Public, TOPICS } from '@flick-finder/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SeatTypeConsumerService } from './seat-type.service';
import { SeatTypeEventDto } from './dto/seat-type-event.dto';

@Public()
@Controller('consumers')
export class SeatTypeConsumerController {
  constructor(private readonly consumerService: SeatTypeConsumerService) {}

  @EventPattern(TOPICS.SEAT_TYPE.CREATED)
  async handleSeatTypeCreated(@Payload() seatType: SeatTypeEventDto) {
    return this.consumerService.createSeatType(seatType);
  }

  @EventPattern(TOPICS.SEAT_TYPE.UPDATED)
  async handleSeatTypeUpdated(
    @Payload() { _id, ...seatUpdateBody }: SeatTypeEventDto,
  ) {
    return this.consumerService.updateSeatType(_id, seatUpdateBody);
  }

  @EventPattern(TOPICS.SEAT_TYPE.DELETED)
  async handleSeatTypeDeleted(@Payload() seatTypeId: string) {
    return this.consumerService.deleteSeatType(seatTypeId);
  }
}
