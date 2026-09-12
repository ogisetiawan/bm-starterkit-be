// FILE: apps/api-gateway/src/modules/auth/guards/core-bearer.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Ensures a Core Bearer token is present.
 * Core remains authoritative: ContextInjectionInterceptor forwards this token
 * to `/auth/profile`, and Core validates it before a request is proxied.
 */
@Injectable()
export class CoreBearerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authorization = req.headers.authorization;

    if (
      typeof authorization !== 'string' ||
      !/^Bearer\s+\S+$/i.test(authorization)
    ) {
      throw new UnauthorizedException('Missing bearer token');
    }

    return true;
  }
}
