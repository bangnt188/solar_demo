"use client";
import Link from "next/link";
import { Button, type ButtonProps } from "@solar/ui";
import type { ReactNode, Ref } from "react";
import { basePath } from "@/config/site";
import { statusLabels } from "./demo-data";
import styles from "./admin.module.css";
export const cn = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).map(name => styles[name as string] || name).join(" ");
const icons: Record<string, string> = { home: 'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z', projects: 'M3 7h7l2 2h9v11H3Z M3 7V4h7l2 3', equipment: 'M4 4h16v12H4Z M8 20h8 M12 16v4 M4 10h16 M10 4v12', media: 'M3 3h18v18H3Z M3 17l5-5 4 4 3-3 6 6 M8 7h.01', leads: 'M4 3h16v18H4Z M8 7h8 M8 11h8 M8 15h5', users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0', arrow: 'M7 17 17 7 M7 7h10v10', search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0', plus: 'M12 5v14 M5 12h14', menu: 'M3 6h18 M3 12h18 M3 18h18', back: 'M15 18l-6-6 6-6', logout: 'M9 3H3v18h6 M14 8l5 4-5 4 M8 12h11', download: 'M12 3v12 M7 10l5 5 5-5 M4 17v4h16v-4', sun: 'M12 3v2 M12 19v2 M3 12h2 M19 12h2 M5.6 5.6 1.4 1.4 M17 17l1.4 1.4 M5.6 18.4 1.4-1.4 M17 7l1.4-1.4 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0', copy: 'M9 9h12v12H9Z M15 9V3H3v12h6', check: 'm5 12 4 4L19 6' };
export function Icon({ name }: {
    name: string;
}) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icons[name] || icons.home}/></svg>; }
export function Action({ children, tone = "secondary", icon, className, ...props }: ButtonProps & {
    tone?: "primary" | "secondary" | "quiet";
    icon?: string;
    ref?: Ref<HTMLButtonElement>;
}) { return <Button {...props} variant={tone} className={[cn("button", tone === "primary" && "primary", tone === "quiet" && "quiet"), className].filter(Boolean).join(" ")}>{icon && <Icon name={icon}/>}{children}</Button>; }
export function ActionLink({ href, children, primary = false, icon }: {
    href: string;
    children: ReactNode;
    primary?: boolean;
    icon?: string;
}) { return <Link href={href} className={cn("button", primary && "primary")}>{icon && <Icon name={icon}/>}{children}</Link>; }
export function StatusBadge({ status }: {
    status: keyof typeof statusLabels;
}) { return <span className={cn("badge", status)}>{statusLabels[status]}</span>; }
export function Brand() { return <div className={cn("brand")}><span className={cn("brandmark")}><img src={`${basePath}/images/common/logo.png`} width="44" height="44" alt="Logo Lúa Xanh Đồng Bằng"/></span><div><strong>Lúa Xanh Đồng Bằng</strong><small>Không gian quản trị</small></div></div>; }
export function PageHeading({ title, description, actions }: {
    title: string;
    description: string;
    actions?: ReactNode;
}) { return <div className={cn("pagehead")}><div><h1 tabIndex={-1}>{title}</h1><p>{description}</p></div><div className={cn("actions")}>{actions}</div></div>; }
export function Panel({ title, description, children, action, className }: {
    title?: string;
    description?: string;
    children: ReactNode;
    action?: ReactNode;
    className?: string;
}) { return <section className={[cn("panel"), className].filter(Boolean).join(" ")}>{title && <div className={cn("panelhead")}><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>}{children}</section>; }
