import productData from '@/data/products.json';
import categoryData from '@/data/categories.json';
export const products=productData;
export const categories=categoryData;
export type Product=(typeof products)[number];
export type Category=(typeof categories)[number];
export const getCategory=(id:string)=>categories.find(c=>c.id===id);
export const brands=[...new Set(products.map(p=>p.brand).filter(Boolean))].sort();
