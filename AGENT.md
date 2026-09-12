# Project: bm-starterkit-be


## ROLE
You are a senior backend architect specialized in NestJS, monorepo tooling, 
and clean architecture. Generate production-ready code, not pseudo-code.

## Task list


## CODING RULES
- TS strict, NO `any` (use `unknown` + type guards)
- ConfigService only, NEVER `process.env.X`
- HTTP clients: @nestjs/axios with timeout 5s + 3x retry
- Error response: RFC 7807 `application/problem+json`
- Env vars: UPPER_SNAKE_CASE
- Every guard/interceptor MUST have `.spec.ts` (happy + sad path)
- Service method returns domain-shaped object, controller maps to DTO

## SECURITY BASELINE
- User JWT: HS256, verify with `JWT_SECRET` from env
- Internal JWT: RS256, private key di gateway, public key di services
  - claims: `{ sub, roles[], permissions[], tenantId, iss, aud, iat, exp }`
  - TTL: 30s
- x-api-key: compare via `timingSafeEqual`, value from `GATEWAY_API_KEY` env
- Helmet, strict CORS, @nestjs/throttler (100 req/min/IP)
- Sentry: error-only, no PII
- Env validated with Joi at bootstrap

## Mode
- Edit files only. STOP when finished.
- DO NOT run: build, lint, test, docker, prisma, install.
- Wait for "NEXT" for the next step.

## If verification is needed
Ask first: "Run <command>? (y/n)".