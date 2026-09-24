import type {MetadataRoute} from 'next';
import {company} from '@/lib/company';
import {categories,products} from '@/lib/catalog';
export default function sitemap():MetadataRoute.Sitemap{const paths=['','/about','/products','/industries','/coverage','/brands','/clients','/procurement','/quality','/contact','/request-quote',...categories.map(c=>'/products/'+c.id),...products.map(p=>`/products/${p.category}/${p.slug}`)];return ['en','ar'].flatMap(lang=>paths.map(path=>({url:company.origin+'/'+lang+path,changeFrequency:'monthly' as const,priority:path===''?1:path.split('/').length>3?.5:.8})))}
