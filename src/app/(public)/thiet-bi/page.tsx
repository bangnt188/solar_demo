import { EquipmentCard } from "@/components/ui/catalog-cards";
import { getEquipment } from "@/services/catalog";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageBreadcrumbs, pageMetadata, pageStructuredData } from "@/lib/seo";

export const metadata = pageMetadata("/thiet-bi/");

export default function EquipmentPage() {
  return (
    <>
      <JsonLd data={pageStructuredData("/thiet-bi/")} />
      <Breadcrumbs items={pageBreadcrumbs("/thiet-bi/")} />
      <section className="page-heading"><div className="container" data-motion="left"><span className="eyebrow">Lúa Xanh Đồng Bằng</span><h1>Thiết bị</h1><p>Tìm hiểu các thành phần của một hệ thống điện mặt trời.</p><small>Dữ liệu minh họa — chưa phải sản phẩm thực tế.</small></div></section>
      <section className="section container" aria-label="Thiết bị">
        <div className="offer"><div className="offer-grid">{getEquipment().map((item) => <EquipmentCard item={item} key={item.title} />)}</div></div>
      </section>
    </>
  );
}
