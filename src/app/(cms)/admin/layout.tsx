import type { Metadata } from "next";
import { AdminDemoLayout } from "@/features/admin/admin-shell";
export const metadata: Metadata = { title: { default: "CMS · Lúa Xanh Đồng Bằng", template: "%s · CMS Lúa Xanh Đồng Bằng" }, description: "Bản mẫu giao diện CMS với dữ liệu minh họa.", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: {
    children: React.ReactNode;
}) { return <AdminDemoLayout>{children}</AdminDemoLayout>; }
