# ARCHITECTURE
WEB Core (Auth/Login + Menu Permissions)
   │  HTTP + Bearer token
   ▼
[api-gateway]
   1. CoreBearerGuard      → pastikan Authorization Bearer ada
   2. MenuPermissionGuard  → RBAC menu dari Core `/auth/menupermissions`
        - @MenuKey('ghg-activity-inventories')
        - @RequirePermission('show-list-data' | 'show-detail-data' | ...)
   3. ContextInjectionInterceptor
        - validate token via Core `/auth/profile`
        - signs x-internal-token (RS256, 30s)
        - injects x-api-key, x-user-data, x-request-id
   4. ProxyController      → forward ke api-services
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
- Auth, Security & RBAC; permission guard, @casl/ability, nestjs/jwt & @nestjs/passport + 
-# passport-jw, rate limiting,  @nestjs/throttler
- helmet & cors: Wajib terpasang di api-gateway untuk proteksi HTTP Header dasar.
- Validation; class-validator & class-transformer
- Database & ORM; prisma/client & prisma 
- Package Manager; pnpm 
- API Documentation; swagger
-# Unit Testing / E2E; jest
-# @nestjs/terminus: liveness/readiness health checks
- conventional-changelog: changelog berbasis Conventional Commits
-# husky: Git quality hooks
-# sentry
- joi 
-# nestjs-pino, pino-http
-# Docker
-# CI/CD


# INTERGRATION (Core → Gateway → Services)

Client **tidak** memanggil `api-services` langsung. Semua request lewat **api-gateway**. Core adalah sumber autentikasi; gateway menerjemahkan token Core menjadi konteks internal yang dipercaya services.

```
Client                api-gateway (:3000)              Core API                 api-services (:3001)
  |                         |                            |                            |
  |-- POST /auth/login ---->|-- login + app_code ------->|                            |
  |<---- accessToken -------|<------- token ------------|                            |
  |                         |                            |                            |
  |-- GET /activities ----->|                            |                            |
  |   Authorization:        |-- GET /auth/profile ------>|                            |
  |   Bearer <Core token>   |   Bearer <Core token>      |                            |
  |                         |<------ profile ------------|                            |
  |                         |                            |                            |
  |                         | map profile → AuthContext  |                            |
  |                         | sign x-internal-token (RS256, 30s)                      |
  |                         | inject headers:                                         |
  |                         |   x-api-key                                             |
  |                         |   x-user-data (base64)                                  |
  |                         |   x-internal-token                                      |
  |                         |   x-request-id                                          |
  |                         |-- proxy /activities ----------------------------------->|
  |                         |                            |   ApiKeyGuard              |
  |                         |                            |   InternalAuthGuard        |
  |<---- JSON response -----|<---------------------------|----------------------------|
```

## FLOW API

1. **Login Core** — `POST /auth/login` di gateway. Gateway menambah `app_code` dari env, memanggil Core, mengembalikan `accessToken`.
2. **Request ke resource** — Client kirim `Authorization: Bearer <accessToken>` ke gateway (contoh `GET /activities`).
3. **Validasi ke Core** — Gateway **tidak** memverifikasi signature JWT sendiri. Token diteruskan ke Core `GET /auth/profile`. Jika Core 401 → request ditolak.
4. **Bangun AuthContext** — Profile Core di-map ke `{ userId, appCode, roles, employee, raw }`.
5. **Inject trust headers** — Gateway sign JWT internal RS256 (`iss=api-gateway`, `aud=api-services`, TTL 30s) lalu set:
   - `x-api-key` — shared secret gateway ↔ services
   - `x-user-data` — AuthContext (base64 JSON, non-authoritative)
   - `x-internal-token` — JWT internal (authoritative)
   - `x-request-id` — UUID untuk tracing
6. **Proxy** — Gateway forward ke `SERVICES_BASE_URL` (contoh `http://localhost:3001/activities`).
7. **Services guard** — Urutan wajib: `ApiKeyGuard` → `InternalAuthGuard`. Hanya request yang lewat gateway yang diterima.

## Header contract

| Header | Arah | Isi |
|--------|------|-----|
| `Authorization: Bearer <jwt>` | Client → Gateway | Token dari Core |
| `x-api-key` | Gateway → Services | `GATEWAY_API_KEY` |
| `x-user-data` | Gateway → Services | Base64(AuthContext) |
| `x-internal-token` | Gateway → Services | JWT RS256 30s |
| `x-request-id` | Gateway → Services | UUID v4 |

### Contoh cepat (Swagger / curl)

```bash
# 1. Login → ambil accessToken
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<email>","password":"<password>"}'

# 2. Pakai token Core ke endpoint gateway (proxy ke services)
curl -s http://localhost:3000/activities \
  -H "Authorization: Bearer <accessToken>"
```

Di Swagger: Authorize → paste **hanya** `accessToken` (tanpa kata `Bearer`). Token harus diterbitkan oleh Core yang sama dengan `CORE_BASE_URL`.

## RBAC — Menu Permission (Gateway)

RBAC di gateway **tidak** menyimpan permission lokal. Sumber kebenaran = Core endpoint `GET /auth/menupermissions`. Gateway hanya mengecek apakah user punya permission yang diminta untuk `menu_key` tertentu sebelum proxy ke services.

### Alur

```
Client → Gateway route (@MenuKey + @RequirePermission)
       → CoreBearerGuard (Bearer wajib)
       → MenuPermissionGuard
            → GET {CORE_BASE_URL}/auth/menupermissions
            → cari menu_key → cek permission
            → 403 jika tidak ada
       → ContextInjectionInterceptor → Proxy → api-services
```

### Response Core (envelope)

```json
{
  "status": true,
  "message": "Retrieved successfully",
  "data": {
    "records": [
      {
        "menu_key": "ghg-activity-inventories",
        "permissions": [
          "show-list-data",
          "show-detail-data",
          "create-data",
          "update-data"
        ]
      }
    ],
    "meta": { "page": 1, "limit": -1, "total": 3, "pageTotal": 1 }
  }
}
```

Gateway menormalisasi `data.records[]` menjadi `{ menu_key, permissions[] }`.

### Decorator di proxy controller

| Decorator | Contoh | Fungsi |
|-----------|--------|--------|
| `@MenuKey(...)` | `@MenuKey('ghg-activity-inventories')` | Menu yang dicek di Core |
| `@RequirePermission(...)` | `@RequirePermission('show-detail-data')` | Permission wajib per endpoint |

### Mapping Activity (contoh)

| Endpoint gateway | Permission |
|------------------|------------|
| `GET /activities` | `show-list-data` |
| `GET /activities/:id` | `show-detail-data` |
| `POST /activities` | `create-data` |
| `PATCH /activities/:id` | `update-data` |
| `DELETE /activities/:id` | `update-data` |

Tanpa `show-detail-data` → `GET /activities/:id` ditolak **403**.

### File terkait

- `apps/api-gateway/src/modules/auth/menu-permissions.service.ts`
- `apps/api-gateway/src/modules/auth/guards/menu-permission.guard.ts`
- `apps/api-gateway/src/modules/auth/decorators/{menu-key,require-permission}.decorator.ts`
- `apps/api-gateway/src/modules/proxy/api-services/master-data/activity/activity.controller.ts`

# NEXT
- RBAC dataaccess
- envolope response ( services )