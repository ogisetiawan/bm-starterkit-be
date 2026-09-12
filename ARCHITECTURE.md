# ROLE
You are a senior backend architect specialized in NestJS, monorepo tooling, 
and clean architecture. Generate production-ready code, not pseudo-code.

# TASK
Create a NestJS monorepo starterkit `bm-starterkit-be` with:
- 2 apps: `api-gateway` (BFF) + `api-services` (internal microservice)
- Gateway: JWT validation → RBAC → context injection → proxy + Swagger
- Services: validate internal headers → run business logic → Prisma
- Communication via HTTP headers:
  - `x-api-key`        → gateway identity
  - `x-user-data`      → readable user context (base64 JSON, non-authoritative)
  - `x-internal-token` → signed JWT RS256 (30s, iss=api-gateway, aud=api-services)
  - `x-request-id`     → correlation id
- TypeScript strict, ESLint + Prettier, Jest

# ARCHITECTURE
WEB Core (Auth/Login)
   │  HTTP + JWT Bearer
   ▼
[api-gateway]
   1. JwtGuard          → verify user JWT (HS256, secret from env)
   2. RbacGuard         → check @Roles + CASL
   3. ContextInjectionInterceptor
        - signs x-internal-token (RS256, 30s)
        - injects x-api-key, x-user-data, x-request-id
   4. ProxyController   → forward to api-services
   5. Swagger at /api-docs (gateway only)
   │  HTTP
   ▼
[api-services]
   1. ApiKeyGuard        → check x-api-key
   2. InternalAuthGuard  → verify x-internal-token (RS256 public key)
   3. AuthContextInterceptor → attach req.auth
   4. Controllers → Services → Repositories → Prisma

# FOLDER STRUCTURE
bm-starterkit-be/
├── apps/
│   ├── api-gateway/
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       ├── config/{configuration.ts,validation.schema.ts}
│   │       ├── modules/
│   │       │   ├── auth/           # JwtStrategy + JwtGuard + call web-core
│   │       │   ├── rbac/           # RolesGuard + CASL
│   │       │   ├── proxy/          # forward request ke services
│   │       │   ├── health/
│   │       │   └── swagger/        # swagger setup module
│   │       └── interceptors/context-injection.interceptor.ts
│   │
│   └── api-services/
│       └── src/
│           ├── main.ts
│           ├── app.module.ts
│           ├── config/{configuration.ts,validation.schema.ts}
│           ├── modules/
│           │   ├── master-data/    # user, role, department, dll
│           │   │   ├── user/
│           │   │   │   ├── user.module.ts
│           │   │   │   ├── user.controller.ts
│           │   │   │   ├── user.service.ts
│           │   │   │   ├── user.repository.ts
│           │   │   │   ├── dto/{create-user.dto.ts,update-user.dto.ts,user.response.ts}
│           │   │   │   └── mappers/user.mapper.ts
│           │   │   ├── department/ # contoh module lain
│           │   │   └── master-data.module.ts
│           │   ├── transaction/    # modul transaksi
│           │   │   ├── order/...
│           │   │   └── transaction.module.ts
│           │   ├── health/
│           ├── guards/
│           │   ├── api-key.guard.ts
│           │   └── internal-auth.guard.ts
│           ├── interceptors/auth-context.interceptor.ts
│           └── decorators/current-auth.decorator.ts
│
├── libs/
│   ├── common/                     # filters, logger, constants, dto umum
│   │   └── src/
│   │       ├── constants/{headers.constants.ts,error-codes.constants.ts}
│   │       ├── filters/http-exception.filter.ts    # RFC 7807
│   │       ├── interceptors/{logging.interceptor.ts,request-id.interceptor.ts}
│   │       ├── logger/logger.module.ts
│   │       ├── dto/{pagination.dto.ts,api-response.dto.ts}
│   │       └── index.ts
│   ├── auth/                       # InternalJwtService, @CurrentUser, AuthContext
│   │   └── src/
│   │       ├── internal-jwt/{internal-jwt.module.ts,internal-jwt.service.ts}
│   │       ├── interfaces/auth-context.interface.ts
│   │       ├── decorators/current-user.decorator.ts
│   │       └── index.ts
│   ├── rbac/                       # Role enum, @Roles, RolesGuard, CASL
│   │   └── src/
│   │       ├── enums/role.enum.ts
│   │       ├── decorators/roles.decorator.ts
│   │       ├── guards/roles.guard.ts
│   │       ├── casl/{ability.factory.ts,policies.guard.ts}
│   │       └── index.ts
│   └── database/                   # PrismaService (per-app instance)
│       └── src/
│           ├── prisma/prisma.module.ts
│           ├── prisma/prisma.service.ts
│           ├── base/base.repository.ts
│           └── index.ts
│
├── prisma/
│   ├── api-services/schema.prisma  # hanya api-services yang punya DB
│   └── api-gateway/schema.prisma   # (opsional, kalau gateway simpan session)
│
├── docker/{api-gateway.Dockerfile,api-services.Dockerfile}
├── docker-compose.yml
├── .env.example
├── .cursorrules
├── .eslintrc.js
├── .prettierrc
├── nest-cli.json
├── tsconfig.base.json
├── package.json
└── README.md

