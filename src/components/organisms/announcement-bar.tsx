"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

type AnnouncementBarProps = {
  children: ReactNode;
  actionLabel: string;
  actionHref: string;
};

export function AnnouncementBar({ children, actionLabel, actionHref }: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <aside className="announcement" aria-label="Thông báo">
      <div className="container announcement-inner">
        <p>{children}</p>
        <Link href={actionHref}>{actionLabel} <span aria-hidden="true">→</span></Link>
        <button type="button" onClick={() => setVisible(false)} aria-label="Đóng thông báo">×</button>
      </div>
    </aside>
  );
}
