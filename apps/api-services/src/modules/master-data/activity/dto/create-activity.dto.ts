// FILE: apps/api-services/src/modules/master-data/activity/dto/create-activity.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ example: 'Electricity consumption', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  activityName!: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
