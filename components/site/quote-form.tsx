"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Lang, tr, href } from "@/lib/company";
import { products } from "@/lib/catalog";
import { inquirySchema, Inquiry } from "@/lib/inquiry-schema";
export function QuoteForm({ lang }: { lang: Lang }) {
  const query = useSearchParams();
  const selected = products.find((p) => p.id === query.get("product"));
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const form = useForm<Inquiry>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      company: "",
      name: "",
      email: "",
      phone: "",
      city: "",
      message: "",
      website: "",
      submissionId: "",
      items: [
        {
          name: selected
            ? [selected.name, selected.brand, selected.packSize]
                .filter(Boolean)
                .join(" · ")
            : "",
          quantity: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  async function submit(data: Inquiry) {
    setError("");
    try {
      const r = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = (await r.json()) as {
        error?: string;
        reference: string;
      };
      if (!r.ok) throw new Error(response.error || "Request failed");
      setResult(response.reference);
    } catch {
      setError(
        tr(
          lang,
          "Your request could not be recorded. Your details are still here. Please try again or contact us by email.",
          "تعذر تسجيل طلبك. لا تزال بياناتك محفوظة هنا. حاول مرة أخرى أو تواصل معنا عبر البريد الإلكتروني.",
        ),
      );
    }
  }
  if (result)
    return (
      <div className="form-msg" role="status">
        <CheckCircle2 size={40} style={{ marginBottom: 20 }} />
        <h2 style={{ fontSize: 30 }}>
          {tr(lang, "Your request has been recorded.", "تم تسجيل طلبك.")}
        </h2>
        <p style={{ marginTop: 20 }}>
          {tr(
            lang,
            "Please keep your reference for any follow-up:",
            "يرجى الاحتفاظ برقم المرجع للمتابعة:",
          )}{" "}
          <strong dir="ltr">{result}</strong>
        </p>
        <p style={{ marginTop: 15 }}>
          {tr(
            lang,
            "Product availability and commercial terms are confirmed separately. This is not an order confirmation.",
            "يتم تأكيد توفر المنتجات والشروط التجارية بشكل منفصل. هذا ليس تأكيداً للشراء.",
          )}
        </p>
        <Link
          className="btn"
          style={{ marginTop: 25 }}
          href={href(lang, "/products")}
        >
          {tr(lang, "Back to the catalogue", "العودة إلى الكتالوج")}
        </Link>
      </div>
    );
  const labels: {
    key: "company" | "name" | "email" | "phone" | "city";
    en: string;
    ar: string;
    type?: string;
    auto: string;
  }[] = [
    {
      key: "company",
      en: "Company name",
      ar: "اسم الشركة",
      auto: "organization",
    },
    { key: "name", en: "Contact person", ar: "اسم المسؤول", auto: "name" },
    {
      key: "email",
      en: "Business email",
      ar: "البريد الإلكتروني",
      type: "email",
      auto: "email",
    },
    {
      key: "phone",
      en: "Phone number",
      ar: "رقم الهاتف",
      type: "tel",
      auto: "tel",
    },
    {
      key: "city",
      en: "Delivery city",
      ar: "مدينة التسليم",
      auto: "address-level2",
    },
  ];
  return (
    <form
      noValidate
      onSubmit={(e) => {
        if (!form.getValues("submissionId"))
          form.setValue("submissionId", crypto.randomUUID());
        void form.handleSubmit(submit)(e);
      }}
    >
      <div className="form-grid">
        {labels.map((f) => (
          <label className="field" key={f.key}>
            {tr(lang, f.en, f.ar)}{" "}
            <span className="required" style={{ display: "contents" }}>
              *
            </span>
            <input
              type={f.type || "text"}
              autoComplete={f.auto}
              {...form.register(f.key)}
              aria-invalid={!!form.formState.errors[f.key]}
              aria-describedby={
                form.formState.errors[f.key] ? f.key + "-error" : undefined
              }
            />
            {form.formState.errors[f.key] && (
              <span id={f.key + "-error"} className="form-error">
                {tr(
                  lang,
                  f.type === "email"
                    ? "Enter a valid email address."
                    : "Please complete this field.",
                  f.type === "email"
                    ? "أدخل بريداً إلكترونياً صالحاً."
                    : "يرجى إكمال هذا الحقل.",
                )}
              </span>
            )}
          </label>
        ))}
        <div className="field full">
          <span>
            {tr(lang, "Products & quantities", "المنتجات والكميات")} *
          </span>
          {fields.map((field, i) => (
            <div key={field.id}>
              <div className="rfq-row">
                <input
                  aria-label={tr(lang, `Product ${i + 1}`, `المنتج ${i + 1}`)}
                  placeholder={tr(
                    lang,
                    "Product name / brand / pack size",
                    "اسم المنتج / العلامة / حجم العبوة",
                  )}
                  {...form.register(`items.${i}.name`)}
                />
                <input
                  aria-label={tr(lang, `Quantity ${i + 1}`, `الكمية ${i + 1}`)}
                  placeholder={tr(lang, "Qty / unit", "الكمية / الوحدة")}
                  {...form.register(`items.${i}.quantity`)}
                />
                <button
                  type="button"
                  disabled={fields.length === 1}
                  onClick={() => remove(i)}
                  aria-label={tr(lang, "Remove product", "حذف المنتج")}
                >
                  <Trash2 size={17} />
                </button>
              </div>
              {form.formState.errors.items?.[i] && (
                <span className="form-error">
                  {tr(
                    lang,
                    "Enter the product and required quantity (including unit).",
                    "أدخل المنتج والكمية المطلوبة مع الوحدة.",
                  )}
                </span>
              )}
            </div>
          ))}
          {fields.length < 30 && (
            <button
              type="button"
              className="small-btn"
              onClick={() => append({ name: "", quantity: "" })}
              style={{
                alignSelf: "start",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Plus size={15} />
              {tr(lang, "Add another product", "أضف منتجاً آخر")}
            </button>
          )}
        </div>
        <label className="field full">
          {tr(
            lang,
            "Additional requirements (optional)",
            "متطلبات إضافية (اختياري)",
          )}
          <textarea
            placeholder={tr(
              lang,
              "Preferred brands, acceptable alternatives, specifications or delivery requirements…",
              "العلامات المفضلة أو البدائل المقبولة أو المواصفات أو متطلبات التسليم…",
            )}
            {...form.register("message")}
          />
        </label>
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px" }}
        >
          <input
            tabIndex={-1}
            autoComplete="off"
            {...form.register("website")}
          />
        </div>
      </div>
      <p style={{ fontSize: 13, marginTop: 22 }}>
        {tr(
          lang,
          "We use these details to review your business enquiry.",
          "نستخدم هذه التفاصيل لمراجعة استفسارك التجاري.",
        )}{" "}
        <Link className="textlink" href={href(lang, "/privacy")}>
          {tr(lang, "Privacy notice", "إشعار الخصوصية")}
        </Link>
      </p>
      {error && (
        <p role="alert" className="form-error" style={{ marginTop: 20 }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        className="btn"
        disabled={form.formState.isSubmitting}
        style={{ marginTop: 25 }}
      >
        {form.formState.isSubmitting
          ? tr(lang, "Submitting…", "جارٍ الإرسال…")
          : tr(lang, "Send quotation request", "أرسل طلب عرض السعر")}{" "}
        <span>↗</span>
      </button>
    </form>
  );
}
