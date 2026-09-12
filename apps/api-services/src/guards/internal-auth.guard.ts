// FILE: apps/api-services/src/guards/internal-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthContext, InternalJwtService } from '@auth/index';
import { HEADERS } from '@common/index';

export type AuthenticatedRequest = Request & { auth?: AuthContext };

/**
 * Second guard in the chain (MUST run after ApiKeyGuard).
 * Verifies `x-internal-token` (RS256, public key, iss=api-gateway,
 * aud=api-services) and attaches the AuthContext to `req.auth`.
 */
@Injectable()
export class InternalAuthGuard implements CanActivate {
  constructor(private readonly internalJwt: InternalJwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = req.headers[HEADERS.INTERNAL_TOKEN];

    if (typeof token !== 'string' || token.length === 0) {
      throw new UnauthorizedException('Missing internal token');
    }

    // InternalJwtService.verify throws UnauthorizedException on invalid/expired.
    req.auth = this.internalJwt.verify(token);
    return true;
  }
}
