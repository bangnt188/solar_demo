import Image from "next/image";
import Link from "next/link";
import { SiteNavigation } from "@/components/organisms/site-navigation";
import { basePath } from "@/config/site";
import type { SiteLink } from "@/types/landing";

type SiteHeaderProps = {
  brandLabel: string;
  brandLines: readonly string[];
  brandHref: string;
  logoSrc?: string;
  navLabel: string;
  navigation: readonly SiteLink[];
  callToAction: SiteLink;
};

export function SiteHeader({ brandLabel, brandLines, brandHref, logoSrc, navLabel, navigation, callToAction }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href={brandHref} aria-label={brandLabel}>
          <Image src={logoSrc ?? `${basePath}/images/common/logo.png`} alt="" width={44} height={44} className="brand-mark" loading="eager" />
          <span className="brand-name">{brandLines.map((line) => <span key={line}>{line}</span>)}</span>
        </Link>
        <SiteNavigation navLabel={navLabel} navigation={navigation} callToAction={callToAction} />
      </div>
    </header>
  );
}

type FooterColumn = { title: string; items: readonly { label: string; href?: string }[] };
type SiteFooterProps = { columns: readonly FooterColumn[]; note: string };

export function SiteFooter({ columns, note }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-columns">
          {columns.map((column) => (
            <div key={column.title} className="footer-column">
              <h2>{column.title}</h2>
              {column.items.map((item) => (
                <p key={item.label}>
                  {item.href ? (
                    item.href.startsWith("tel:") || item.href.startsWith("mailto:") ? (
                      <a href={item.href} className="footer-contact-link">{item.label}</a>
                    ) : (
                      <Link href={item.href}>{item.label}</Link>
                    )
                  ) : (
                    <span>{item.label}</span>
                  )}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-brand-mark" aria-hidden="true">
          <Image src={`${basePath}/images/common/logo.png`} alt="" width={140} height={140} className="footer-watermark" />
        </div>
      </div>
      <div className="container footer-bottom">
        <p className="demo-note">{note}</p>
      </div>
    </footer>
  );
}
