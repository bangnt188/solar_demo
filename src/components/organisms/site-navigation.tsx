import Link from "next/link";

import type { SiteLink } from "@/types/landing";

type SiteNavigationProps = {
  navLabel: string;
  navigation: readonly SiteLink[];
  callToAction: SiteLink;
};

function NavigationSubmenu({ item }: { item: SiteLink }) {
  return (
    <div className="nav-submenu">
      <Link className="nav-overview" href={item.href}>{item.overviewLabel}</Link>
      {item.children?.map((child) => <Link href={child.href} key={child.href}>{child.label}</Link>)}
    </div>
  );
}

export function SiteNavigation({ navLabel, navigation, callToAction }: SiteNavigationProps) {
  return (
    <>
      <nav className="desktop-nav" aria-label={navLabel}>
        {navigation.map((item) => item.children?.length ? (
          <div className="nav-menu" key={item.href}>
            <Link className="nav-trigger" href={item.href}>{item.label}</Link>
            <NavigationSubmenu item={item} />
          </div>
        ) : <Link href={item.href} key={item.href}>{item.label}</Link>)}
        <Link className="nav-cta" href={callToAction.href}>{callToAction.label}</Link>
      </nav>
      <details className="mobile-nav">
        <summary aria-label="Mở điều hướng">Menu</summary>
        <nav aria-label={`${navLabel} di động`}>
          {[...navigation, callToAction].map((item) => item.children?.length ? (
            <details className="nav-menu" key={item.href}>
              <summary>{item.label}</summary>
              <NavigationSubmenu item={item} />
            </details>
          ) : <Link className={item.href === callToAction.href ? "nav-cta" : undefined} href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
      </details>
    </>
  );
}
