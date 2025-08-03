import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const path = await import('node:path');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      http2: true,
      https: {
        key: readFileSync(path.join(process.cwd(), 'server.key')),
        cert: readFileSync(path.join(process.cwd(), 'server.cert')),
      },
    }),
  );
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
