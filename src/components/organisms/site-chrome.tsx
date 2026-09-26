import Image from "next/image";
import Link from "next/link";
import { basePath } from "@/config/site";

type SiteLink = { label: string; href: string };

type SiteHeaderProps = {
  brandLabel: string;
  brandLines: readonly string[];
  brandHref: string;
  navLabel: string;
  navigation: readonly SiteLink[];
  callToAction: SiteLink;
};

export function SiteHeader({ brandLabel, brandLines, brandHref, navLabel, navigation, callToAction }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href={brandHref} aria-label={brandLabel}>
          <Image src={`${basePath}/images/common/logo.png`} alt="" width={44} height={44} className="brand-mark" loading="eager" />
          <span className="brand-name">{brandLines.map((line) => <span key={line}>{line}</span>)}</span>
        </Link>
        <nav className="desktop-nav" aria-label={navLabel}>
          {navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          <Link className="nav-cta" href={callToAction.href}>{callToAction.label}</Link>
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Mở điều hướng">Menu</summary>
          <nav aria-label={`${navLabel} di động`}>
            {[...navigation, callToAction].map((item) => <Link className={item.href === callToAction.href ? "nav-cta" : undefined} href={item.href} key={item.href}>{item.label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}

type FooterColumn = { title: string; items: readonly { label: string; href?: string }[] };
type SiteFooterProps = { columns: readonly FooterColumn[]; note: string };

export function SiteFooter({ columns, note }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-columns">
        {columns.map((column) => (
          <div key={column.title}>
            <h2>{column.title}</h2>
            {column.items.map((item) => item.href
              ? <p key={item.label}><Link href={item.href}>{item.label}</Link></p>
              : <p key={item.label}>{item.label}</p>)}
          </div>
        ))}
      </div>
      <p className="demo-note container">{note}</p>
    </footer>
  );
}
