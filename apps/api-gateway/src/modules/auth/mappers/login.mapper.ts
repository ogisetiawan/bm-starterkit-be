// FILE: apps/api-gateway/src/modules/auth/mappers/login.mapper.ts
import { BadGatewayException } from '@nestjs/common';
import { LoginResponseDto, LoginUserDto } from '../dto/login.response';
import { CoreLoginResponse, CoreUser } from '../interfaces/core-login.interface';

/**
 * Maps the raw Core login response onto the explicit gateway DTO.
 */
export class LoginMapper {
  static toResponse(raw: CoreLoginResponse): LoginResponseDto {
    if (!raw.access_token) {
      throw new BadGatewayException('Core login response is missing access_token');
    }
    return {
      accessToken: raw.access_token,
      user: LoginMapper.toUser(raw.user),
    };
  }

  private static toUser(user: CoreUser | undefined): LoginUserDto {
    return {
      userId: user?.user_id ?? null,
      email: user?.email ?? null,
      employee: user?.employee ?? null,
      appCodes: (user?.auth_user_applications ?? [])
        .map((entry) => entry?.applications?.application_code)
        .filter((code): code is string => typeof code === 'string'),
      roles: (user?.auth_user_roles ?? [])
        .map((entry) => entry?.auth_roles?.role_name)
        .filter((role): role is string => typeof role === 'string'),
    };
  }
}
