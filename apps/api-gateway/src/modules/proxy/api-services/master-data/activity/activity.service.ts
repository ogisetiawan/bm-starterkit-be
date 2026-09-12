// FILE: apps/api-gateway/src/modules/proxy/api-services/master-data/activity/activity.service.ts
import {
  HttpException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse, Method } from 'axios';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { HEADERS } from '@common/index';

const SERVICES_TIMEOUT_MS = 5000;

export interface ActivityProxiedResponse {
  status: number;
  data: unknown;
}

/**
 * Forwards activity requests to api-services. Relies on ContextInjectionInterceptor
 * having already injected the trust-boundary headers onto the request.
 */
@Injectable()
export class ActivityService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.baseUrl = config
      .getOrThrow<string>('services.baseUrl')
      .replace(/\/+$/, '');
  }

  async forward(
    method: string,
    path: string,
    req: Request,
  ): Promise<ActivityProxiedResponse> {
    try {
      const response: AxiosResponse<unknown> = await firstValueFrom(
        this.http.request<unknown>({
          method: method as Method,
          url: `${this.baseUrl}${path}`,
          data: req.body as unknown,
          params: req.query,
          headers: this.forwardHeaders(req),
          timeout: SERVICES_TIMEOUT_MS,
        }),
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      throw this.toHttpException(error);
    }
  }

  /** Only the injected trust headers + content-type — never raw client headers. */
  private forwardHeaders(req: Request): Record<string, string> {
    const headers: Record<string, string> = {
      'content-type':
        (req.headers['content-type'] as string | undefined) ?? 'application/json',
    };
    for (const key of [
      HEADERS.API_KEY,
      HEADERS.USER_DATA,
      HEADERS.INTERNAL_TOKEN,
      HEADERS.REQUEST_ID,
    ]) {
      const value = req.headers[key];
      if (typeof value === 'string') {
        headers[key] = value;
      }
    }
    return headers;
  }

  private toHttpException(error: unknown): HttpException {
    if (error instanceof AxiosError && error.response) {
      return new HttpException(
        (error.response.data ?? 'Upstream service error') as object | string,
        error.response.status,
      );
    }
    return new ServiceUnavailableException('Internal services are unavailable');
  }
}
