// FILE: apps/api-services/src/config/configuration.ts
/**
 * Centralized env access for api-services.
 * RULE: `process.env` may ONLY be referenced in this file (§4.1).
 */
export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  services: {
    port: parseInt(process.env.SERVICES_PORT ?? '3001', 10),
  },
  security: {
    // Shared with the gateway — proves requests came through the BFF.
    gatewayApiKey: process.env.GATEWAY_API_KEY,
    // RS256 public key — verifies internal tokens signed by api-gateway.
    internalJwtPublicKey: process.env.INTERNAL_JWT_PUBLIC_KEY ?? '',
  },
});
