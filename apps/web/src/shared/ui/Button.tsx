import Link from "next/link";
import styles from "./Button.module.scss";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

type AsLink = CommonProps & { href: string; type?: never };
type AsButton = CommonProps & {
  href?: never;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", children } = props;
  const className = `${styles.button} ${styles[variant]} ${styles[size]}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={className}>
        {children}
      </Link>
    );
  }
  const { type = "button", onClick, disabled } = props as AsButton;
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
