// FILE: apps/api-services/src/modules/master-data/activity/activity.module.ts
import { Module } from '@nestjs/common';
import { InternalJwtModule } from '@auth/index';
import { ApiKeyGuard } from '../../../guards/api-key.guard';
import { InternalAuthGuard } from '../../../guards/internal-auth.guard';
import { ActivityController } from './activity.controller';
import { ActivityRepository } from './activity.repository';
import { ActivityService } from './activity.service';

@Module({
  imports: [InternalJwtModule],
  controllers: [ActivityController],
  providers: [
    ActivityService,
    ActivityRepository,
    ApiKeyGuard,
    InternalAuthGuard,
  ],
})
export class ActivityModule {}
