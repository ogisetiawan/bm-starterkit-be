// FILE: apps/api-services/src/decorators/current-auth.decorator.ts
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthContext } from '@auth/index';
import { AuthenticatedRequest } from '../guards/internal-auth.guard';

/**
 * `@CurrentAuth()` — extracts the AuthContext attached by InternalAuthGuard.
 */
export const CurrentAuth = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthContext => {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!req.auth) {
      throw new UnauthorizedException('Missing auth context');
    }
    return req.auth;
  },
);
