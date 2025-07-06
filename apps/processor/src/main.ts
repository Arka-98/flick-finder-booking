import { NestFactory } from '@nestjs/core';
import { ProcessorModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ProcessorModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
