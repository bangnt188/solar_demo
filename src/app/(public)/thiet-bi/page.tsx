import { EquipmentCard } from "@/features/catalog/catalog-cards";
import Link from "next/link";
import { getEquipmentPage } from "@/services/public-content";
import { catalogInput, type SearchParameters } from "@/services/catalog-input";
import { deploymentTarget } from "@/config/deployment";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageBreadcrumbs, pageMetadata, pageStructuredData } from "@/lib/seo";

export const metadata = pageMetadata("/thiet-bi/");

export default async function EquipmentPage({ searchParams }: { searchParams: SearchParameters }) {
  const input = await catalogInput(searchParams);
  const page = await getEquipmentPage(input);
  return (
    <>
      <JsonLd data={pageStructuredData("/thiet-bi/")} />
      <Breadcrumbs items={pageBreadcrumbs("/thiet-bi/")} />
      <section className="page-heading"><div className="container" data-motion="left"><span className="eyebrow">Lúa Xanh Đồng Bằng</span><h1>Thiết bị</h1><p>Tìm hiểu các thành phần của một hệ thống điện mặt trời.</p>{deploymentTarget() === "demo" && <small>Dữ liệu minh họa — chưa phải sản phẩm thực tế.</small>}</div></section>
      <section className="section container" aria-label="Thiết bị">
        <div className="offer"><div className="offer-grid">{page.items.map((item) => <EquipmentCard item={item} key={item.id ?? item.title} />)}</div></div>
        {page.nextCursor && <Link href={`/thiet-bi/?limit=${input.limit}&cursor=${encodeURIComponent(page.nextCursor)}`} className="button">Xem tiếp thiết bị</Link>}
      </section>
    </>
  );
}
