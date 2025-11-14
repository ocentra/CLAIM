# Cloudflare Worker & Pages Deployment

This directory contains the Cloudflare Worker backend for the Ocentra Games platform, handling R2 storage operations, match coordination, and API endpoints.

## 🚀 Automated CI/CD Deployment

**⚠️ IMPORTANT: Manual deployment is NOT required!**

This project uses **automated CI/CD via GitHub Actions**. When you push to the `main` branch, the following happens automatically:

1. **Tests run** - All unit, integration, and E2E tests execute
2. **TypeScript builds** - Frontend and Worker code are compiled
3. **Cloudflare Worker deploys** - Backend API is automatically deployed to production
4. **Cloudflare Pages deploys** - Frontend is automatically deployed to `game.ocentra.ca`

### How It Works

The CI/CD pipeline (`.github/workflows/ci.yml`) automatically:

- **Deploys Worker** (`deploy-cloudflare-worker` job):
  - Runs on every push to `main`
  - Uses `wrangler deploy --env production`
  - Deploys to: `claim-storage` (production) or `claim-storage-dev` (development)

- **Deploys Pages** (`deploy-cloudflare-pages` job):
  - Runs on every push to `main`
  - Builds the frontend with production environment variables
  - Deploys to: `game.ocentra.ca` (custom domain) and `ocentra-games.pages.dev`

### What You Need to Do

**Nothing!** Just push to `main` and the deployment happens automatically.

If you need to manually trigger a deployment (not recommended), see [Manual Deployment](#manual-deployment) below.

---

## 📁 Project Structure

```
infra/cloudflare/
├── src/
│   ├── index.ts              # Main Worker entry point
│   ├── auth.ts               # Firebase authentication
│   ├── monitoring.ts         # Metrics and alerting
│   └── durable-objects/      # Durable Objects (MatchCoordinatorDO)
├── wrangler.toml             # Worker configuration
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## ⚙️ Configuration

### Environment Variables

Configured in `wrangler.toml`:

#### Development (`env.development`)
- **Worker Name:** `claim-storage-dev`
- **R2 Bucket:** `claim-matches-test` (test bucket)
- **CORS Origin:** `*` (allows all origins for local testing)
- **Environment:** `development`

#### Production (`env.production`)
- **Worker Name:** `claim-storage`
- **R2 Bucket:** `claim-matches` (production bucket)
- **CORS Origin:** `https://game.ocentra.ca` (specific origin for security)
- **Environment:** `production`

### R2 Buckets

- **Development:** `claim-matches-test` - Safe to delete, used for testing
- **Production:** `claim-matches` - Contains real match data

### CORS Configuration

CORS is configured to allow requests from:
- **Development:** Any origin (`*`) for local testing
- **Production:** Only `https://game.ocentra.ca` (strict security)

The CORS logic in `src/index.ts`:
- Validates origin in production (rejects mismatched origins)
- Logs security warnings for suspicious requests
- Includes security headers (`X-Content-Type-Options`, `X-Frame-Options`)

---

## 🔧 Local Development

### Prerequisites

1. **Cloudflare Account** - Sign up at https://dash.cloudflare.com
2. **Wrangler CLI** - Install globally: `npm install -g wrangler`
3. **Login** - Run `wrangler login` in this directory

### Setup

```bash
# Navigate to cloudflare directory
cd infra/cloudflare

# Install dependencies
npm install

# Login to Cloudflare (first time only)
npm run login
# or: wrangler login

# Start local development server
npm run dev
```

### Development Commands

```bash
# Start local dev server (with hot reload)
npm run dev

# Deploy to development environment (manual - not needed with CI/CD)
npm run deploy:dev

# Deploy to production (manual - not needed with CI/CD)
npm run deploy

# View Worker logs in real-time
npm run tail
```

### Environment Variables (Local)

Create `.dev.vars` file for local development:

```env
ENVIRONMENT=development
CORS_ORIGIN=*
FIREBASE_PROJECT_ID=your-project-id
```

**Note:** `.dev.vars` is gitignored - never commit secrets!

---

## 🚨 Manual Deployment (Not Recommended)

**You should NOT need to do this** - CI/CD handles it automatically. Only use if:

1. Testing deployment locally
2. Emergency hotfix outside of CI/CD
3. Debugging deployment issues

### Manual Deployment Steps

```bash
# Navigate to cloudflare directory
cd infra/cloudflare

# Deploy to development
npm run deploy:dev

# Deploy to production
npm run deploy
```

**Warning:** Manual deployments bypass CI/CD tests and may cause inconsistencies.

---

## 📊 Monitoring & Logs

### View Logs

```bash
# Real-time logs
npm run tail

# Or use Wrangler directly
wrangler tail
```

### Metrics Endpoint

The Worker exposes metrics at `/api/metrics`:
- Match creation rate
- Request counts
- Error rates
- Storage operations

### Alerts

Configured in `wrangler.toml` (via environment variables):
- `ALERT_WEBHOOK_URL` - Webhook for alerts (Slack, Discord, etc.)
- `ALERT_EMAIL` - Email for critical alerts

---

## 🔐 Security

### CORS Security

- **Production:** Only allows `https://game.ocentra.ca`
- **Development:** Allows all origins (`*`) for local testing
- **Validation:** Request origin is validated against configured origin
- **Logging:** Suspicious origin attempts are logged

### Authentication

- Uses Firebase Authentication for user verification
- Token validation via `FIREBASE_PROJECT_ID`
- See `src/auth.ts` for implementation

### Rate Limiting

- Implemented per-user and per-IP
- Uses Cloudflare KV for rate limit storage
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## 🗄️ Durable Objects

### MatchCoordinatorDO

Coordinates match state across multiple requests:
- Ensures atomic match operations
- Handles concurrent match updates
- Uses SQLite storage (Cloudflare free plan compatible)

**Migration:** Configured in `wrangler.toml` with `new_sqlite_classes = ["MatchCoordinatorDO"]`

---

## 🔗 Related Resources

- **Frontend:** Deployed to Cloudflare Pages at `game.ocentra.ca`
- **Worker API:** `https://claim-storage.ocentraai.workers.dev` (production)
- **R2 Storage:** Match records, disputes, evidence, AI decisions
- **CI/CD:** `.github/workflows/ci.yml`

---

## 📝 Notes

- **Never commit `.dev.vars`** - Contains secrets
- **Always test locally** before pushing to `main`
- **CORS changes** require Worker redeployment (automatic via CI/CD)
- **R2 buckets** are environment-specific (test vs production)

---

## 🆘 Troubleshooting

### Deployment Fails

1. Check GitHub Actions logs: https://github.com/ocentra/ocentra-games/actions
2. Verify secrets are set: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
3. Check `wrangler.toml` syntax

### CORS Errors

1. Verify `CORS_ORIGIN` in `wrangler.toml` matches your frontend domain
2. Check Worker logs: `wrangler tail`
3. Ensure frontend is using correct Worker URL

### R2 Access Issues

1. Verify R2 bucket names in `wrangler.toml`
2. Check bucket bindings are correct
3. Ensure Worker has R2 permissions in Cloudflare dashboard

---

**Remember: Just push to `main` - CI/CD handles the rest! 🚀**

