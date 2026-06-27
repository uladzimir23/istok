import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Prose.module.scss";

interface Props {
  children: ReactNode;
  // "base" — компактнее (юридические тексты), "lg" — основной (по умолчанию).
  size?: "base" | "lg";
}

// Полоса чтения для контентных страниц. Оборачивает текст в .container (полевой
// отступ страницы) + ограничивает ширину строки до ~65ch для читаемости.
export function Prose({ children, size = "lg" }: Props) {
  return (
    <div className="container">
      <article className={clsx(styles.prose, size === "base" && styles.sizeBase)}>
        {children}
      </article>
    </div>
  );
}
