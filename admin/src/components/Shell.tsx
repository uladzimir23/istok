import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { pb } from "../lib/pb";
import styles from "./Shell.module.scss";

export function Shell({
  children,
  onLogout,
}: {
  children: ReactNode;
  onLogout: () => void;
}) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          ИСТОК<span className={styles.dot}>·</span>админка
        </Link>
        <div className={styles.right}>
          <span className={styles.user}>{pb.authStore.record?.email}</span>
          <button type="button" className={styles.logout} onClick={onLogout}>
            Выйти
          </button>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
