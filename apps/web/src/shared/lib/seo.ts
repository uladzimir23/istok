export const SITE = {
  url: process.env.SITE_URL || "https://istokmebel.by",
  name: "Исток-мебель",
  legal: "ОДО «Исток-Мебель»",
  phone: "+375 29 587-34-40",
  phoneAlt: "+375 44 594-70-46",
  email: "istok-mebel@mail.ru",
  telegram: "https://t.me/fomz1",
  viber: "viber://add?number=80293037755",
  address: {
    // Производственная площадка фабрики.
    streetAddress: "ул. Зелёная, д. 31",
    addressLocality: "Березино",
    addressRegion: "Минская область",
    postalCode: "222160",
    addressCountry: "BY",
  },
} as const;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    legalName: SITE.legal,
    url: SITE.url,
    telephone: [SITE.phone, SITE.phoneAlt],
    email: SITE.email,
    sameAs: [SITE.telegram],
    address: {
      "@type": "PostalAddress",
      ...SITE.address,
    },
  };
}
