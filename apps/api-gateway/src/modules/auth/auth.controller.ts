// FILE: apps/api-gateway/src/modules/auth/auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login.response';
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
  //   return this.auth.login(dto);
  // }
}
