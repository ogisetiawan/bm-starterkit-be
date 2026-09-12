// FILE: apps/api-services/src/modules/master-data/activity/activity.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../../../guards/api-key.guard';
import { InternalAuthGuard } from '../../../guards/internal-auth.guard';
import { ActivityService } from './activity.service';
import { ActivityQueryDto } from './dto/activity-query.dto';
import {
  ActivityListResponse,
  ActivityResponse,
} from './dto/activity.response';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityMapper } from './mappers/activity.mapper';

@ApiTags('Activities')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Invalid gateway credentials' })
@UseGuards(ApiKeyGuard, InternalAuthGuard)
@Controller('activities')
export class ActivityController {
  constructor(private readonly service: ActivityService) {}

  @Post()
  @ApiOperation({ summary: 'Create an activity' })
  @ApiCreatedResponse({ type: ActivityResponse })
  async create(@Body() dto: CreateActivityDto): Promise<ActivityResponse> {
    const entity = await this.service.create(dto);
    return ActivityMapper.toResponse(entity);
  }

  @Get()
  @ApiOperation({ summary: 'List activities' })
  @ApiOkResponse({ type: ActivityListResponse })
  async findAll(@Query() query: ActivityQueryDto): Promise<ActivityListResponse> {
    const result = await this.service.findAll(query);
    return {
      data: ActivityMapper.toResponseList(result.entities),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an activity' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: ActivityResponse })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ActivityResponse> {
    const entity = await this.service.findById(id);
    return ActivityMapper.toResponse(entity);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an activity' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: ActivityResponse })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActivityDto,
  ): Promise<ActivityResponse> {
    const entity = await this.service.update(id, dto);
    return ActivityMapper.toResponse(entity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete an activity' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: ActivityResponse })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ActivityResponse> {
    const entity = await this.service.delete(id);
    return ActivityMapper.toResponse(entity);
  }
}
