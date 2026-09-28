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

The example URL is a placeholder; set it to the site's actual public origin.

## 4. Local environment

Copy `.env.example` to `.env.local` beside package.json. Use:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Restart `pnpm dev` after editing. `.env.local` is excluded from Git; `.env.example` contains no secrets. There is no need to manually set NODE_ENV.

Official guidance: https://vercel.com/docs/environment-variables/managing-environment-variables
