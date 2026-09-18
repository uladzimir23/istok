interface Props {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Container({ children, size = "2xl" }: Props) {
  const className = size === "2xl" ? "container" : `container-${size}`;
  return <div className={className}>{children}</div>;
}
