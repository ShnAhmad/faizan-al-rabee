# Faizan Al Rabee Company

Bilingual English/Arabic corporate website for a Saudi trading, FMCG and general-supply business. Includes 1,165 catalogue records, 15 categories, brand and range filters, product enquiries, multi-line quotation requests and Saudi coverage information. No online payments or prices.

## Technology
Next.js App Router, React, TypeScript, Tailwind CSS, Motion, Radix/Shadcn, React Hook Form and Zod. The managed Sites deployment uses Vinext's Next-compatible Cloudflare runtime and D1; a separate standard Next.js build is available for Vercel.

## Setup and commands
Use Node 22.13+ and the package manager version in package.json.

```sh
pnpm install
pnpm dev                  # Standard Next.js development
pnpm build                # Standard Next.js production build
pnpm dev:vercel           # Standard Next.js development
pnpm build:vercel         # Standard Next.js production build
```

## Vercel
Import the repository, select Next.js, override Build Command to `pnpm build:vercel`, and use the default Next.js output. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin. Configure the inquiry webhook variables below before accepting quotation requests. Sites authentication and D1 are specific to the managed deployment and are not used by the standard Next.js API adapter.

## Enquiry handling
The managed site stores submissions in the `inquiries` D1 table. SQL migrations are in `drizzle/`. Requests use prepared statements and submission IDs to prevent repeated inserts on retries. Records are not exposed through a public read endpoint. An administrator with database access can retrieve them; automated email notifications and an administrative inbox are not included.

For Vercel, `lib/inquiry-store.ts` POSTs to `INQUIRY_WEBHOOK_URL`, optionally using `INQUIRY_WEBHOOK_TOKEN` as a bearer token. Your endpoint must persist the submitted JSON and return a 2xx status only on success; use `submissionId` for idempotency. The form reports failure and retains entered details when the receiver is unavailable or unconfigured. The Sites build aliases this adapter to `lib/inquiry-store.sites.ts`.

Copy `.env.example` to `.env.local` for local Next.js configuration. Keep secrets out of Git. Use hosting settings for deployed environment variables.

## Content and translations
- `lib/company.ts`: company name, contact details, location and origin.
- `components/site/pages.tsx`: bilingual page content.
- `components/site/header.tsx` and `shared.tsx`: navigation, cards and footer.
- `lib/company.ts` exports `tr(lang, english, arabic)`; edit both strings together. New routes belong in the catch-all route at `app/[lang]/[[...path]]/page.tsx` and sitemap.
- Product names preserve supplier/source spelling in either language; category and interface labels are translated. `dir="auto"` keeps mixed product codes readable.

## Catalogue data
`data/products.json` contains id, slug, name, brand, packSize, usageUnit, category, type, image, featured, searchableKeywords and original row references. Missing product details are deliberately left blank. `data/categories.json` defines translated categories and image selections.

The original workbooks are in `data/raw/`; `scripts/import-products.py` reproduces the import using Python and openpyxl. Review its keyword category mapping and `data/import-report.json` after reimporting. Categories and brand extraction are assisted normalization and should be reviewed against supplier records before commercial launch. Exact normalized name/pack duplicates are consolidated with source provenance retained.

To add a product, use an existing category ID, a unique `far-` ID and unique slug, preserve factual source details, and update category counts. Keep stable existing IDs to preserve product links. Put images in `public/products/` and refer to them with `/products/filename`. Do not imply availability based on a catalogue entry.

## Images and geography
Product photos were extracted from the supplied food workbook. Three generated editorial images illustrate trading activities; they are not verified company facilities. Replace files in `public/images/` with approved company photography as available. The Saudi outline uses public-domain Natural Earth country geometry. Keep image alt text, dimensions and licensing accurate.

## Before commercial launch
Confirm the historical profile's phone, email and office address in `lib/company.ts`. Approve Arabic copy, product classification, brand and pack details, privacy terms and retention procedures. Client references are explicitly historical; no current contract, certification or authorized distributorship is asserted. The supplied company logo is used in the header and footer. Assign staff access to stored enquiries or connect an approved notification workflow. Review abuse protection for public traffic before expanding access.

## Validation
TypeScript validation completed. Further build/browser results are recorded in `QA.md`. SEO includes localized canonical/hreflang tags, organization structured data, sitemap, robots and favicon.
