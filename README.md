# weather-display

Simple weather display app for testing the full pipeline

**Platform:** web (Next.js)
**Layers:** auth, data

## Resources

| Service | Value |
|---------|-------|
| Dev URL | [`https://weather-display-dev.nrgnr.app`](https://weather-display-dev.nrgnr.app) |
| Coolify UUID | `bkww0k0wkgkk8k0wk4s44kco` |
| Logto App ID | `nqq8kkoltchl3ioi40b87` |
| Logto Endpoint | [`https://auth-dev.nrgnr.app`](https://auth-dev.nrgnr.app) |
| Directus Collection | `weather_display_items` |
| Directus URL | [`https://api-dev.nrgnr.app`](https://api-dev.nrgnr.app) |
| MinIO (S3) | [`https://s3-dev.nrgnr.app`](https://s3-dev.nrgnr.app) |
| MinIO Console | [`https://s3-console-dev.nrgnr.app`](https://s3-console-dev.nrgnr.app) |
| Redis | `t8okccgswcs804kw4ccgoocw:6379` (internal) |
| Postgres | `eskcko8gsgo8c4s40gc8w08s:5432` (internal) |
| Infisical Project | `weather-display` |
| Git | [`NRGNR/weather-display`](https://git.nrgnr.app/NRGNR/weather-display) |

## Getting Started

### 1. Clone and install

```bash
git clone git@git.nrgnr.app:NRGNR/weather-display.git
cd weather-display
npm install
```

### 2. Set up environment variables

Pull secrets from Infisical or copy from the project in [secrets.nrgnr.app](https://secrets.nrgnr.app):

```bash
# Install Infisical CLI: https://infisical.com/docs/cli/overview
infisical login
infisical init  # select project: weather-display
infisical run -- npm run dev
```

Or create `.env.local` manually with these keys (values in Infisical):

```env
NEXT_PUBLIC_LOGTO_ENDPOINT=https://auth-dev.nrgnr.app
NEXT_PUBLIC_LOGTO_APP_ID=nqq8kkoltchl3ioi40b87
LOGTO_APP_SECRET=<from-infisical>
NEXT_PUBLIC_DIRECTUS_URL=https://api-dev.nrgnr.app
DIRECTUS_TOKEN=<from-infisical>
```

### 3. Run locally

```bash
npm run dev
```

## Deployment

**Dev**: Push to `main` triggers auto-deploy to `https://weather-display-dev.nrgnr.app` via Coolify.

```bash
git push origin main
```

## CI/CD

- **CI** (`.gitea/workflows/ci.yml`): Runs on every push — lint, test, build
- **Promote** (`.gitea/workflows/promote.yml`): Security gate for staging promotion

## Promoting to Staging

When the app is ready for staging:

```bash
curl -X POST https://automate.nrgnr.app/webhook/promote \
  -H "Content-Type: application/json" \
  -d '{"app_name":"weather-display","target":"staging","platform":"web","layers":["auth","data"]}'
```

This triggers:
1. Creates a `promote/staging/*` tag
2. CI runs security gate (Gitleaks, Trivy, npm audit, lint, test, build)
3. On pass: staging resources are provisioned (Logto, Directus, Coolify, etc.)
4. App deploys to `https://weather-display-staging.nrgnr.app`

## Architecture

| Layer | Service | Dev URL |
|-------|---------|---------|
| Auth | Logto (OIDC, passkeys) | `auth-dev.nrgnr.app` |
| Data | Directus (REST/GraphQL) | `api-dev.nrgnr.app` |
| Storage | MinIO (S3-compatible) | `s3-dev.nrgnr.app` |
| Secrets | Infisical | `secrets.nrgnr.app` |
| Cache | Redis | Internal only |
| Database | PostgreSQL | Internal only |
