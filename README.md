# bm-starterkit-be

NestJS monorepo starterkit — 2 apps, 3 shared libs:

- `apps/api-gateway` (`:3000`) — BFF: auth, RBAC, context injection, proxy, swagger
- `apps/api-services` (`:3001`) — internal service: business logic, master data, Prisma ORM
- `libs/common` — filters, interceptors, logger, constants, shared DTOs
- `libs/auth` — internal JWT service, `@CurrentUser`, `AuthContext`
- `libs/database` — abstract `BaseRepository` only (no Prisma imports)

## Setup

```bash
pnpm install
cp .env.example .env   # then fill in the values
```

## Run

```bash
pnpm start:gateway:dev      # api-gateway  → http://localhost:3000 (watch)
pnpm start:services:dev     # api-services → http://localhost:3001 (watch)
```

## Build

```bash
pnpm build                  # both apps → dist/
pnpm start:gateway          # run compiled gateway
pnpm start:services         # run compiled services
```

## Notes

- Package manager: **pnpm** (see `packageManager` in `package.json`).
- TypeScript strict mode; path aliases `@common/*`, `@auth/*`, `@database/*`.
- `api-services` tidak boleh diekspos publik; hanya menerima traffic dari gateway.

## Changelog

To generate `CHANGELOG.md`:

```bash
pnpm run changelog
```
