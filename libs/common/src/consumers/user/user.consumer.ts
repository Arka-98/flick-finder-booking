import { Public, TOPICS, UserEventDto } from '@flick-finder/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserConsumerService } from './user.service';
import { CustomUserEventDto } from './dto/custom-user-event.dto';

@Public()
@Controller('consumers')
export class UserConsumerController {
  constructor(private readonly consumerService: UserConsumerService) {}

  @EventPattern(TOPICS.USER.CREATED)
  async handleUserCreated(@Payload() user: CustomUserEventDto) {
    return this.consumerService.createUser(user);
  }

  @EventPattern(TOPICS.USER.UPDATED)
  async handleUserUpdated(@Payload() { _id, ...userUpdateBody }: UserEventDto) {
    return this.consumerService.updateUser(_id, userUpdateBody);
  }

  @EventPattern(TOPICS.USER.DELETED)
  async handleUserDeleted(@Payload() userId: string) {
    return this.consumerService.deleteUser(userId);
  }
}
