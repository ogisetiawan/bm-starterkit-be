// FILE: apps/api-services/src/modules/master-data/activity/dto/activity-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '@common/index';

export class ActivityQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by activity name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
