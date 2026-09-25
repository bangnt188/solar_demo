import { EquipmentCard } from "@/components/catalog-cards";
import { equipment } from "@/data/mock/catalog";

export default function EquipmentPage() {
  return (
    <>
      <section className="page-heading"><div className="container"><span className="eyebrow">Lúa Xanh Đồng Bằng</span><h1>Thiết bị</h1><p>Tìm hiểu các thành phần của một hệ thống điện mặt trời.</p><small>Dữ liệu minh họa — chưa phải sản phẩm thực tế.</small></div></section>
      <section className="section container" aria-label="Thiết bị">
        <div className="offer"><div className="offer-grid">{equipment.map((item) => <EquipmentCard item={item} key={item.title} />)}</div></div>
      </section>
    </>
  );
}
