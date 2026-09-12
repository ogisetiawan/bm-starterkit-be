// FILE: apps/api-services/src/modules/master-data/activity/dto/activity.response.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActivityResponse {
  @ApiProperty({ example: 1 })
  activityId!: number;

  @ApiProperty({ example: 'Electricity consumption' })
  activityName!: string;

  @ApiProperty()
  status!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiPropertyOptional({ nullable: true })
  updatedAt!: Date | null;
}

export class ActivityPaginationMeta {
  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  totalPages!: number;
}

export class ActivityListResponse {
  @ApiProperty({ type: [ActivityResponse] })
  data!: ActivityResponse[];

  @ApiProperty({ type: ActivityPaginationMeta })
  meta!: ActivityPaginationMeta;
}
