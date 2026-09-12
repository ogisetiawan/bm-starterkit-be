// FILE: apps/api-gateway/src/modules/auth/dto/login.response.ts
import { ApiProperty } from '@nestjs/swagger';

/**
 * Explicit gateway response shape (coding-rules §4.2) —
 * the raw Core response is never exposed to clients.
 */
export class LoginUserDto {
  @ApiProperty({ nullable: true })
  userId!: string | null;

  @ApiProperty({ nullable: true })
  email!: string | null;

  @ApiProperty({ nullable: true })
  employee!: unknown;

  @ApiProperty({ type: [String] })
  appCodes!: string[];

  @ApiProperty({ type: [String] })
  roles!: string[];
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Copy this value into Swagger Authorize (without Bearer prefix)',
  })
  accessToken!: string;

  @ApiProperty({ type: LoginUserDto })
  user!: LoginUserDto;
}
