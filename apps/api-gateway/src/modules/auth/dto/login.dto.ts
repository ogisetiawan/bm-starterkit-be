// FILE: apps/api-gateway/src/modules/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * Login input. `app_code` is NOT client-supplied — the gateway injects it
 * from CORE_APP_CODE (see CoreClient).
 */
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password!: string;
}
