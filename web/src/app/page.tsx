import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.intro}>
        <h1>Исток-мебель</h1>
        <p>
          Phase 1 starter. Здесь будет витрина: театральные кресла, корпусная
          мебель, детские кроватки ELIS-MEBEL. Stack — Next.js 16 + SCSS modules
          + content-as-code (см. <code>docs/40 - Architecture/42 - ADR/</code>).
        </p>
      </main>
    </div>
  );
}
