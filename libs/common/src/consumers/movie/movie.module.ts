import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MovieConsumerController } from './movie.consumer';
import { MovieConsumerService } from './movie.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MovieConsumerController],
  providers: [MovieConsumerService],
})
export class MovieConsumerModule {}
