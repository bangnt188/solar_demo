import Link from "next/link";
import type { ReactNode } from "react";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "plain";
  className?: string;
};

export function ActionLink({ href, children, variant = "plain", className = "" }: ActionLinkProps) {
  const variantClass = variant === "primary" ? "button" : variant === "outline" ? "button button-outline" : "";
  return <Link className={[variantClass, className].filter(Boolean).join(" ")} href={href}>{children}</Link>;
}
