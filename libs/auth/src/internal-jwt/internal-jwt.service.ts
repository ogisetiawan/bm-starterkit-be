// FILE: libs/auth/src/internal-jwt/internal-jwt.service.ts
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AuthContext } from '../interfaces/auth-context.interface';

export const INTERNAL_JWT_ISSUER = 'api-gateway';
export const INTERNAL_JWT_AUDIENCE = 'api-services';
export const INTERNAL_JWT_TTL_SECONDS = 30;

/**
 * Signs/verifies the short-lived internal token that carries the AuthContext
 * across the gateway → services trust boundary (RS256, iss/aud pinned).
 */
@Injectable()
export class InternalJwtService {
  constructor(private readonly config: ConfigService) {}

  sign(payload: AuthContext): string {
    return sign({ ...payload }, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: INTERNAL_JWT_TTL_SECONDS,
      issuer: INTERNAL_JWT_ISSUER,
      audience: INTERNAL_JWT_AUDIENCE,
    });
  }

  verify(token: string): AuthContext {
    try {
      const decoded = verify(token, this.publicKey, {
        algorithms: ['RS256'],
        issuer: INTERNAL_JWT_ISSUER,
        audience: INTERNAL_JWT_AUDIENCE,
      });
      if (typeof decoded !== 'object' || decoded === null) {
        throw new UnauthorizedException('Invalid internal token payload');
      }
      const claims: Record<string, unknown> = decoded;
      const authContext: AuthContext = {
        userId: this.readNullableString(claims, 'userId'),
        appCode: this.readNullableString(claims, 'appCode'),
        roles: this.readNullableString(claims, 'roles'),
        employee: claims['employee'] ?? null,
      };
      if (Object.prototype.hasOwnProperty.call(claims, 'raw')) {
        authContext.raw = claims['raw'];
      }
      return authContext;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Internal token expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid internal token');
      }
      throw error;
    }
  }

  private get privateKey(): string {
    return this.getKey('security.internalJwtPrivateKey');
  }

  private get publicKey(): string {
    return this.getKey('security.internalJwtPublicKey');
  }

  private getKey(path: string): string {
    const encodedKey = this.config.get<string>(path);
    if (!encodedKey) {
      throw new InternalServerErrorException(`Missing config: ${path}`);
    }
    const key = Buffer.from(encodedKey, 'base64').toString('utf8');
    if (!key.includes('-----BEGIN')) {
      throw new InternalServerErrorException(`Invalid key config: ${path}`);
    }
    return key;
  }

  private readNullableString(
    claims: Record<string, unknown>,
    key: string,
  ): string | null {
    const value = claims[key];
    if (value === undefined || value === null) {
      return null;
    }
    if (typeof value !== 'string') {
      throw new UnauthorizedException(`Invalid internal token claim: ${key}`);
    }
    return value;
  }
}
