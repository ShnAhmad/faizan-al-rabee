export const company = {
  name: "Faizan Al Rabee Company",
  shortName: "Faizan Al Rabee",
  ar: "شركة فيضان الربيع",
  description:
    "Food, FMCG and general supply for businesses across Saudi Arabia.",
  origin:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://faizan-al-rabee-trading.shanahmad-dev.chatgpt.site",
  email: "operations.faizanalrabee@gmail.com",
  phone: "+966543307805",
  displayPhone: "+966 54 330 7805",
  city: "Riyadh",
  address: "Building 03, Office 05, Kuwaiti Askan, Riyadh",
  contactSource:
    "Company profile. Confirm with management before public launch.",
  regions: ["Riyadh", "Jeddah", "Khobar", "Buraydah"],
};
export type Lang = "en" | "ar";
export const tr = (lang: Lang, en: string, ar: string) =>
  lang === "ar" ? ar : en;
export const href = (lang: Lang, path = "") => `/${lang}${path}`;
