// FILE: apps/api-services/src/modules/echo/echo.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthContext } from '@auth/index';
import { CurrentAuth } from '../../decorators/current-auth.decorator';
import { ApiKeyGuard } from '../../guards/api-key.guard';
import { InternalAuthGuard } from '../../guards/internal-auth.guard';

/**
 * Temporary verification endpoint — proves the full trust chain:
 * gateway JWT → header injection → api-key check → internal token verify.
 * Guard order is mandatory: ApiKeyGuard → InternalAuthGuard.
 */
@Controller('echo')
@UseGuards(ApiKeyGuard, InternalAuthGuard)
export class EchoController {
  @Get()
  echo(@CurrentAuth() auth: AuthContext): { auth: AuthContext; message: string } {
    return { auth, message: 'from services' };
  }
}
