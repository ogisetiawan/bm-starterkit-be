// FILE: apps/api-gateway/src/modules/auth/auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login.response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   summary: 'Login via Core (remote)',
  //   description:
  //     'Returns accessToken from Core. Copy accessToken into Swagger Authorize (without the word Bearer), then call protected endpoints.',
  // })
  // @ApiOkResponse({ type: LoginResponseDto })
  // @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  // login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
  //   return this.auth.login(dto);
  // }
}
