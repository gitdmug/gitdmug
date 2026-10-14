# GITDM deployment notes

## Existing production (recommended path)

The live site already has:

- Neon Postgres project + Managed Auth
- Object Storage buckets
- Vercel project with all environment variables

To update the application:

1. Push this clean foundation to the connected Git repository.
2. Vercel will run `npm run vercel-build`.
3. `prisma db push` only applies schema drift; it does **not** drop tables or data.
4. Sync scripts are idempotent and only ensure catalogue / roles / intake rows exist.

No user-facing change occurs beyond the code you intentionally ship.

---

## New environment (green-field only)

Only follow the steps below when creating a completely new Neon project / domain.

### 1. Neon

Create a Neon project (prefer `us-east-2`). Enable Managed Neon Auth on the main branch.

```bash
npm install
npm run db:setup   # first time only — never on production
```

### 2. Neon Auth

- Set `NEON_AUTH_BASE_URL`
- Generate `NEON_AUTH_COOKIE_SECRET` (`openssl rand -base64 32`)
- Add the production origin to trusted origins:
  ```
  https://globalinstituteoftrading.com
  ```

### 3. Neon Object Storage

Configure the S3-compatible credentials and set:

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_ENDPOINT_URL_S3=
AWS_REGION=us-east-2
NEON_STORAGE_BUCKET=gitdm-files
```

### 4. Remaining secrets

Copy every key listed in `.env.example` into the Vercel project (Production environment).

### 5. First deploy

Connect the Git repository to Vercel, set the build command to `npm run vercel-build` (or leave the package.json script), and deploy.

After the first successful deploy, treat the database as production: never run force-reset commands against it.
