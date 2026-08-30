# Library app

A monorepo containing a [NestJS](https://nestjs.com/) API and a [Next.js](https://nextjs.org/) web app for managing a library catalogue, book borrowing/loans, and inventory.

## What's inside?

### Apps and Packages

- `apps/api`: a [NestJS](https://nestjs.com/) REST API (PostgreSQL + TypeORM) handling auth, books, authors, publishers, tags, inventory, and borrows
- `apps/web`: a [Next.js](https://nextjs.org/) app for browsing the catalogue, cart, and borrowing books
- `@repo/ui`: a shared React component library used by `web`
- `@repo/eslint-config`: `eslint` configurations (includes `@next/eslint-plugin-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/), and the repo is managed with [Turborepo](https://turborepo.dev/) and [pnpm](https://pnpm.io/) workspaces.

## Getting started

### Prerequisites

- Node.js >= 24
- pnpm
- A running PostgreSQL instance

### 1. Setup environment variables

Copy the example env files for each app:

```sh
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

`apps/api/.env` configures the database connection, JWT auth, and borrow/loan business rules (e.g. `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES_IN`).

`apps/web/.env` configures `NEXT_PUBLIC_API_BASE_URL`, the URL the web app uses to reach the API (defaults to `http://localhost:3000`).

### 2. Install dependencies

```sh
pnpm install
```

### 3. Setup the database

Run pending migrations, then seed the database:

```sh
cd apps/api
pnpm run migration:run
pnpm run seed
```

Seeding creates authors, publishers, tags, books, inventory, and sample users. All seeded users share the default password **`password123`**, including the admin account `admin@library.com`.

### 4. Run in development

From the repo root, this starts both the API (`http://localhost:3000`) and the web app (`http://localhost:3001`):

```sh
pnpm dev
```

You can also run a single app using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```sh
pnpm exec turbo dev --filter=api
pnpm exec turbo dev --filter=web
```

### 5. Build

To build all apps and packages:

```sh
pnpm build
```

Or build a specific package:

```sh
pnpm exec turbo build --filter=api
pnpm exec turbo build --filter=web
```

## Database Migrations & Seeding

These commands are run from the `apps/api` directory.

### Migrations

Run pending migrations:

```sh
cd apps/api
pnpm run migration:run
```

Generate a new migration from entity changes:

```sh
pnpm run migration:generate src/database/migrations/MigrationName
```

Create an empty migration file:

```sh
pnpm run migration:create src/database/migrations/MigrationName
```

Revert the last applied migration:

```sh
pnpm run migration:revert
```

Show migration status:

```sh
pnpm run migration:show
```

### Seeding

Seed the database with authors, publishers, tags, books, and related data:

```sh
cd apps/api
pnpm run seed
```

## Useful Links

- [Turborepo docs](https://turborepo.dev/docs)
- [NestJS docs](https://docs.nestjs.com/)
- [Next.js docs](https://nextjs.org/docs)
