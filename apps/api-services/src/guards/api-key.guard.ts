// FILE: apps/api-services/src/guards/api-key.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';
import { Request } from 'express';
import { HEADERS } from '@common/index';

/**
 * First guard in the chain (MUST run before InternalAuthGuard).
 * Proves the request came through the gateway via the shared `x-api-key`,
 * compared in constant time.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = req.headers[HEADERS.API_KEY];
    const expected = this.config.getOrThrow<string>('security.gatewayApiKey');

    if (typeof apiKey !== 'string' || !this.safeEqual(apiKey, expected)) {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    return true;
  }

  private safeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
  }
}
