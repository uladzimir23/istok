"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeadInput } from "@/entities/lead";
import styles from "./LeadForm.module.scss";

interface Props {
  productSlug?: string;
  source?: string;
}

type Status = "idle" | "submitting" | "ok" | "error";

export function LeadForm({ productSlug, source = "contacts" }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(LeadInput),
    defaultValues: { name: "", phone: "", email: "", message: "", productSlug, source, honey: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setStatus("submitting");
    const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;
    const pbUrl = process.env.NEXT_PUBLIC_PB_URL;
    try {
      // PocketBase-инбокс (ADR-011 #10): заявка попадает в админку фабрики.
      if (pbUrl && !data.honey) {
        const { honey, ...lead } = data;
        void honey;
        await fetch(`${pbUrl}/api/collections/leads/records`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...lead, status: "new" }),
        }).catch(() => {});
      }
      if (!endpoint) {
        // Phase 1 placeholder: no external endpoint configured yet.
        // Log payload so dev/show-mode сможет показать, что данные собраны.
        console.info("[lead placeholder]", data);
        await new Promise((r) => setTimeout(r, 600));
      } else {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("submit failed");
      }
      setStatus("ok");
      reset({ name: "", phone: "", email: "", message: "", productSlug, source, honey: "" });
    } catch {
      setStatus("error");
    }
  });

  if (status === "ok") {
    return (
      <div className={styles.success}>
        <p className={styles.successTitle}>Спасибо, заявка отправлена.</p>
        <p>Менеджер свяжется с вами в течение рабочего дня.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <label className={styles.field}>
        <span>Имя*</span>
        <input
          type="text"
          autoComplete="name"
          {...register("name")}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <em className={styles.err}>{errors.name.message}</em>}
      </label>

      <label className={styles.field}>
        <span>Телефон*</span>
        <input
          type="tel"
          autoComplete="tel"
          placeholder="+375 ..."
          {...register("phone")}
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone && <em className={styles.err}>{errors.phone.message}</em>}
      </label>

      <label className={styles.field}>
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          {...register("email")}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <em className={styles.err}>{errors.email.message}</em>}
      </label>

      <label className={styles.field}>
        <span>Сообщение</span>
        <textarea rows={4} {...register("message")} />
      </label>

      <input type="text" tabIndex={-1} aria-hidden="true" className={styles.honey} {...register("honey")} />

      <button type="submit" className={styles.submit} disabled={status === "submitting"}>
        {status === "submitting" ? "Отправляем…" : "Отправить заявку"}
      </button>

      {status === "error" && (
        <p className={styles.err}>
          Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.
        </p>
      )}
    </form>
  );
}

export { LeadForm as default };
