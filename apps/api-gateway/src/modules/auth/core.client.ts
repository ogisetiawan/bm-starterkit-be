// FILE: apps/api-gateway/src/modules/auth/core.client.ts
import {
  HttpException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { CoreLoginResponse } from './interfaces/core-login.interface';

const CORE_TIMEOUT_MS = 5000;

/**
 * Thin HTTP client for the Core (WEB Core) API.
 * Encapsulates Core endpoint paths + `app_code` injection and returns RAW
 * Core responses — mapping to DTOs happens in mappers, never here.
 */
@Injectable()
export class CoreClient {
  private readonly logger = new Logger(CoreClient.name);
  private readonly baseUrl: string;
  private readonly appCode: string;
  private readonly isDev: boolean;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.baseUrl = config.getOrThrow<string>('core.baseUrl').replace(/\/+$/, '');
    this.appCode = config.getOrThrow<string>('core.appCode');
    this.isDev = config.get<string>('nodeEnv') !== 'production';
  }

  /** POST {CORE_BASE_URL}/auth/login — returns the raw Core response. */
  async login(dto: LoginDto): Promise<CoreLoginResponse> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<CoreLoginResponse>(
          `${this.baseUrl}/auth/login`,
          { email: dto.email, password: dto.password, app_code: this.appCode },
          { timeout: CORE_TIMEOUT_MS },
        ),
      );

      // Dev-only shape confirmation. Token redacted — never log secrets/PII (§7.3).
      if (this.isDev) {
        this.logger.debug(
          `Core login raw response: ${JSON.stringify({ ...data, access_token: '[redacted]' })}`,
        );
      }

      return data;
    } catch (error) {
      throw this.toHttpException(error);
    }
  }

  private toHttpException(error: unknown): HttpException {
    if (error instanceof AxiosError && error.response) {
      // Upstream answered (e.g. 401 invalid credentials) — propagate its status.
      return new HttpException('Core authentication failed', error.response.status);
    }
    // Network failure / timeout / unexpected error.
    return new ServiceUnavailableException('Core service is unavailable');
  }
}
