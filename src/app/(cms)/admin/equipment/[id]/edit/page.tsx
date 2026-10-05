import { Suspense } from "react";
import { CatalogEditQuery } from "@/features/admin/admin-screens";
import { initialEquipment } from "@/features/admin/demo-data";
export function generateStaticParams() { return initialEquipment.map(x => ({ id: String(x.id) })); }
export const dynamicParams = false;
export default async function Page({ params }: {
    params: Promise<{
        id: string;
    }>;
}) { const { id } = await params; return <Suspense fallback={<p>Đang mở form mẫu…</p>}><CatalogEditQuery kind="equipment" id={id}/></Suspense>; }
