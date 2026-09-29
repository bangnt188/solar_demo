import Image from "next/image";
import Link from "next/link";
import { SiteNavigation, type SiteLink } from "@/components/organisms/site-navigation";
import { basePath } from "@/config/site";

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
