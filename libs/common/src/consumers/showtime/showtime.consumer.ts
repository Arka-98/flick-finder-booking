import { Public, TOPICS } from '@flick-finder/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ShowtimeEventDto } from './dto/showtime-event.dto';
import { ShowtimeConsumerService } from './showtime.service';

@Public()
@Controller('consumers')
export class ShowtimeConsumerController {
  constructor(private readonly consumerService: ShowtimeConsumerService) {}

  @EventPattern(TOPICS.SHOWTIME.CREATED)
  async handleShowtimeCreated(@Payload() showtime: ShowtimeEventDto) {
    return this.consumerService.createShowtime(showtime);
  }

  @EventPattern(TOPICS.SHOWTIME.UPDATED)
  async handleShowtimeUpdated(
    @Payload() { _id, ...showtimeUpdateBody }: ShowtimeEventDto,
  ) {
    return this.consumerService.updateShowtime(_id, showtimeUpdateBody);
  }

  @EventPattern(TOPICS.SHOWTIME.DELETED)
  async handleShowtimeDeleted(@Payload() showtimeId: string) {
    return this.consumerService.deleteShowtime(showtimeId);
  }
}
