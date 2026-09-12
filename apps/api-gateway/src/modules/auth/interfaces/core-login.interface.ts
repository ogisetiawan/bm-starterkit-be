// FILE: apps/api-gateway/src/modules/auth/interfaces/core-login.interface.ts
/**
 * Assumed Core API response shapes (STEP 2) — confirm against the real
 * response via the dev-only log in CoreClient, then tighten if needed.
 */
export interface CoreUser {
  user_id?: string;
  email?: string;
  employee?: unknown;
  auth_user_applications?: Array<{
    applications?: { application_code?: string };
  }>;
  auth_user_roles?: Array<{
    auth_roles?: { role_name?: string };
  }>;
}

export interface CoreLoginResponse {
  access_token?: string;
  user?: CoreUser;
}
