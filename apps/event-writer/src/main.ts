import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { geKafkaMicroserviceOptions } from '@flick-finder/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    geKafkaMicroserviceOptions(
      process.env.KAFKA_BROKER,
      process.env.KAFKA_CLIENT_ID,
      process.env.KAFKA_GROUP_ID,
    ),
  );

  await app.listen();
}
bootstrap();
