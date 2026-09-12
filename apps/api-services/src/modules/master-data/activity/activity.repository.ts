// FILE: apps/api-services/src/modules/master-data/activity/activity.repository.ts
import { Injectable } from '@nestjs/common';
import { m_activity, Prisma } from '@prisma/client';
import { BaseRepository } from '@database/index';
import { PrismaService } from '../../../database/prisma.service';

export interface ActivityCreateData {
  activity_name: string;
  status?: boolean;
}

export interface ActivityUpdateData {
  activity_name?: string;
  status?: boolean;
  updated_at: Date;
}

export interface ActivityFindAllParams {
  skip: number;
  take: number;
  search?: string;
}

@Injectable()
export class ActivityRepository extends BaseRepository<
  m_activity,
  number,
  ActivityCreateData,
  ActivityUpdateData
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  findById(id: number): Promise<m_activity | null> {
    return this.prisma.m_activity.findFirst({
      where: { activity_id: id, is_deleted: false },
    });
  }

  findAll(params: ActivityFindAllParams): Promise<m_activity[]> {
    return this.prisma.m_activity.findMany({
      where: this.buildWhere(params.search),
      skip: params.skip,
      take: params.take,
      orderBy: { created_at: 'desc' },
    });
  }

  count(search?: string): Promise<number> {
    return this.prisma.m_activity.count({
      where: this.buildWhere(search),
    });
  }

  create(data: ActivityCreateData): Promise<m_activity> {
    return this.prisma.m_activity.create({ data });
  }

  update(id: number, data: ActivityUpdateData): Promise<m_activity> {
    return this.prisma.m_activity.update({
      where: { activity_id: id },
      data,
    });
  }

  /** Soft delete because `m_activity` has an `is_deleted` column. */
  delete(id: number): Promise<m_activity> {
    return this.prisma.m_activity.update({
      where: { activity_id: id },
      data: { is_deleted: true, updated_at: new Date() },
    });
  }

  private buildWhere(search?: string): Prisma.m_activityWhereInput {
    return {
      is_deleted: false,
      ...(search
        ? { activity_name: { contains: search } }
        : {}),
    };
  }
}
