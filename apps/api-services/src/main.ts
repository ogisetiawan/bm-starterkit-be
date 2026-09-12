// FILE: apps/api-services/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('services.port');
  await app.listen(port);
  console.log(`api-services listening on :${port}`);
}

void bootstrap();
