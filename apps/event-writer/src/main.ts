import { NestFactory } from '@nestjs/core';
import { EventWriterModule } from './event-writer.module';

async function bootstrap() {
  const app = await NestFactory.create(EventWriterModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
