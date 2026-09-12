// FILE: apps/api-services/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InternalJwtModule } from '@auth/index';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { PrismaModule } from './database/prisma.module';
import { ApiKeyGuard } from './guards/api-key.guard';
import { InternalAuthGuard } from './guards/internal-auth.guard';
import { EchoController } from './modules/echo/echo.controller';
import { HealthController } from './modules/health/health.controller';
import { MasterDataModule } from './modules/master-data/master-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema,
      validationOptions: { abortEarly: false },
    }),
    InternalJwtModule,
    PrismaModule,
    MasterDataModule,
  ],
  controllers: [HealthController, EchoController],
  providers: [ApiKeyGuard, InternalAuthGuard],
})
export class AppModule {}
