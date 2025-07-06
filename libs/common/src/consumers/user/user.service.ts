import { IUserEvent } from '@flick-finder/common';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CustomUserEventDto } from './dto/custom-user-event.dto';

@Injectable()
export class UserConsumerService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser(user: CustomUserEventDto) {
    return this.userRepository.insert(user);
  }

  updateUser(userId: string, userUpdateBody: Omit<IUserEvent, '_id'>) {
    return this.userRepository.update({ id: userId }, userUpdateBody);
  }

  deleteUser(userId: string) {
    return this.userRepository.delete({ id: userId });
  }
}
