# GITDM Platform

**Global Institute of Trading and Derivatives Markets** — production web platform.

This repository is the clean, deployable foundation of the live institutional platform.  
It is designed to run against the **existing production database and users** with no data loss and no visible change for students, staff or the public.

## Stack

- Next.js 16 / React 19
- Vercel (application hosting)
- Neon Postgres (institutional data)
- Neon Managed Auth (identity & sessions)
- Neon Object Storage (private uploads & digital materials)
- Pesapal (payments)
- Prisma (data model)

## Core journeys

Visitor → account → application → admission → enrolment → learning → assessment → results → graduation → alumni.

Public website and authenticated campus share the same GITDM visual language. Authentication is a single institutional identity.

## Local development

```bash
cp .env.example .env.local
# fill DATABASE_URL and other keys
npm install
npm run db:generate
npm run dev
```

Do **not** run `db:reset` or `db:setup` against production or any shared database that already contains real users.

## Production deploy (existing database)

1. Connect the repository to the existing Vercel project.
2. Ensure all environment variables from `.env.example` are set in Vercel (Production).
3. Deploy. The build command (`vercel-build`) runs:
   - `prisma generate`
   - `prisma db push` (schema sync only — never drops data)
   - catalogue / organisation / intake sync scripts (idempotent)
   - `next build`

Users, applications, enrolments, payments and certificates remain untouched.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Generate Prisma client + Next.js production build |
| `npm run vercel-build` | Full production build used by Vercel |
| `npm run db:push` | Push schema changes (safe on existing data) |
| `npm run db:sync-*` | Idempotent catalogue / role / timetable sync |

## Important

- Never force-reset the production database.
- Media assets live under `public/media`.
- Private digital books (if present) are referenced via `outputFileTracingIncludes` in `next.config.ts`.
- All patch / implementation notes from earlier development cycles have been removed so this tree is a clean foundation for future work.

See `DEPLOY.md` for Neon / Auth / Object Storage details when provisioning a **new** environment. For the live site, the current Neon project and Vercel env vars are already in place.
