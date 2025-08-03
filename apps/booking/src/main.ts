import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { geKafkaMicroserviceOptions } from '@flick-finder/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Flick Finder Booking Service')
    .setDescription('Flick Finder Booking REST API specification')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api/v1');
  app.disable('x-powered-by');
  app.enableCors();
  app.connectMicroservice<MicroserviceOptions>(
    geKafkaMicroserviceOptions(
      configService.get('KAFKA_BROKER'),
      configService.get('KAFKA_CLIENT_ID'),
      configService.get('KAFKA_GROUP_ID'),
    ),
    { inheritAppConfig: true },
  );

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api/v1', app, document);

  await app.startAllMicroservices();
  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
