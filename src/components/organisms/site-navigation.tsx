"use client";

import { useEffect, useRef, useState } from "react";
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
  const mobileNav = useRef<HTMLDetailsElement>(null);
  const [scrollDismissed, setScrollDismissed] = useState(false);

  useEffect(() => {
    function dismissOnScroll() {
      setScrollDismissed(true);
      const details = mobileNav.current;
      if (!details) return;
      details.open = false;
      details.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((submenu) => { submenu.open = false; });
    }
    window.addEventListener("scroll", dismissOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", dismissOnScroll);
  }, []);

  return (
    <>
      <nav
        className="desktop-nav"
        aria-label={navLabel}
        data-scroll-dismissed={scrollDismissed || undefined}
        onPointerLeave={() => setScrollDismissed(false)}
        onFocusCapture={() => setScrollDismissed(false)}
      >
        {navigation.map((item) => item.children?.length ? (
          <div className="nav-menu" key={item.href}>
            <Link className="nav-trigger" href={item.href}>{item.label}</Link>
            <NavigationSubmenu item={item} />
          </div>
        ) : <Link href={item.href} key={item.href}>{item.label}</Link>)}
        <Link className="nav-cta" href={callToAction.href}>{callToAction.label}</Link>
      </nav>
      <details ref={mobileNav} className="mobile-nav">
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
