// FILE: apps/api-gateway/src/modules/proxy/proxy.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
