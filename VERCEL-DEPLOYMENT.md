# Vercel deployment

1. Push this folder's contents to your GitHub repository (package.json at the repository root).
2. Import the repository in Vercel. Framework: Next.js. Node.js: 22.x.
3. Clear old dashboard build/output overrides. vercel.json sets pnpm build:vercel and .next.
4. Set NEXT_PUBLIC_SITE_URL to your final HTTPS domain.
5. Deploy. For an existing failed deployment, redeploy without the build cache.

## Quotation delivery
Set INQUIRY_WEBHOOK_URL to an endpoint that saves the submitted JSON, and optionally INQUIRY_WEBHOOK_TOKEN. The receiver must return 2xx only after saving and deduplicate by submissionId. Without this configuration, forms report delivery failure; they do not falsely claim success. The previous platform database is not migrated by deploying this folder.

## Local check
Use Node.js 22.13+ and the pnpm version in package.json.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

Company contact details still require approval before public launch. Do not commit .env.local or tokens.
