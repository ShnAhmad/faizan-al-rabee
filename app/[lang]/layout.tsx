import {notFound} from 'next/navigation';
import {Header} from '@/components/site/header';
import {Footer} from '@/components/site/shared';
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}){const {lang}=await params;if(lang!=='en'&&lang!=='ar')notFound();return <div dir={lang==='ar'?'rtl':'ltr'} lang={lang}><a className="skip" href="#main">{lang==='ar'?'انتقل إلى المحتوى':'Skip to content'}</a><Header lang={lang}/><main id="main">{children}</main><Footer lang={lang}/></div>}
