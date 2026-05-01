import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.scss";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Исток-мебель — мебельная фабрика, Минск",
    template: "%s — Исток-мебель",
  },
  description:
    "Мебельная фабрика «Исток-мебель»: театральные кресла, корпусная мебель, детские кроватки ELIS-MEBEL. Производство в Березино.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
