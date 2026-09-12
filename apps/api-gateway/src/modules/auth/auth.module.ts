// FILE: apps/api-gateway/src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CoreClient } from './core.client';
import { CoreBearerGuard } from './guards/core-bearer.guard';
import { MenuPermissionGuard } from './guards/menu-permission.guard';
import { MenuPermissionsService } from './menu-permissions.service';
import { ProfileService } from './profile.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [
    CoreClient,
    AuthService,
    ProfileService,
    MenuPermissionsService,
    CoreBearerGuard,
    MenuPermissionGuard,
  ],
  exports: [
    AuthService,
    CoreClient,
    ProfileService,
    MenuPermissionsService,
    CoreBearerGuard,
    MenuPermissionGuard,
  ],
})
export class AuthModule {}
