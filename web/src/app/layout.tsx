import type { Metadata } from "next";
import { manrope } from "./fonts";
import { JsonLd } from "@/shared/ui/JsonLd";
import { organizationJsonLd } from "@/shared/lib/seo";
import "./globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://istokmebel.by"),
  title: {
    default: "Исток-мебель — корпоративная мебель и театральные кресла",
    template: "%s — Исток-мебель",
  },
  description:
    "Мебельная фабрика «Исток-мебель» (Минск/Березино). Театральные кресла, корпусная мебель, кроватки ELIS. B2B / госзаказ / розница.",
  openGraph: {
    type: "website",
    locale: "ru_BY",
    siteName: "Исток-мебель",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} light-theme istok-theme`}>
      <body>
        <a className="skip-link" href="#main-content">
          Перейти к контенту
        </a>
        <JsonLd data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