# TECH STACK & LIBRARIES REFRENCEE STATERKIT
- Core NestJS & Microservices; @nestjs/microservices, typescript
- Auth, Security & RBAC; permission guard, @casl/ability, nestjs/jwt & @nestjs/passport + passport-jw, rate limiting,  @nestjs/throttler
- helmet & cors: Wajib terpasang di api-gateway untuk proteksi HTTP Header dasar.
- Validation; class-validator & class-transformer
- Database & ORM; prisma/client & prisma 
- Package Manager; pnpm 
- API Documentation; swagger
- Unit Testing / E2E; jest
- @nestjs/terminus: liveness/readiness health checks
- conventional-changelog: changelog berbasis Conventional Commits
- husky: Git quality hooks
- sentry
- joi 
- nestjs-pino, pino-http
- Docker
- CI/CD
- Add popular technologies/libraries or those required for these specifications.

# CODING RULES
- TS strict, NO `any` (use `unknown` + type guards)
- ConfigService only, NEVER `process.env.X`
- HTTP clients: @nestjs/axios with timeout 5s + 3x retry
- Error response: RFC 7807 `application/problem+json`
- Env vars: UPPER_SNAKE_CASE
- Every guard/interceptor MUST have `.spec.ts` (happy + sad path)
- Service method returns domain-shaped object, controller maps to DTO

# SECURITY BASELINE
- User JWT: HS256, verify with `JWT_SECRET` from env
- Internal JWT: RS256, private key di gateway, public key di services
  - claims: `{ sub, roles[], permissions[], tenantId, iss, aud, iat, exp }`
  - TTL: 30s
- x-api-key: compare via `timingSafeEqual`, value from `GATEWAY_API_KEY` env
- Helmet, strict CORS, @nestjs/throttler (100 req/min/IP)
- Sentry: error-only, no PII
- Env validated with Joi at bootstrap



# DELIVERABLES (output file-by-file, in this order)
1.  package.json, pnpm-workspace.yaml, .npmrc
2.  nest-cli.json (projects: api-gateway, api-services, common, auth, rbac, database)
3.  tsconfig.base.json + per-app tsconfig.{app,spec}.json
4.  .env.example
5.  libs/common       (all files)
6.  libs/auth         (InternalJwtService, AuthContext, @CurrentUser)
7.  libs/rbac         (Role enum, @Roles, RolesGuard, CASL)
8.  libs/database     (PrismaService, PrismaModule, BaseRepository)
9.  apps/api-gateway  (main, JwtStrategy, RbacGuard, ContextInjectionInterceptor,
                       ProxyController, HealthController, SwaggerModule)
10. apps/api-services (main, ApiKeyGuard, InternalAuthGuard, AuthContextInterceptor,
                       @CurrentAuth, master-data/user module full CRUD,
                       transaction placeholder, HealthController, SwaggerModule)
11. prisma/api-services/schema.prisma (User model)
12. docker/{2 Dockerfile}, docker-compose.yml (postgres + 2 apps)
13. .cursorrules, .husky/*, commitlint.config.js, .github/workflows/{ci.yml,release.yml}
14. README.md


# ACCEPTANCE CRITERIA
  pnpm install
  docker compose up -d postgres
  pnpm prisma:migrate
  pnpm start:gateway:dev      # :3000
  pnpm start:services:dev     # :3001