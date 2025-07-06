import { Public, TOPICS } from '@flick-finder/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TheaterConsumerService } from './theater.service';
import { TheaterEventDto } from './dto/theater-event.dto';

@Public()
@Controller('consumers')
export class TheaterConsumerController {
  constructor(private readonly consumerService: TheaterConsumerService) {}

  @EventPattern(TOPICS.THEATER.CREATED)
  async handleTheaterCreated(@Payload() theater: TheaterEventDto) {
    return this.consumerService.createTheater(theater);
  }

  @EventPattern(TOPICS.THEATER.UPDATED)
  async handleTheaterUpdated(
    @Payload() { _id, ...theaterUpdateBody }: TheaterEventDto,
  ) {
    return this.consumerService.updateTheater(_id, theaterUpdateBody);
  }

  @EventPattern(TOPICS.THEATER.DELETED)
  async handleTheaterDeleted(@Payload() theaterId: string) {
    return this.consumerService.deleteTheater(theaterId);
  }
}
