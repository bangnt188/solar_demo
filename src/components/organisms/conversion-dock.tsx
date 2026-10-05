"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ConversionDockProps = { phoneHref: string | null; zaloHref: string | null; surveyHref: string };

export function ConversionDock({ phoneHref, zaloHref, surveyHref }: ConversionDockProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(window.matchMedia("(min-width: 601px)").matches);
  }, []);

  return (
    <nav className="conversion-dock" data-open={open ? "true" : "false"} aria-label="Liên hệ nhanh">
      {open ? (
        <div className="dock-panel" id="conversion-dock-actions">
          <div className="dock-actions">
            {zaloHref && <a className="dock-action dock-zalo" href={zaloHref} target="_blank" rel="noopener noreferrer" aria-label="Liên hệ qua Zalo">
              <span className="dock-zalo-mark" aria-hidden="true">Zalo</span>
              <span className="dock-tooltip">Zalo</span>
            </a>}
            {phoneHref && <a className="dock-action dock-phone" href={phoneHref} aria-label="Gọi điện tư vấn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.3.55 3.6.55a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.26.19 2.48.55 3.6a1 1 0 0 1-.25 1z" /></svg>
              <span className="dock-tooltip">Gọi điện</span>
            </a>}
            <Link className="dock-action dock-survey" href={surveyHref} aria-label="Đặt lịch khảo sát">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v15a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2h-3v2h3v14H5V5h3zm2-1h4v4h-4zm-2 9h8v2H8zm0 4h8v2H8z" /></svg>
              <span className="dock-tooltip">Khảo sát</span>
            </Link>
          </div>
          <button
            className="dock-close"
            type="button"
            aria-label="Thu gọn liên hệ nhanh"
            title="Thu gọn"
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ) : (
        <button
          className="dock-toggle"
          type="button"
          aria-expanded="false"
          aria-label="Mở liên hệ nhanh"
          title="Mở liên hệ"
          onClick={() => setOpen(true)}
        >
          <span aria-hidden="true">+</span>
        </button>
      )}
    </nav>
  );
}
