import { Public, TOPICS } from '@flick-finder/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { HallEventDto } from './dto/hall-event.dto';
import { HallConsumerService } from './hall.service';

@Public()
@Controller('consumers')
export class HallConsumerController {
  constructor(private readonly consumerService: HallConsumerService) {}

  @EventPattern(TOPICS.HALL.CREATED)
  async handleHallCreated(@Payload() hall: HallEventDto) {
    return this.consumerService.createHall(hall);
  }

  @EventPattern(TOPICS.HALL.UPDATED)
  async handleHallUpdated(@Payload() { _id, ...hallUpdateBody }: HallEventDto) {
    return this.consumerService.updateHall(_id, hallUpdateBody);
  }

  @EventPattern(TOPICS.HALL.DELETED)
  async handleHallDeleted(@Payload() hallId: string) {
    return this.consumerService.deleteHall(hallId);
  }
}
