// FILE: apps/api-gateway/src/modules/auth/mappers/auth-context.mapper.ts
import { AuthContext } from '@auth/index';
import { CoreUser } from '../interfaces/core-login.interface';

/**
 * Maps the raw Core profile response onto the normalized {@link AuthContext}.
 * The profile may nest the user under `user` or be the user object itself.
 */
export class AuthContextMapper {
  static toAuthContext(profile: unknown): AuthContext {
    const container = AuthContextMapper.asRecord(profile);
    const user = (AuthContextMapper.asRecord(container?.['user']) ??
      container ??
      {}) as CoreUser;

    return {
      userId: user.user_id ?? null,
      appCode:
        user.auth_user_applications?.[0]?.applications?.application_code ?? null,
      roles: user.auth_user_roles?.[0]?.auth_roles?.role_name ?? null,
      employee: user.employee ?? null,
    };
  }

  private static asRecord(value: unknown): Record<string, unknown> | null {
    return typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>)
      : null;
  }
}
