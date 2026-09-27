import { MotionRuntime } from "@/components/motion/motion-runtime";
import { AnnouncementBar } from "@/components/organisms/announcement-bar";
import { ConversionDock } from "@/components/organisms/conversion-dock";
import { SiteFooter, SiteHeader } from "@/components/organisms/site-chrome";
import { getLanding } from "@/services/public-content";

export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { announcement, brand, navigation, conversion, footer } = (await getLanding()).chrome;
  return <>
    {announcement.enabled && <AnnouncementBar actionLabel={announcement.actionLabel} actionHref={announcement.actionHref}><strong>{announcement.lead}</strong>{announcement.body}</AnnouncementBar>}
    <SiteHeader brandLabel={brand.label} brandLines={brand.lines} brandHref={brand.href} logoSrc={brand.logo} navLabel={navigation.label} navigation={navigation.items} callToAction={navigation.callToAction} />
    <main>{children}</main>
    <SiteFooter columns={footer.columns} note={footer.note} />
    <ConversionDock surveyHref={conversion.surveyHref} phoneHref={conversion.phoneHref ?? undefined} zaloHref={conversion.zaloHref ?? undefined} />
    <MotionRuntime />
  </>;
}
