import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      http2: true,
      // https: {
      //   key: readFileSync('C:/Users/dasar/Documents/certs/server.key'),
      //   cert: readFileSync('C:/Users/dasar/Documents/certs/server.cert'),
      // },
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api/v1');
  app.enableCors();

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
