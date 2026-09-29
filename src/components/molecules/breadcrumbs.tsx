import { Breadcrumbs as UiBreadcrumbs } from "@solar/ui";
import { basePath } from "@/config/site";

export function Breadcrumbs({ items }: { items: readonly { label: string; href: string }[] }) {
  return (
    <UiBreadcrumbs
      className="container breadcrumbs"
      label="Đường dẫn trang"
      items={items.map((item, index) => ({
        ...item,
        href: `${basePath}${item.href}`,
        current: index === items.length - 1,
      }))}
    />
  );
}
