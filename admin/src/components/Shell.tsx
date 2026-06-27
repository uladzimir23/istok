import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { pb } from "../lib/pb";
import { PublishButton } from "./PublishButton";
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
        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => clsx(styles.navLink, isActive && styles.navActive)}
          >
            Товары
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => clsx(styles.navLink, isActive && styles.navActive)}
          >
            Проекты
          </NavLink>
        </nav>
        <div className={styles.right}>
          <PublishButton />
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
