// FILE: apps/api-services/src/modules/master-data/activity/mappers/activity.mapper.ts
import { m_activity } from '@prisma/client';
import { ActivityResponse } from '../dto/activity.response';

export class ActivityMapper {
  static toResponse(entity: m_activity): ActivityResponse {
    return {
      activityId: entity.activity_id,
      activityName: entity.activity_name,
      status: entity.status,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    };
  }

  static toResponseList(entities: m_activity[]): ActivityResponse[] {
    return entities.map((entity) => ActivityMapper.toResponse(entity));
  }
}
