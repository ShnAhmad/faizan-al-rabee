export const company = {
 name: 'Faizan Al Rabee Company', shortName: 'Faizan Al Rabee', ar: 'شركة فيضان الربيع',
 description: 'Food, FMCG and general supply for businesses across Saudi Arabia.',
 origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
 email: 'company@example.com', phone: '+966000000000', displayPhone: '+966 00 000 0000',
 city: 'Riyadh', address: 'Building 03, Office 05, Kuwaiti Askan, Riyadh',
 contactSource: 'Company profile. Confirm with management before public launch.',
 regions: ['Riyadh','Jeddah','Khobar','Buraydah'],
};
export type Lang='en'|'ar';
export const tr=(lang:Lang,en:string,ar:string)=>lang==='ar'?ar:en;
export const href=(lang:Lang,path='')=>`/${lang}${path}`;
