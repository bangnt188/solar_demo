import Link from "next/link";
import { EquipmentCard } from "@/components/ui/catalog-cards";
import type { Equipment } from "@/types/catalog";

type Content = { heading: string; viewAllLabel: string; viewAllHref: string };

export function EquipmentOfferSection({ content, equipment }: { content: Content; equipment: readonly Equipment[] }) {
  return (
    <section className="section container">
      <div className="offer" data-motion="fade"><h2>{content.heading}</h2><div className="offer-grid">
        {equipment.map((item) => <EquipmentCard item={item} key={item.title} />)}
      </div><Link href={content.viewAllHref}>{content.viewAllLabel}</Link></div>
    </section>
  );
}
