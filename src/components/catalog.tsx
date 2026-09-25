import Image from "next/image";
import { imagePath } from "@/config/site";

type Entry = { title: string; category: string; description: string; image: string; location?: string };

export function Catalog({ title, intro, entries }: { title: string; intro: string; entries: readonly Entry[] }) {
  return (
    <>
      <section className="page-heading"><div className="container"><span className="eyebrow">Lúa Xanh Đồng Bằng</span><h1>{title}</h1><p>{intro}</p><small>Dữ liệu minh họa — chưa phải dự án hoặc sản phẩm thực tế.</small></div></section>
      <section className="container catalog-grid" aria-label={title}>
        {entries.map((entry) => (
          <article className="catalog-card" key={entry.title}>
            <div className="catalog-image"><Image src={imagePath(entry.image)} alt={`Hình minh họa: ${entry.title}`} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
            <div className="catalog-copy"><span className="eyebrow">{entry.category}</span><h2>{entry.title}</h2><p>{entry.description}</p>{entry.location && <small>Khu vực minh họa: {entry.location}</small>}</div>
          </article>
        ))}
      </section>
    </>
  );
}
