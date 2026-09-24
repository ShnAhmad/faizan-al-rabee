import type { Metadata } from 'next';
import './globals.css';
import {company} from '@/lib/company';
export const metadata:Metadata={metadataBase:new URL(company.origin),title:{default:'Faizan Al Rabee | Trading & Distribution',template:'%s | Faizan Al Rabee'},description:company.description,icons:{icon:'/images/company-logo.png'},openGraph:{type:'website',siteName:'Faizan Al Rabee Company',title:'Faizan Al Rabee — Your supply partner in Saudi Arabia',description:company.description}};
export default async function RootLayout({children,params}:{children:React.ReactNode;params:Promise<{lang?:string}>}){const {lang}=await params;return <html lang={lang==='ar'?'ar':'en'} dir={lang==='ar'?'rtl':'ltr'}><body>{children}</body></html>}
