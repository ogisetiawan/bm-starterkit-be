// FILE: apps/api-services/src/modules/master-data/master-data.module.ts
import { Module } from '@nestjs/common';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [ActivityModule],
})
export class MasterDataModule {}
