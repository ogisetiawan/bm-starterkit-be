// FILE: apps/api-services/src/modules/master-data/activity/activity.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { m_activity } from '@prisma/client';
import {
  ActivityRepository,
  ActivityUpdateData,
} from './activity.repository';
import { ActivityQueryDto } from './dto/activity-query.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

export interface ActivityPage {
  entities: m_activity[];
  page: number;
  limit: number;
  total: number;
}

@Injectable()
export class ActivityService {
  constructor(private readonly repository: ActivityRepository) {}

  create(dto: CreateActivityDto): Promise<m_activity> {
    return this.repository.create({
      activity_name: dto.activityName,
      ...(dto.status === undefined ? {} : { status: dto.status }),
    });
  }

  async findAll(query: ActivityQueryDto): Promise<ActivityPage> {
    const skip = (query.page - 1) * query.limit;
    const [entities, total] = await Promise.all([
      this.repository.findAll({
        skip,
        take: query.limit,
        search: query.search,
      }),
      this.repository.count(query.search),
    ]);

    return {
      entities,
      page: query.page,
      limit: query.limit,
      total,
    };
  }

  async findById(id: number): Promise<m_activity> {
    const activity = await this.repository.findById(id);
    if (!activity) {
      throw new NotFoundException(`Activity ${id} not found`);
    }
    return activity;
  }

  async update(id: number, dto: UpdateActivityDto): Promise<m_activity> {
    await this.findById(id);
    const data: ActivityUpdateData = {
      updated_at: new Date(),
      ...(dto.activityName === undefined
        ? {}
        : { activity_name: dto.activityName }),
      ...(dto.status === undefined ? {} : { status: dto.status }),
    };
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<m_activity> {
    await this.findById(id);
    return this.repository.delete(id);
  }
}
