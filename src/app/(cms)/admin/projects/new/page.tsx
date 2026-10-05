import { Suspense } from "react";
import { CatalogEditQuery } from "@/features/admin/admin-screens";
export default function Page() { return <Suspense fallback={<p>Đang mở form mẫu…</p>}><CatalogEditQuery kind="projects"/></Suspense>; }
