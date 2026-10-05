"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Select } from "@solar/ui";
import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { basePath } from "@/config/site";
import { adminNavigation, initialEditors, initialEquipment, initialLeads, initialMedia, initialProjects, type DemoCatalog, type DemoEditor, type DemoLead, type DemoMedia, type DemoRole } from "./demo-data";
import { Action, ActionLink, Brand, Icon, cn } from "./admin-ui";
type DemoState = {
    role: DemoRole;
    setRole: Dispatch<SetStateAction<DemoRole>>;
    leads: DemoLead[];
    setLeads: Dispatch<SetStateAction<DemoLead[]>>;
    projects: DemoCatalog[];
    setProjects: Dispatch<SetStateAction<DemoCatalog[]>>;
    equipment: DemoCatalog[];
    setEquipment: Dispatch<SetStateAction<DemoCatalog[]>>;
    media: DemoMedia[];
    setMedia: Dispatch<SetStateAction<DemoMedia[]>>;
    editors: DemoEditor[];
    setEditors: Dispatch<SetStateAction<DemoEditor[]>>;
    notify: (text: string) => void;
    trackObjectUrl: (url: string) => void;
};
const DemoContext = createContext<DemoState | null>(null);
export function useAdminDemo() { const value = useContext(DemoContext); if (!value)
    throw new Error("Admin demo provider missing"); return value; }
export function AdminDemoLayout({ children }: {
    children: ReactNode;
}) {
    const [role, setRole] = useState<DemoRole>("ADMIN");
    const [leads, setLeads] = useState(() => initialLeads.map(x => ({ ...x })));
    const [projects, setProjects] = useState(() => initialProjects.map(x => ({ ...x })));
    const [equipment, setEquipment] = useState(() => initialEquipment.map(x => ({ ...x })));
    const [media, setMedia] = useState(() => initialMedia.map(x => ({ ...x })));
    const [editors, setEditors] = useState(() => initialEditors.map(x => ({ ...x })));
    const [notice, setNotice] = useState("");
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const objectUrls = useRef<string[]>([]);
    function notify(text: string) { if (timer.current)
        clearTimeout(timer.current); setNotice(text); timer.current = setTimeout(() => setNotice(""), 4000); }
    useEffect(() => () => { if (timer.current)
        clearTimeout(timer.current); objectUrls.current.forEach(url => URL.revokeObjectURL(url)); }, []);
    const value: DemoState = { role, setRole, leads, setLeads, projects, setProjects, equipment, setEquipment, media, setMedia, editors, setEditors, notify, trackObjectUrl: url => objectUrls.current.push(url) };
    return <DemoContext.Provider value={value}><div className={cn("root")}><AdminChrome>{children}</AdminChrome><div className={cn("notice")} role="status" aria-live="polite">{notice}</div></div></DemoContext.Provider>;
}
function AdminChrome({ children }: {
    children: ReactNode;
}) {
    const rawPath = usePathname();
    const path = rawPath.startsWith(basePath + "/") ? rawPath.slice(basePath.length) : rawPath;
    const router = useRouter();
    const { role, setRole, leads } = useAdminDemo();
    const [menu, setMenu] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const previousPath = useRef<string | null>(null);
    const auth = /^\/admin\/(login|forgot-password|reset-password)\/?$/.test(path);
    const active = adminNavigation.find(item => item.path !== "/admin/" && path.startsWith(item.path)) || adminNavigation[0];
    const allowed = role === "ADMIN" || !active.adminOnly;
    useEffect(() => { setMenu(false); if (previousPath.current !== null && previousPath.current !== rawPath) document.querySelector<HTMLElement>("#admin-main h1")?.focus({ preventScroll: true }); previousPath.current = rawPath; }, [rawPath]);
    useEffect(() => { if (menu)
        closeRef.current?.focus(); }, [menu]);
    useEffect(() => { function key(event: KeyboardEvent) { if (menu && event.key === "Escape") {
        setMenu(false);
        toggleRef.current?.focus();
    } } document.addEventListener("keydown", key); return () => document.removeEventListener("keydown", key); }, [menu]);
    if (auth)
        return children;
    return <div className={cn("shell", menu && "navopen")}><a className={cn("skip")} href="#admin-main">Đến nội dung chính</a><aside id="admin-navigation" className={cn("sidebar")} aria-label="Điều hướng CMS"><Action className={cn("mobiletoggle")} ref={closeRef} onClick={() => { setMenu(false); toggleRef.current?.focus(); }}>Đóng menu</Action><Brand />{role === "EDITOR" && <p className={cn("scope")}>Phạm vi: dự án dân dụng và thiết bị được giao</p>}<nav className={cn("nav")}>{adminNavigation.filter(item => role === "ADMIN" || !item.adminOnly).map(item => <Link key={item.path} href={item.path} className={cn(active.path === item.path && "active")} aria-current={active.path === item.path ? "page" : undefined}><Icon name={item.icon}/>{item.label}{item.icon === "leads" && <span className={cn("count")}>{leads.filter(x => x.status === "new").length}</span>}</Link>)}</nav><div className={cn("sidebarfoot")}><Link href="/" target="_blank"><Icon name="arrow"/>Xem website</Link><Link href="/admin/login/"><Icon name="logout"/>Xem màn hình đăng nhập</Link><small>CMS · Bản mẫu giao diện</small></div></aside><div className={cn("workspace")}><header className={cn("topbar")}><Action className={cn("mobiletoggle")} ref={toggleRef} icon="menu" aria-expanded={menu} aria-controls="admin-navigation" onClick={() => setMenu(!menu)}>Menu</Action><div className={cn("location")}>Không gian quản trị <span>/</span> <b>{active.label}</b></div><div className={cn("profile")}><label className={cn("muted")} htmlFor="admin-role">Xem vai trò</label><Select id="admin-role" className={cn("role")} value={role} onChange={event => { setRole(event.target.value === "EDITOR" ? "EDITOR" : "ADMIN"); router.push("/admin/"); }}><option>ADMIN</option><option>EDITOR</option></Select><span className={cn("avatar")}>{role === "ADMIN" ? "AD" : "ED"}</span></div></header><div className={cn("demo")}><b>Demo giao diện</b><span>· Dữ liệu mẫu; thay đổi chỉ giữ trong phiên này.</span></div><main id="admin-main" className={cn("content")}>{allowed ? children : <section className={cn("empty")}><h1 tabIndex={-1}>Ngoài phạm vi Editor</h1><p>Vai trò xem trước này chỉ quản lý nội dung được giao. Đây là demo UI, chưa có authorization backend.</p><ActionLink href="/admin/">Về tổng quan</ActionLink></section>}</main></div></div>;
}
