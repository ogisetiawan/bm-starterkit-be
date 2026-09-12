// FILE: libs/auth/src/interfaces/auth-context.interface.ts
/**
 * Normalized user context derived from the Core profile.
 * Carried across the gateway → services boundary (from STEP 4 onwards
 * as `x-user-data` / `x-internal-token` claims).
 */
export interface AuthContext {
  userId: string | null;
  appCode: string | null;
  roles: string | null;
  employee: unknown | null;
  raw?: unknown;
}
