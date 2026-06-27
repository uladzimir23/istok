import { PageShell } from "@/shared/ui/PageShell";
import { PageHero } from "@/shared/ui/PageHero";
import { LeadForm } from "@/widgets/LeadForm";
import { SITE } from "@/shared/lib/seo";
import styles from "./contacts.module.scss";

export const metadata = {
  title: "Контакты",
  description: "Связаться с фабрикой «Исток-мебель» — телефон, email, адрес производства.",
};

export default function ContactsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Контакты"
        title="Связаться с фабрикой"
        description="Напишите менеджеру или позвоните — ответим в рабочее время."
      />
      <div className={`container ${styles.grid}`}>
        <section>
          <h2>Адрес производства</h2>
          <p>
            {SITE.address.streetAddress}
            <br />
            {SITE.address.addressLocality}, {SITE.address.addressRegion}
            <br />
            {SITE.address.postalCode}, {SITE.address.addressCountry}
          </p>
          <p>
            <strong>Телефон:</strong>{" "}
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </section>

        <section>
          <h2>Заявка</h2>
          <LeadForm source="contacts" />
        </section>
      </div>
    </PageShell>
  );
}
