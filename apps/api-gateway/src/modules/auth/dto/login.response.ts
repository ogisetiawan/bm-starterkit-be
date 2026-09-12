// FILE: apps/api-gateway/src/modules/auth/dto/login.response.ts
/**
 * Explicit gateway response shape (coding-rules §4.2) —
 * the raw Core response is never exposed to clients.
 */
export class LoginUserDto {
  userId!: string | null;
  email!: string | null;
  employee!: unknown;
  appCodes!: string[];
  roles!: string[];
}

export class LoginResponseDto {
  accessToken!: string;
  user!: LoginUserDto;
}
