# GitHub and Vercel guide

## 1. Update GitHub

Replace the previous source with the contents of this folder. Remove old files that are absent from this ZIP; simply copying over files will leave old hosting configuration behind. Keep your existing `.git` folder and your private `.env.local`. `package.json` should be at the repository root.

```sh
git add -A
git commit -m "Use standard Next.js project"
git push
```

## 2. Vercel settings

Import the GitHub repository or open the existing Vercel project.

- Framework: Next.js.
- Root Directory: the directory containing package.json (normally ./).
- Node.js: 22.x.
- Build Command: default, or `pnpm build`.
- Install Command: default, or `pnpm install --frozen-lockfile`.
- Output Directory: Next.js default (disable any override).

Remove old `build:vercel`, Vite or custom output overrides. This project needs no vercel.json. For an existing failed deployment, redeploy without build cache once after updating the repository.

## 3. Environment variables

Open Project > Settings > Environment Variables. Add each name and value separately. Choose Production for the live website. Add Preview values separately if you want test deployments to send enquiries; use a test receiver there. Save, then redeploy for changes to apply.

| Variable | Example | Purpose / requirement |
|---|---|---|
| NEXT_PUBLIC_SITE_URL | https://your-project.vercel.app | Public site origin used for canonical URLs, sitemap and metadata. Set to the actual production URL, then change to your custom domain when connected. No trailing path. |
| INQUIRY_WEBHOOK_URL | https://your-backend.example/api/inquiries | Server-only receiver for quotation/contact form JSON. Needed for successful submissions, not for page browsing or builds. This is not an email address and must not point back to this site's own /api/inquiries endpoint. |
| INQUIRY_WEBHOOK_TOKEN | Your receiver's configured secret | Optional bearer token sent to the receiver. Use only if your receiver checks it; both ends must use the same value. Keep private. |

The example URLs are placeholders; no receiver or secret is provided. Vercel does not create the receiver automatically. Until one is configured, the website can run but forms show a delivery error.

## 4. Local environment

Copy `.env.example` to `.env.local` beside package.json. Use:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
INQUIRY_WEBHOOK_URL=
INQUIRY_WEBHOOK_TOKEN=
```

Fill in the last two only when your receiver is ready. Restart `pnpm dev` after editing. `.env.local` is excluded from Git; `.env.example` contains no secrets. Never add NEXT_PUBLIC_ to either webhook variable. There is no need to manually set NODE_ENV.

## 5. Receiver contract

The API sends a POST with Content-Type: application/json and `{reference, ...validatedFormFields}`, including submissionId. If a token is set it adds `Authorization: Bearer <token>`. Your backend must authenticate where configured, save/deliver the enquiry, deduplicate by submissionId and return a 2xx response only on success. Non-2xx responses or the 15-second timeout cause a delivery error in the form. Inspect lib/inquiry-schema.ts for the exact fields.

No email notification, database or previous-host enquiry migration is included. Test one real submission and verify its arrival before accepting customer enquiries.

Official guidance: https://vercel.com/docs/environment-variables/managing-environment-variables
