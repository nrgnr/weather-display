# weather-display

Simple weather display app for testing the full pipeline

**Platform:** web (Next.js)
**Layers:** auth, data

## Resources

| Service | Value |
|---------|-------|
| Logto App ID | `nqq8kkoltchl3ioi40b87` |
| Logto Endpoint | `https://auth-dev.nrgnr.app` |
| Directus Collection | `weather_display_items` |
| Directus URL | `https://api-dev.nrgnr.app` |
| Infisical Project | `weather-display` |
| Dev URL | `https://weather-display-dev.nrgnr.app` |
| Coolify UUID | `bkww0k0wkgkk8k0wk4s44kco` |
| MinIO (S3) | `https://s3-dev.nrgnr.app` |
| Redis | `t8okccgswcs804kw4ccgoocw:6379` (internal) |
| Postgres | `eskcko8gsgo8c4s40gc8w08s:5432` (internal) |
| CI | `.gitea/workflows/ci.yml` |
| Promote | `.gitea/workflows/promote.yml` |

## Shared Services

- **Auth**: [auth-dev.nrgnr.app](https://auth-dev.nrgnr.app) (Logto)
- **API**: [api-dev.nrgnr.app](https://api-dev.nrgnr.app) (Directus)
- **Storage**: [s3-dev.nrgnr.app](https://s3-dev.nrgnr.app) / [s3-console-dev.nrgnr.app](https://s3-console-dev.nrgnr.app) (MinIO)
- **Secrets**: [secrets.nrgnr.app](https://secrets.nrgnr.app) (Infisical)
- **Git**: [git.nrgnr.app/NRGNR/weather-display](https://git.nrgnr.app/NRGNR/weather-display)
