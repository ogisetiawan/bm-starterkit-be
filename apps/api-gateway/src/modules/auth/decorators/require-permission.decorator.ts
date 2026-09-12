// FILE: apps/api-gateway/src/modules/auth/decorators/require-permission.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PERMISSION_METADATA = 'require_permission';

/**
 * Declares the Core menu permission required for this handler
 * (e.g. `show-detail-data`, `create-data`).
 */
export const RequirePermission = (
  permission: string,
): MethodDecorator & ClassDecorator =>
  SetMetadata(REQUIRE_PERMISSION_METADATA, permission);
