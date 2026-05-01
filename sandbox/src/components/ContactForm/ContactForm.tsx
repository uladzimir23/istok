import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./ContactForm.module.scss";

const Schema = z.object({
  name: z.string().min(2, "Имя слишком короткое"),
  phone: z
    .string()
    .min(7, "Введите телефон")
    .regex(/^[+\d\s()-]+$/, "Только цифры и +"),
  message: z.string().max(1000, "Слишком длинно").optional().or(z.literal("")),
});

type FormData = z.infer<typeof Schema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: { name: "", phone: "", message: "" },
  });

  async function onSubmit(data: FormData) {
    // sandbox: симуляция отправки
    await new Promise((r) => setTimeout(r, 600));
    console.log("[ContactForm] submit", data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <section className={styles.root} id="contact-form">
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.intro}>
            <span className={styles.eyebrow}>Свяжитесь с нами</span>
            <h2 className={styles.title}>Расскажите, что нужно — подберём решение.</h2>
            <p className={styles.lead}>
              Заявка приходит менеджеру отдела продаж в Telegram + email. Отвечаем в
              течение часа в рабочее время.
            </p>
            <div className={styles.contacts}>
              <a href="tel:+375445947046">+375 (44) 594-70-46</a>
              <a href="tel:+375295873440">+375 (29) 587-34-40</a>
              <a href="mailto:istok-mebel@mail.ru">istok-mebel@mail.ru</a>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">Ваше имя</label>
              <input
                id="name"
                className={styles.input}
                type="text"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && <span className={styles.error}>{errors.name.message}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="phone">Телефон</label>
              <input
                id="phone"
                className={styles.input}
                type="tel"
                placeholder="+375 (__) ___-__-__"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
              {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="message">Что нужно? (необязательно)</label>
              <textarea
                id="message"
                className={styles.textarea}
                placeholder="Например: 200 театральных кресел для зала на 250 мест, доставка в Брест"
                {...register("message")}
              />
              {errors.message && <span className={styles.error}>{errors.message.message}</span>}
            </div>

            {submitted ? (
              <div className={styles.success}>
                ✓ Заявка отправлена. Менеджер свяжется с вами в ближайший час.
              </div>
            ) : (
              <button type="submit" className={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? "Отправляю…" : "Отправить заявку"}
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
