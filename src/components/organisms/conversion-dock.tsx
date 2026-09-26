import Link from "next/link";

function DockIcon({ kind }: { kind: "zalo" | "phone" | "survey" }) {
  if (kind === "phone") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.3.55 3.6.55a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.26.19 2.48.55 3.6a1 1 0 0 1-.25 1z" /></svg>;
  }
  if (kind === "survey") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v15a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2h-3v2h3v14H5V5h3zm2-1h4v4h-4zm-2 9h8v2H8zm0 4h8v2H8z" /></svg>;
  }
  return <span className="dock-zalo-mark" aria-hidden="true">Zalo</span>;
}

function DockAction({ kind, label, href }: { kind: "zalo" | "phone" | "survey"; label: string; href?: string }) {
  const content = <><DockIcon kind={kind} /><span className="dock-tooltip">{label}</span></>;
  if (kind === "survey" && href) return <Link className={`dock-action dock-${kind}`} href={href} aria-label={label}>{content}</Link>;
  if (href) return <a className={`dock-action dock-${kind}`} href={href} aria-label={label}>{content}</a>;
  return <button className={`dock-action dock-${kind} is-unavailable`} type="button" disabled aria-label={`${label} — chưa cấu hình`} title={`${label} chưa được cấu hình`}>{content}</button>;
}

export function ConversionDock({ phoneHref, zaloHref, surveyHref }: { phoneHref?: string; zaloHref?: string; surveyHref: string }) {
  return (
    <nav className="conversion-dock" aria-label="Liên hệ nhanh">
      <DockAction kind="zalo" label="Zalo" href={zaloHref} />
      <DockAction kind="phone" label="Điện thoại" href={phoneHref} />
      <DockAction kind="survey" label="Khảo sát" href={surveyHref} />
    </nav>
  );
}
