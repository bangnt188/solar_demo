import Link from "next/link";

export function Breadcrumbs({ items }: { items: readonly { label: string; href: string }[] }) {
  return (
    <nav className="container breadcrumbs" aria-label="Đường dẫn trang">
      <ol>
        {items.map((item, index) => (
          <li key={item.href}>
            {index === items.length - 1 ? <span aria-current="page">{item.label}</span> : <Link href={item.href}>{item.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
