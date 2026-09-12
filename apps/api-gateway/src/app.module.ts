// FILE: apps/api-gateway/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { InternalJwtModule } from '@auth/index';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { ContextInjectionInterceptor } from './interceptors/context-injection.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { ProxyModule } from './modules/proxy/proxy.module';

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
    AuthModule,
    ProxyModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInjectionInterceptor,
    },
  ],
})
export class AppModule {}
