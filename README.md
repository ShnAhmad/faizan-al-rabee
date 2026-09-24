# Faizan Al Rabee

Standard Next.js App Router project with React, TypeScript and Tailwind CSS. Includes English/Arabic pages, product catalogue, supplied company logo and enquiry forms.

## Run locally

Use Node.js 22.13+ and pnpm (version declared in package.json).

```sh
corepack enable
pnpm install --frozen-lockfile
```

Copy `.env.example` to `.env.local` using your file manager, then:

```sh
pnpm dev
```

Open http://localhost:3000. For a production check:

```sh
pnpm build
pnpm start
```

## Deploy

See VERCEL-DEPLOYMENT.md for GitHub, Vercel and environment setup. No custom hosting runtime, platform authentication or platform database is required.

## Content

- `lib/company.ts`: company name, contact information, URL and translation helpers.
- `components/site/`: bilingual page content and interface.
- `data/products.json`: catalogue; `data/categories.json`: category information.
- `data/raw/`: original spreadsheets; `scripts/import-products.py`: catalogue importer (requires Python and openpyxl).
- `public/images/company-logo.png`: supplied original logo.

Confirm company contact details, Arabic copy, product classifications and legal content before public launch. Generated editorial images are illustrative, not verified company facilities.

## Enquiries

`app/api/inquiries/route.ts` validates form submissions. `lib/inquiry-store.ts` forwards them to your configured receiver. This project does not include a database or email provider. The receiver must save or deliver the request before returning success. Missing configuration returns an error to the form instead of a false success message.
