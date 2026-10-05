import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/organisms/announcement-bar";
import { ConversionDock } from "@/components/organisms/conversion-dock";
import { SiteFooter, SiteHeader } from "@/components/organisms/site-chrome";
import { getLanding } from "@/services/public-content";
import { siteUrl } from "@/config/site";
import { siteName } from "@/lib/seo";
import "@solar/ui/styles";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: "Giải pháp điện mặt trời cho gia đình và doanh nghiệp.",
  robots: { index: false, follow: true },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { chrome } = await getLanding();
  const { announcement, brand, navigation, conversion, footer } = chrome;

  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body data-ui-root>
        {announcement.enabled && <AnnouncementBar actionLabel={announcement.actionLabel} actionHref={announcement.actionHref}>
          <strong>{announcement.lead}</strong>{announcement.body}
        </AnnouncementBar>}
        <SiteHeader brandLabel={brand.label} brandLines={brand.lines} brandHref={brand.href} logoSrc={brand.logo} navLabel={navigation.label} navigation={navigation.items} callToAction={navigation.callToAction} />
        <main>{children}</main>
        <SiteFooter columns={footer.columns} note={footer.note} logoSrc={brand.logo} />
        <ConversionDock phoneHref={conversion.phoneHref} zaloHref={conversion.zaloHref} surveyHref={conversion.surveyHref} />
      </body>
    </html>
  );
}
