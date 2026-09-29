import Link from "next/link";
import { EquipmentCard } from "@/features/catalog/catalog-cards";
import type { Equipment } from "@/types/catalog";

type Content = { heading: string; viewAllLabel: string; viewAllHref: string };

export function EquipmentOfferSection({ content, equipment }: { content: Content; equipment: readonly Equipment[] }) {
  return (
    <section className="section container equipment-section" id="san-pham">
      <div className="offer" data-motion="fade">
        <h2 className="section-title text-center">{content.heading}</h2>
        <div className="offer-grid">
          {equipment.map((item) => <EquipmentCard item={item} key={item.title} />)}
        </div>
        <div className="offer-footer">
          <Link href={content.viewAllHref} className="offer-view-all-link">{content.viewAllLabel}</Link>
        </div>
      </div>
    </section>
  );
}
