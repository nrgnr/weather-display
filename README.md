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

### 1. Clone the repo

```bash
git clone https://git.nrgnr.app/NRGNR/weather-display.git
cd weather-display
```

### 2. Scaffold the app

Create a Next.js app in a temp directory and copy files over (the repo already has `.gitea/` and `README.md`):

```bash
cd /tmp && npx create-next-app@latest weather-display-scaffold --ts --tailwind --eslint --app --use-npm --yes
cp -r /tmp/weather-display-scaffold/{package.json,package-lock.json,tsconfig.json,next.config.ts,postcss.config.mjs,app,public,.gitignore,.eslintrc.json} ~/Projects/weather-display/
cd ~/Projects/weather-display
rm -rf /tmp/weather-display-scaffold
```

Update `tsconfig.json` path alias to `"./*"` (not `"./src/*"`):
```json
"paths": { "@/*": ["./*"] }
```

Update `package.json` name to `"weather-display"`.

### 3. Install dependencies

```bash
npm install @logto/next @directus/sdk
```

### 4. Set up environment variables

**Option A: Infisical CLI (recommended)**

```bash
# Install: https://infisical.com/docs/cli/overview
infisical login
infisical init  # select project: weather-display
infisical run -- npm run dev
```

**Option B: Manual `.env.local`**

Create `.env.local` with values from [Infisical](https://secrets.nrgnr.app) (project: `weather-display`):

```env
NEXT_PUBLIC_LOGTO_ENDPOINT=https://auth-dev.nrgnr.app
NEXT_PUBLIC_LOGTO_APP_ID=nqq8kkoltchl3ioi40b87
LOGTO_APP_SECRET=<from-infisical>
LOGTO_COOKIE_SECRET=<run: openssl rand -hex 32>
NEXT_PUBLIC_DIRECTUS_URL=https://api-dev.nrgnr.app
DIRECTUS_TOKEN=<from-infisical>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Set up authentication (Logto)

Create `lib/logto.ts`:

```typescript
export const logtoConfig = {
  endpoint: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT!,
  appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  cookieSecure: process.env.NODE_ENV === "production",
  cookieSecret: process.env.LOGTO_COOKIE_SECRET!,
};
```

Create `app/actions.ts` (server actions for sign in/out):

```typescript
"use server";
import { signIn, signOut, getLogtoContext, handleSignIn } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/logto";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn(logtoConfig, { redirectUri: `${logtoConfig.baseUrl}/callback` });
}

export async function signOutAction() {
  await signOut(logtoConfig, logtoConfig.baseUrl);
}

export async function handleCallbackAction(url: string) {
  await handleSignIn(logtoConfig, new URL(url));
  redirect("/");
}

export async function getUser() {
  return await getLogtoContext(logtoConfig, { fetchUserInfo: true });
}
```

Create `app/callback/page.tsx` (OAuth callback handler):

```tsx
"use client";
import { useEffect } from "react";
import { handleCallbackAction } from "../actions";

export default function Callback() {
  useEffect(() => { handleCallbackAction(window.location.href); }, []);
  return <div className="flex min-h-screen items-center justify-center"><p>Signing in...</p></div>;
}
```

Use in pages (server component):

```tsx
import { getUser } from "./actions";

export default async function Home() {
  const user = await getUser();
  // user.isAuthenticated, user.claims?.name, user.claims?.sub
}
```

### 6. Set up data layer (Directus)

Create `lib/directus.ts`:

```typescript
import { createDirectus, rest, staticToken } from "@directus/sdk";

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
  .with(staticToken(process.env.DIRECTUS_TOKEN!))
  .with(rest());

export default directus;
```

Your Directus collection `weather_display_items` is pre-created with fields:
- `id` (UUID, primary key)
- `user_id` (string — store the Logto user ID from `user.claims.sub`)
- `created_at`, `updated_at` (auto-managed timestamps)

Add custom fields in the [Directus admin](https://api-dev.nrgnr.app/admin/settings/data-model/weather_display_items).

Read/write data:

```typescript
import directus from "@/lib/directus";
import { readItems, createItem } from "@directus/sdk";

// Read all items for a user
const items = await directus.request(
  readItems("weather_display_items", { filter: { user_id: { _eq: userId } } })
);

// Create an item
await directus.request(
  createItem("weather_display_items", { user_id: userId, /* ...your fields */ })
);
```

### 7. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in will redirect to Logto.

## Deployment

### Dev environment

Push to `main` → Coolify auto-deploys to [`https://weather-display-dev.nrgnr.app`](https://weather-display-dev.nrgnr.app):

```bash
git add -A && git commit -m "your changes"
git push origin main
```

### Coolify environment variables

The Coolify app needs the same env vars as `.env.local`, **plus** a production `NEXT_PUBLIC_BASE_URL`.
Set them via the [Coolify dashboard](http://100.119.210.5:8000) or API:

```bash
# Example: set an env var via Coolify API
curl -X POST http://100.119.210.5:8000/api/v1/applications/bkww0k0wkgkk8k0wk4s44kco/envs \
  -H "Authorization: Bearer <COOLIFY_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"key":"NEXT_PUBLIC_BASE_URL","value":"https://weather-display-dev.nrgnr.app","is_preview":false}'
```

Required Coolify env vars:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_LOGTO_ENDPOINT` | `https://auth-dev.nrgnr.app` |
| `NEXT_PUBLIC_LOGTO_APP_ID` | `nqq8kkoltchl3ioi40b87` |
| `LOGTO_APP_SECRET` | From Infisical |
| `LOGTO_COOKIE_SECRET` | `openssl rand -hex 32` |
| `NEXT_PUBLIC_DIRECTUS_URL` | `https://api-dev.nrgnr.app` |
| `DIRECTUS_TOKEN` | From Infisical |
| `NEXT_PUBLIC_BASE_URL` | `https://weather-display-dev.nrgnr.app` |

> **Note:** After setting env vars, redeploy for changes to take effect.

## CI/CD

| Workflow | Trigger | What it does |
|----------|---------|-------------|
| `ci.yml` | Every push | Lint, test, build |
| `promote.yml` | `promote/staging/*` tag | Security gate: Gitleaks + Trivy + npm audit + lint + test + build |

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
4. App deploys to [`https://weather-display-staging.nrgnr.app`](https://weather-display-staging.nrgnr.app)

## Architecture

| Layer | Service | Dev URL |
|-------|---------|---------|
| Auth | Logto (OIDC, passkeys) | [`auth-dev.nrgnr.app`](https://auth-dev.nrgnr.app) |
| Data | Directus (REST/GraphQL) | [`api-dev.nrgnr.app`](https://api-dev.nrgnr.app) |
| Storage | MinIO (S3-compatible) | [`s3-dev.nrgnr.app`](https://s3-dev.nrgnr.app) |
| Secrets | Infisical | [`secrets.nrgnr.app`](https://secrets.nrgnr.app) |
| Cache | Redis | Internal only |
| Database | PostgreSQL | Internal only |
