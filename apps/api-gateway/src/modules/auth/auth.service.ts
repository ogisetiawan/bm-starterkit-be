// FILE: apps/api-gateway/src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthContext } from '@auth/index';
import { CoreClient } from './core.client';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login.response';
import { LoginMapper } from './mappers/login.mapper';
import { AuthContextMapper } from './mappers/auth-context.mapper';
import { ProfileService } from './profile.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly core: CoreClient,
    private readonly profile: ProfileService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const raw = await this.core.login(dto);
    return LoginMapper.toResponse(raw);
  }

  /**
   * Builds the normalized AuthContext for an incoming request:
   * extract Bearer token → let Core validate it via profile → map.
   */
  async getAuthContext(req: Request): Promise<AuthContext> {
    const token = this.extractBearer(req.headers.authorization);
    const profile = await this.profile.getProfile(token);
    return AuthContextMapper.toAuthContext(profile);
  }

  private extractBearer(authorization: string | undefined): string {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const token = authorization.slice('Bearer '.length).trim();
    if (token.length === 0) {
      throw new UnauthorizedException('Missing bearer token');
    }
    return token;
  }

}
