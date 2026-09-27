import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import { siteName } from "@/lib/seo";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: "Giải pháp điện mặt trời cho gia đình và doanh nghiệp.",
  robots: { index: false, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>
        {children}
      </body>
    </html>
  );
}
