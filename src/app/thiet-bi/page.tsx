import { Catalog } from "@/components/catalog";
import { equipment } from "@/data/mock/catalog";

export default function EquipmentPage() {
  return <Catalog title="Thiết bị" intro="Tìm hiểu các thành phần của một hệ thống điện mặt trời." entries={equipment} />;
}
