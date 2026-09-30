"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { company, Lang, tr, href } from "@/lib/company";
export function Brand({ lang }: { lang: Lang }) {
  return (
    <Link href={href(lang)} className="brand" aria-label={company.name}>
      <span className="brand-symbol" aria-hidden="true">
        <img src="/images/company-logo.png" alt="" width="1254" height="1254" />
      </span>
      <span className="brand-name">
        {tr(lang, "FAIZAN AL RABEE", "فيضان الربيع")}
        <small>{tr(lang, "TRADING & DISTRIBUTION", "التجارة والتوزيع")}</small>
      </span>
    </Link>
  );
}
export function Header({ lang }: { lang: Lang }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const nav = [
    ["", "Home", "الرئيسية"],
    ["/about", "About", "من نحن"],
    ["/products", "Products", "المنتجات"],
    ["/industries", "Industries", "القطاعات"],
    ["/coverage", "Coverage", "التغطية"],
    ["/brands", "Brands", "العلامات"],
    ["/quality", "Quality", "الجودة"],
    ["/contact", "Contact", "تواصل معنا"],
  ];
  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span>
            {tr(lang, "YOUR BUSINESS. OUR COMMITMENT.", "أعمالكم. التزامنا.")}
          </span>
          <span>
            {tr(
              lang,
              "Food, FMCG & general supply across Saudi Arabia",
              "الأغذية والسلع الاستهلاكية والتوريد العام في السعودية",
            )}
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap header-row">
          <Brand lang={lang} />
          <nav
            aria-label={tr(lang, "Main navigation", "القائمة الرئيسية")}
            className="desktop-nav"
          >
            {nav.map(([url, en, ar]) => (
              <Link
                className={!url && path === href(lang) ? "active" : ""}
                href={href(lang)}
                key={url}
              >
                {tr(lang, en, ar)}
              </Link>
            ))}
          </nav>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="mobile-menu"
                aria-label={tr(lang, "Open menu", "فتح القائمة")}
                style={{ border: 0, background: "none", padding: 7 }}
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side={lang === "ar" ? "left" : "right"}>
              <SheetTitle className="p-6">
                {tr(lang, "Explore Faizan Al Rabee", "استكشف فيضان الربيع")}
              </SheetTitle>
              <div className="sheet-links">
                {nav.map(([url, en, ar]) => (
                  <SheetClose asChild key={url}>
                    <Link href={href(lang)}>{tr(lang, en, ar)}</Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Link
            className="language"
            href={lang === "en" ? "/ar" : "/en"}
            aria-label={
              lang === "en" ? "Switch to Arabic" : "Switch to English"
            }
          >
            {lang === "en" ? "العربية" : "EN"}
          </Link>
        </div>
      </header>
    </>
  );
}
