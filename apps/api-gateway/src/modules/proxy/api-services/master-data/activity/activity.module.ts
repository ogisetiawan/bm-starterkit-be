// FILE: apps/api-gateway/src/modules/proxy/api-services/master-data/activity/activity.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../../../../auth/auth.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
