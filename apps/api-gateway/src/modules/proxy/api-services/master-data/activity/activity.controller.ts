// FILE: apps/api-gateway/src/modules/proxy/api-services/master-data/activity/activity.controller.ts
import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { MenuKey } from '../../../../auth/decorators/menu-key.decorator';
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator';
import { CoreBearerGuard } from '../../../../auth/guards/core-bearer.guard';
import { MenuPermissionGuard } from '../../../../auth/guards/menu-permission.guard';
import { ActivityService } from './activity.service';

const ACTIVITY_BODY_SCHEMA = {
  type: 'object',
  properties: {
    activityName: {
      type: 'string',
      maxLength: 100,
      example: 'Electricity consumption',
    },
    status: { type: 'boolean', default: true },
  },
} as const;

/**
 * Gateway routes that forward activity requests to api-services.
 * Guard order: CoreBearerGuard → MenuPermissionGuard.
 * Menu permissions come from Core `GET /auth/menupermissions` (`menu_key=ghg-activity-inventories`).
 */
@ApiTags('Activities')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token' })
@ApiForbiddenResponse({ description: 'Missing menu permission' })
// @MenuKey('ghg-activity-inventories') // sample for activity is not ghg-activity-inventories, u can check direct on core
@Controller()
// @UseGuards(CoreBearerGuard, MenuPermissionGuard)
@UseGuards(CoreBearerGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('activities')
  @RequirePermission('create-data')
  @ApiOperation({ summary: 'Create an activity' })
  @ApiBody({ schema: { ...ACTIVITY_BODY_SCHEMA, required: ['activityName'] } })
  @ApiCreatedResponse({ description: 'Activity created' })
  async createActivity(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.forwardTo('/activities', req, res);
  }

  @Get('activities')
  // @RequirePermission('show-list-data')
  @ApiOperation({ summary: 'List activities' })
  @ApiOkResponse({ description: 'Paginated activity list' })
  async listActivities(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.forwardTo('/activities', req, res);
  }

  @Get('activities/:id')
  @RequirePermission('show-detail-data')
  @ApiOperation({ summary: 'Get an activity' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Activity detail' })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  async getActivity(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.forwardTo(`/activities/${encodeURIComponent(id)}`, req, res);
  }

  @Patch('activities/:id')
  @RequirePermission('update-data')
  @ApiOperation({ summary: 'Update an activity' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: ACTIVITY_BODY_SCHEMA })
  @ApiOkResponse({ description: 'Activity updated' })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  async updateActivity(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.forwardTo(`/activities/${encodeURIComponent(id)}`, req, res);
  }

  @Delete('activities/:id')
  @RequirePermission('update-data')
  @ApiOperation({ summary: 'Soft-delete an activity' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Activity deleted' })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  async deleteActivity(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.forwardTo(`/activities/${encodeURIComponent(id)}`, req, res);
  }

  private async forwardTo(
    path: string,
    req: Request,
    res: Response,
  ): Promise<void> {
    const { status, data } = await this.activityService.forward(
      req.method,
      path,
      req,
    );
    res.status(status).json(data);
  }
}
