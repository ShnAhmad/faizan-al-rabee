# Vercel readiness checks

- pnpm install --frozen-lockfile: passed.
- pnpm build (standard Next.js): passed, including TypeScript.
- .next/routes-manifest.json: generated.
- Production HTTP checks: /en, /ar and /images/company-logo.png all returned 200.
- Supplied original transparent logo used in header, footer and favicon metadata.
- Browser visual QA could not run because browser binary download failed in this environment.
- Live enquiry delivery requires configured webhook and an end-to-end submission test.
- No Vercel deployment was performed.
