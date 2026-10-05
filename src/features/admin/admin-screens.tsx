"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Select, Textarea } from "@solar/ui";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { imagePath } from "@/config/site";
import { useAdminDemo } from "./admin-shell";
import { Action, ActionLink, Brand, Icon, PageHeading, Panel, StatusBadge, cn } from "./admin-ui";
import { initialEquipment, initialProjects, statusLabels, type CatalogKind, type ContentStatus, type DemoCatalog, type DemoLead, type DemoMedia, type LeadStatus } from "./demo-data";
type Period = "day" | "week" | "month";
function inPeriod(lead: DemoLead, period: Period) { return period === "day" ? lead.date === "2026-10-05" : period === "week" ? lead.date >= "2026-09-29" : lead.date >= "2026-09-06"; }
function PeriodPicker({ value, onChange }: {
    value: Period;
    onChange: (value: Period) => void;
}) { return <Select aria-label="Kỳ thống kê" value={value} onChange={event => onChange(event.target.value as Period)}><option value="day">Hôm nay · 05/10</option><option value="week">7 ngày gần nhất</option><option value="month">30 ngày gần nhất</option></Select>; }
function Empty({ title, children }: {
    title: string;
    children: ReactNode;
}) { return <div className={cn("empty")}><h2>{title}</h2><p>{children}</p></div>; }
function Search({ value, onChange, label, placeholder }: {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder: string;
}) { return <label className={cn("search")}><Icon name="search"/><Input aria-label={label} placeholder={placeholder} value={value} onChange={event => onChange(event.target.value)}/></label>; }
function Metrics({ period }: {
    period: Period;
}) {
    const { role, leads, projects, equipment } = useAdminDemo();
    const scopedProjects = projects.filter(x => role === "ADMIN" || x.assigned);
    const scopedEquipment = equipment.filter(x => role === "ADMIN" || x.assigned);
    const rows: {
        label: string;
        value: number;
        detail: string;
        attention?: boolean;
    }[] = role === "ADMIN" ? [
        { label: "Khảo sát trong kỳ", value: leads.filter(x => inPeriod(x, period)).length, detail: "Theo ngày nhận phản hồi" },
        { label: "Chưa xử lý trong kỳ", value: leads.filter(x => inPeriod(x, period) && x.status === "new").length, detail: "Cần tiếp nhận", attention: true },
        { label: "Dự án đang hiển thị", value: projects.filter(x => x.status === "published").length, detail: "Tổng hiện tại" },
        { label: "Thiết bị đang hiển thị", value: equipment.filter(x => x.status === "published").length, detail: "Tổng hiện tại" },
    ] : [
        { label: "Dự án được giao", value: scopedProjects.length, detail: "Trong phạm vi của bạn" },
        { label: "Bản nháp", value: scopedProjects.filter(x => x.status === "draft").length, detail: "Tiếp tục biên tập", attention: true },
        { label: "Thiết bị được giao", value: scopedEquipment.length, detail: "Trong phạm vi của bạn" },
        { label: "Đang hiển thị", value: scopedProjects.filter(x => x.status === "published").length, detail: "Dự án hiện tại" },
    ];
    return <section className={cn("metrics")} aria-label="Thống kê tổng quan">{rows.map(x => <div key={x.label} className={cn("metric", x.attention && "attention")}><div className={cn("label")}>{x.label}</div><div className={cn("value")}>{x.value}</div><small>{x.detail}</small></div>)}</section>;
}
export function AdminDashboard() {
    const { role, leads } = useAdminDemo();
    const [period, setPeriod] = useState<Period>("month");
    if (role === "EDITOR")
        return <><PageHeading title="Nội dung của bạn" description="Cập nhật dự án và thiết bị trong phạm vi được giao." actions={<ActionLink href="/admin/projects/new/" primary icon="plus">Thêm dự án</ActionLink>}/><Metrics period={period}/><CatalogList kind="projects" embedded/></>;
    const dates = period === "day" ? ["2026-10-05"] : period === "week" ? ["2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04", "2026-10-05"] : ["2026-09-28", "2026-10-03", "2026-10-04", "2026-10-05"];
    return <><PageHeading title="Bàn vận hành" description="Nhìn nhanh công việc. Xử lý ngay tại một nơi." actions={<PeriodPicker value={period} onChange={setPeriod}/>}/><Metrics period={period}/><LeadWorkspace period={period} dashboard/><div className={cn("split", "sectiongap")}><Panel title="Khảo sát theo thời gian" description="Dữ liệu mẫu · giờ Việt Nam"><div className={cn("panelbody")}><div className={cn("chart")} role="img" aria-label={dates.map(date => `${date}: ${leads.filter(x => x.date === date).length} khảo sát`).join("; ")}>{dates.map(date => <div className={cn("barwrap")} key={date}><div className={cn("bar")} style={{ height: leads.filter(x => x.date === date).length * 48 }}/><small>{date.slice(8)}/{date.slice(5, 7)}</small></div>)}</div><p className={cn("chartlegend")}>{period === "month" ? "Các ngày có phản hồi trong kỳ mẫu" : "Số phản hồi nhận mỗi ngày"}</p></div></Panel><Panel title="Hoạt động nội dung"><div className={cn("activity")}>{[["Editor nội dung lưu nháp dự án", "Công trình dân dụng · Đồng Tháp", "09:10"], ["ADMIN cập nhật thiết bị", "Inverter hòa lưới", "Hôm qua"], ["ADMIN hiển thị dự án", "Điện mặt trời mái nhà · Cần Thơ", "03/10"]].map(([title, detail, time]) => <div className={cn("activityrow")} key={title}><div>{title}<br /><span>{detail}</span></div><span>{time}</span></div>)}</div></Panel></div></>;
}
function exportLeads(leads: DemoLead[]) {
    const cell = (value: string) => `"${value.replace(/^[\s]*[=+@-]/, "'").replace(/"/g, '""')}"`;
    const csv = "\uFEFF" + [["Tên", "Khu vực", "Ngày nhận", "Trạng thái"], ...leads.map(x => [x.name, x.area, x.date, statusLabels[x.status]])].map(row => row.map(cell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "khao-sat-du-lieu-mau.csv";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function AdminLeads() { const [period, setPeriod] = useState<Period>("month"); return <LeadWorkspace period={period} periodPicker={<PeriodPicker value={period} onChange={setPeriod}/>}/>; }
function LeadWorkspace({ period, dashboard = false, periodPicker }: {
    period: Period;
    dashboard?: boolean;
    periodPicker?: ReactNode;
}) {
    const { leads, notify } = useAdminDemo();
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState<LeadStatus | "all">("all");
    const [selected, setSelected] = useState(1);
    const [detail, setDetail] = useState(false);
    const detailTitle = useRef<HTMLHeadingElement>(null);
    const backRef = useRef<HTMLButtonElement>(null);
    const list = leads.filter(x => inPeriod(x, period) && (!dashboard || x.status !== "done") && (tab === "all" || x.status === tab) && `${x.name} ${x.area}`.toLowerCase().includes(query.toLowerCase()));
    const lead = list.find(x => x.id === selected) || list[0];
    useEffect(() => { if (detail && window.matchMedia("(max-width:850px)").matches)
        detailTitle.current?.focus({ preventScroll: true }); }, [detail, selected]);
    function select(id: number) { setSelected(id); setDetail(true); }
    function back() { setDetail(false); requestAnimationFrame(() => document.getElementById(`lead-row-${lead?.id}`)?.focus()); }
    return <>{!dashboard && <PageHeading title="Khảo sát / Lead" description="Đọc phản hồi và theo dõi tiến trình xử lý." actions={<>{periodPicker}<Action icon="download" onClick={() => { exportLeads(list); notify(`Đã xuất ${list.length} phản hồi mẫu theo bộ lọc.`); }}>Xuất CSV</Action><Action onClick={() => notify("Vị trí thao tác xuất Excel; tạo XLSX nối ở bước backend.")}>Excel · xem layout</Action></>}/>}<div className={cn("split", detail && "detailopen")}><Panel title={dashboard ? "Cần xử lý" : "Danh sách phản hồi"} description={`${list.length} khảo sát ${dashboard ? "đang chờ bạn xử lý" : "khớp bộ lọc"}`} className={cn("listpanel")} action={dashboard && <Link href="/admin/leads/" className={cn("textbutton")}>Xem tất cả</Link>}><div className={cn("tabs")} role="group" aria-label="Lọc trạng thái">{(["all", "new", "processing", ...(!dashboard ? ["done"] : [])] as const).map(status => <button key={status} type="button" className={cn(tab === status && "active")} aria-pressed={tab === status} onClick={() => { setTab(status as typeof tab); setDetail(false); }}>{status === "all" ? "Tất cả" : statusLabels[status as LeadStatus]}</button>)}</div>{!dashboard && <div className={cn("toolbar")}><Search value={query} onChange={setQuery} label="Tìm khảo sát" placeholder="Tìm tên hoặc khu vực…"/></div>}<div className={cn("queue")}>{list.length ? list.map(x => <button type="button" key={x.id} id={`lead-row-${x.id}`} className={cn("queueitem", lead?.id === x.id && "selected")} aria-pressed={lead?.id === x.id} onClick={() => select(x.id)}><span className={cn("initial")}>{x.initial}</span><span className={cn("queuetext")}><strong>{x.name}</strong><small>{x.type} · {x.area}</small></span><span className={cn("queuestate")}><StatusBadge status={x.status}/><small>{x.date === "2026-10-05" ? x.time : x.date.slice(8) + "/" + x.date.slice(5, 7)}</small></span></button>) : <Empty title="Không có phản hồi phù hợp">Thử kỳ khác hoặc bỏ bộ lọc để xem phản hồi mẫu.</Empty>}</div></Panel><section className={cn("panel", "detailpanel")}><div className={cn("panelhead")}><h2 ref={detailTitle} tabIndex={-1}>Chi tiết khảo sát</h2><Action ref={backRef} className={cn("backdetail")} icon="back" onClick={back}>Quay lại</Action></div><div className={cn("panelbody")}>{lead ? <LeadDetails key={lead.id} lead={lead}/> : <p className={cn("muted")}>Chọn một khảo sát để xem chi tiết.</p>}</div></section></div></>;
}
function LeadDetails({ lead }: {
    lead: DemoLead;
}) {
    const { setLeads, notify } = useAdminDemo();
    const [status, setStatus] = useState(lead.status);
    const [comment, setComment] = useState(lead.comment);
    function save(event: FormEvent) { event.preventDefault(); setLeads(rows => rows.map(x => x.id === lead.id ? { ...x, status, comment } : x)); notify("Đã cập nhật khảo sát mẫu."); }
    return <><div className={cn("detailname")}><span className={cn("initial")}>{lead.initial}</span><div><h2>{lead.name}</h2><p>Nhận lúc {lead.time} · {lead.date.split("-").reverse().join("/")}</p></div></div><dl className={cn("details")}>{[["Liên hệ", lead.phone], ["Khu vực", lead.area], ["Loại công trình", lead.type], ["Diện tích mái", lead.roof], ["Tiền điện dự kiến", lead.bill], ["Email mẫu", lead.email]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className={cn("summary")}><h3>Nhu cầu khảo sát</h3><p>{lead.note}</p></div><form className={cn("formstack")} onSubmit={save} aria-label="Cập nhật khảo sát"><label className={cn("field")}>Trạng thái xử lý<Select value={status} onChange={event => setStatus(event.target.value as LeadStatus)}>{(["new", "processing", "done"] as const).map(x => <option value={x} key={x}>{statusLabels[x]}</option>)}</Select></label><label className={cn("field")}>Ghi chú nội bộ<Textarea value={comment} onChange={event => setComment(event.target.value)} placeholder="Ghi lại kết quả trao đổi…"/></label><div className={cn("detailfoot")}><small>Chỉ cập nhật dữ liệu mẫu</small><Action type="submit" tone="primary" icon="check">Lưu cập nhật</Action></div></form></>;
}
export function CatalogList({ kind, embedded = false }: {
    kind: CatalogKind;
    embedded?: boolean;
}) {
    const { role, projects, equipment, notify } = useAdminDemo();
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const isProject = kind === "projects";
    const rows = (isProject ? projects : equipment).filter(x => (role === "ADMIN" || x.assigned) && (filter === "all" || x.status === filter) && x.name.toLowerCase().includes(query.toLowerCase()));
    function editPath(id: number) { return (isProject ? initialProjects : initialEquipment).some(x => x.id === id) ? `/admin/${kind}/${id}/edit/` : `/admin/${kind}/edit/?id=${id}`; }
    return <>{!embedded && <PageHeading title={isProject ? "Dự án" : "Thiết bị"} description={isProject ? "Quản lý công trình, hình ảnh và trạng thái hiển thị." : "Quản lý danh mục, thông số và tình trạng thiết bị."} actions={<ActionLink href={`/admin/${kind}/new/`} primary icon="plus">{isProject ? "Thêm dự án" : "Thêm thiết bị"}</ActionLink>}/>}<Panel><div className={cn("toolbar")}><Search value={query} onChange={setQuery} label="Tìm nội dung" placeholder={isProject ? "Tìm tên dự án…" : "Tìm tên thiết bị…"}/><Select aria-label="Trạng thái hiển thị" value={filter} onChange={event => setFilter(event.target.value)}><option value="all">Tất cả trạng thái</option>{(["published", "draft", "hidden"] as const).map(x => <option key={x} value={x}>{statusLabels[x]}</option>)}</Select>{role === "ADMIN" && <Action onClick={() => notify(isProject ? "Danh mục mẫu: Nhà ở, Doanh nghiệp." : "Danh mục mẫu: Tấm pin, Inverter, Lưu trữ, Phụ kiện.")}>Danh mục</Action>}</div><div className={cn("tablewrap")}><table><thead><tr><th>{isProject ? "Dự án" : "Thiết bị"}</th><th>Danh mục</th><th>{isProject ? "Khu vực" : "Tình trạng"}</th><th>Hiển thị</th>{isProject && <th>Tiêu biểu</th>}<th>Thao tác</th></tr></thead><tbody>{rows.map(x => <tr key={x.id}><td><div className={cn("titlecell")}><img src={imagePath(x.image)} alt="" width="52" height="42"/><div><strong>{x.name}</strong><small>{x.power}</small></div></div></td><td>{x.category}</td><td>{isProject ? x.area : x.availability}</td><td><StatusBadge status={x.status}/></td>{isProject && <td>{x.featured ? "Có" : "—"}</td>}<td><Link className={cn("textbutton")} href={editPath(x.id)}>Chỉnh sửa</Link></td></tr>)}</tbody></table></div>{!rows.length && <Empty title="Không tìm thấy nội dung">Thử tên khác hoặc bỏ bộ lọc trạng thái.</Empty>}<div className={cn("tablefoot")}><span>{rows.length} {isProject ? "dự án" : "thiết bị"} · dữ liệu mẫu</span><span>Trang 1 / 1</span></div></Panel></>;
}
export function CatalogEditQuery({ kind, id }: {
    kind: CatalogKind;
    id?: string;
}) { const query = useSearchParams(); const recordId = id || query.get("id") || undefined; return <CatalogEditor key={`${kind}:${recordId || "new"}`} kind={kind} id={recordId}/>; }
function CatalogEditor({ kind, id }: {
    kind: CatalogKind;
    id?: string;
}) {
    const { role, projects, equipment, setProjects, setEquipment, notify } = useAdminDemo();
    const router = useRouter();
    const isProject = kind === "projects";
    const items = isProject ? projects : equipment;
    const original = items.find(x => String(x.id) === id);
    const [form, setForm] = useState<DemoCatalog>(() => original ? { ...original } : { id: 0, name: "", category: isProject ? "Nhà ở" : "Tấm pin", area: "", power: "", status: "draft", summary: "", image: isProject ? "proj-1.png" : "equip-panel.png", availability: "Sẵn có", assigned: true });
    const [dirty, setDirty] = useState(false);
    useEffect(() => { if (!dirty)
        return; function warn(event: BeforeUnloadEvent) { event.preventDefault(); } window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);
    function update<K extends keyof DemoCatalog>(key: K, value: DemoCatalog[K]) { setForm(current => ({ ...current, [key]: value })); setDirty(true); }
    function cancel() { if (!dirty || confirm("Rời trang? Thay đổi chưa lưu sẽ mất."))
        router.push(`/admin/${kind}/`); }
    function save(event: FormEvent) { event.preventDefault(); const record = { ...form, id: original?.id || Math.max(0, ...items.map(x => x.id)) + 1 }; (isProject ? setProjects : setEquipment)(rows => original ? rows.map(x => x.id === original.id ? record : x) : [...rows, record]); setDirty(false); notify("Đã lưu nội dung mẫu trong phiên demo."); router.push(`/admin/${kind}/`); }
    if (id && (!original || (role === "EDITOR" && !original.assigned)))
        return <><PageHeading title="Không có nội dung trong phiên này" description="Bản ghi không tồn tại hoặc ngoài phạm vi xem trước. Dữ liệu mới sẽ mất sau reload."/><ActionLink href={`/admin/${kind}/`}>Về danh sách</ActionLink></>;
    const images = isProject ? ["proj-1.png", "proj-2.png", "proj-3.png", "proj-4.png"] : ["equip-panel.png", "equip-inverter.png", "equip-battery.png"];
    return <><div className={cn("breadcrumbs")}><Link href={`/admin/${kind}/`}>{isProject ? "Dự án" : "Thiết bị"}</Link><span>/</span><span>{id ? "Chỉnh sửa" : "Thêm mới"}</span></div><PageHeading title={`${id ? "Chỉnh sửa" : "Thêm"} ${isProject ? "dự án" : "thiết bị"}`} description="Nhập thông tin, kiểm tra hình ảnh và chọn trạng thái hiển thị." actions={<Action icon="back" onClick={cancel}>Về danh sách</Action>}/><form className={cn("panel", "editor")} onSubmit={save} aria-label="Biên tập nội dung"><section className={cn("formsection")}><h2>Thông tin {isProject ? "dự án" : "thiết bị"}</h2><div className={cn("formgrid")}><label className={cn("field", "wide")}>{isProject ? "Tên dự án" : "Tên thiết bị"}<Input required maxLength={200} value={form.name} onChange={event => update("name", event.target.value)} placeholder="Nhập tên nội dung"/></label><label className={cn("field")}>Danh mục<Select value={form.category} onChange={event => update("category", event.target.value)}>{(isProject ? ["Nhà ở", "Doanh nghiệp"] : ["Tấm pin", "Inverter", "Lưu trữ", "Phụ kiện"]).map(x => <option key={x}>{x}</option>)}</Select></label><label className={cn("field")}>{isProject ? "Khu vực" : "Tình trạng thiết bị"}{isProject ? <Input required value={form.area} onChange={event => update("area", event.target.value)} placeholder="Tỉnh / Thành phố"/> : <Select value={form.availability} onChange={event => update("availability", event.target.value)}><option>Sẵn có</option><option>Đang cập nhật</option></Select>}</label><label className={cn("field")}>{isProject ? "Công suất hệ thống" : "Thông số chính"}<Input value={form.power} onChange={event => update("power", event.target.value)} placeholder={isProject ? "Ví dụ: 8 kWp" : "Ví dụ: 550 W"}/></label><label className={cn("field")}>Trạng thái hiển thị<Select value={form.status} onChange={event => update("status", event.target.value as ContentStatus)}>{(["draft", "published", "hidden"] as const).map(x => <option key={x} value={x}>{statusLabels[x]}</option>)}</Select></label><label className={cn("field", "wide")}>Mô tả<Textarea maxLength={1000} value={form.summary} onChange={event => update("summary", event.target.value)} placeholder="Nội dung giới thiệu ngắn"/></label></div></section><section className={cn("formsection")}><h2>Hình ảnh</h2><div className={cn("cover")}><img src={imagePath(form.image)} alt="Ảnh mẫu cho nội dung" width="130" height="90"/><div><p>Ảnh bìa</p><small>Chọn ảnh có sẵn trong thư viện mẫu.</small><label className={cn("field")}>Tên file<Select value={form.image} onChange={event => update("image", event.target.value)}>{images.map(x => <option key={x}>{x}</option>)}</Select></label></div></div></section><div className={cn("savebar")}><small>Thay đổi chỉ lưu trong phiên demo.</small><div className={cn("actions")}><Action onClick={cancel}>Hủy</Action><Action type="submit" tone="primary">Lưu nội dung mẫu</Action></div></div></form></>;
}
export function AdminMedia() {
    const { role, media, setMedia, notify, trackObjectUrl } = useAdminDemo();
    const [query, setQuery] = useState("");
    const [folder, setFolder] = useState("all");
    const fileInput = useRef<HTMLInputElement>(null);
    const rows = media.filter(x => (role === "ADMIN" || x.assigned) && (folder === "all" || x.folder === folder) && x.name.toLowerCase().includes(query.toLowerCase()));
    function upload(files: FileList | null) { const newMedia: DemoMedia[] = []; let rejected = 0; for (const file of Array.from(files || [])) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 3 * 1024 * 1024) {
            rejected++;
            continue;
        }
        const url = URL.createObjectURL(file);
        trackObjectUrl(url);
        newMedia.push({ name: file.name, image: url, folder: "Ảnh tải lên", uses: 0, assigned: true });
    } setMedia(rows => [...rows, ...newMedia]); setFolder("all"); notify(`${newMedia.length} ảnh xem trước trong bộ nhớ${rejected ? `; ${rejected} ảnh bị bỏ qua (JPEG/PNG/WebP, tối đa 3 MiB)` : ""}. Chưa upload lên server.`); if (fileInput.current)
        fileInput.current.value = ""; }
    async function copy(url: string) { try {
        await navigator.clipboard.writeText(url.startsWith("blob:") ? url : new URL(url, location.href).href);
        notify("Đã sao chép liên kết ảnh mẫu.");
    }
    catch {
        notify("Trình duyệt chưa cho phép sao chép. Vui lòng cấp quyền clipboard.");
    } }
    return <><PageHeading title="Thư viện Media" description="Tìm ảnh, xem nơi sử dụng và sao chép liên kết tài nguyên." actions={<Action tone="primary" icon="plus" onClick={() => fileInput.current?.click()}>Tải ảnh mẫu</Action>}/><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" hidden multiple onChange={event => upload(event.target.files)}/><Panel><div className={cn("toolbar")}><Search label="Tìm file media" placeholder="Tìm tên file…" value={query} onChange={setQuery}/><Select aria-label="Thư mục" value={folder} onChange={event => setFolder(event.target.value)}><option value="all">Tất cả thư mục</option>{["Dự án", "Thiết bị", "Ảnh tải lên"].map(x => <option key={x}>{x}</option>)}</Select></div><div className={cn("media")}>{rows.map((x, index) => <article className={cn("mediacard")} key={`${x.image}:${index}`}><img src={x.image} alt={x.name} width="260" height="145"/><div className={cn("mediainfo")}><strong>{x.name}</strong><small>{x.folder} · {x.uses ? `Dùng trong ${x.uses} nội dung` : "Chưa sử dụng"}</small><button type="button" className={cn("textbutton")} onClick={() => copy(x.image)}><Icon name="copy"/> Sao chép liên kết</button></div></article>)}</div>{!rows.length && <Empty title="Chưa có ảnh phù hợp">Chọn thư mục khác hoặc tải ảnh mẫu lên để thử bố cục.</Empty>}<div className={cn("tablefoot")}><span>{rows.length} ảnh mẫu</span><span>JPEG · PNG · WebP</span></div></Panel></>;
}
export function AdminEditors() {
    const { editors, setEditors, notify } = useAdminDemo();
    const [invite, setInvite] = useState(false);
    const nameInput = useRef<HTMLInputElement>(null);
    useEffect(() => { if (invite)
        nameInput.current?.focus(); }, [invite]);
    function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); setEditors(rows => [...rows, { name: String(data.get("name")), email: String(data.get("email")), scope: String(data.get("scope")), status: "Đang chờ lời mời" }]); setInvite(false); notify("Đã tạo lời mời mẫu; chưa gửi email."); }
    return <><PageHeading title="Tài khoản Editor" description="Mời cộng tác viên và quản lý phạm vi biên tập." actions={<Action tone="primary" icon="plus" onClick={() => setInvite(true)}>Mời Editor</Action>}/><Panel><div className={cn("tablewrap")}><table><thead><tr><th>Tài khoản</th><th>Vai trò</th><th>Phạm vi</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{editors.map((x, index) => <tr key={index}><td><strong>{x.name}</strong><small>{x.email}</small></td><td>EDITOR</td><td>{x.scope}</td><td><span className={cn("badge", x.status === "Hoạt động" ? "published" : "draft")}>{x.status}</span></td><td><button className={cn("textbutton")} type="button" onClick={() => { setEditors(rows => rows.map((row, i) => i === index ? { ...row, status: row.status === "Đã khóa" ? "Hoạt động" : "Đã khóa" } : row)); notify("Đã đổi trạng thái tài khoản mẫu."); }}>{x.status === "Đã khóa" ? "Mở khóa" : "Khóa tài khoản"}</button></td></tr>)}</tbody></table></div><div className={cn("tablefoot")}><span>{editors.length} tài khoản mẫu</span><span>ADMIN quản lý Editor</span></div></Panel>{invite && <form className={cn("panel", "editor", "sectiongap")} onSubmit={submit} aria-label="Mời Editor"><div className={cn("formsection")}><h2>Mời Editor</h2><div className={cn("formgrid")}><label className={cn("field")}>Tên hiển thị<Input ref={nameInput} name="name" required placeholder="Tên cộng tác viên"/></label><label className={cn("field")}>Email mẫu<Input name="email" type="email" required placeholder="editor@example.test"/></label><label className={cn("field", "wide")}>Phạm vi<Select name="scope"><option>Dự án dân dụng · Thiết bị</option><option>Dự án doanh nghiệp</option><option>Thiết bị</option></Select></label></div></div><div className={cn("savebar")}><small>Không gửi email thật</small><div className={cn("actions")}><Action onClick={() => setInvite(false)}>Hủy</Action><Action tone="primary" type="submit">Tạo lời mời mẫu</Action></div></div></form>}</>;
}
export function AdminAuth({ mode }: {
    mode: "login" | "forgot" | "reset";
}) {
    const { notify, setRole } = useAdminDemo();
    const router = useRouter();
    const [feedback, setFeedback] = useState("");
    function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (mode === "login") {
        setRole("ADMIN");
        notify("Đã mở demo; chưa thực hiện xác thực.");
        router.push("/admin/");
    }
    else if (mode === "forgot")
        setFeedback("Phản hồi mẫu: Nếu email thuộc tài khoản được cấp, bạn sẽ nhận được hướng dẫn khôi phục. Demo không gửi email.");
    else
        setFeedback("Đã xem trạng thái đặt mật khẩu mẫu. Không có token được xác minh hoặc mật khẩu được lưu."); }
    const title = mode === "login" ? "Chào mừng trở lại" : mode === "forgot" ? "Khôi phục mật khẩu" : "Đặt mật khẩu mới";
    return <main className={cn("auth")}><section className={cn("authbrand")}><Brand /><div><h1>Nội dung rõ ràng.<br />Vận hành nhẹ nhàng.</h1><p>Quản lý dự án, thiết bị và khảo sát trong một không gian làm việc.</p></div><small className={cn("muted")}>Bản mẫu giao diện · dữ liệu minh họa</small></section><section className={cn("authform")}><div className={cn("authinner")}><h1 tabIndex={-1}>{title}</h1><p>{mode === "login" ? "Bản xem trước màn hình đăng nhập." : mode === "forgot" ? "Nhập email để xem trạng thái gửi liên kết mẫu." : "Xem bố cục khi nhận liên kết đặt lại mật khẩu."}</p><form className={cn("formstack")} onSubmit={submit} aria-label={title}>{mode !== "reset" && <label className={cn("field")}>Email<Input type="email" name="email" defaultValue="admin@example.test" required/></label>}{mode !== "forgot" && <label className={cn("field")}>{mode === "reset" ? "Mật khẩu mới" : "Mật khẩu"}<Input type="password" placeholder="Chỉ dùng mật khẩu giả để xem layout" autoComplete="off" required={mode === "reset"} minLength={mode === "reset" ? 8 : undefined}/></label>}<Action type="submit" tone="primary">{mode === "login" ? "Mở demo ADMIN" : mode === "forgot" ? "Xem phản hồi mẫu" : "Xem trạng thái đặt lại"}</Action></form><div className={cn("actions", "sectiongap")}><Link className={cn("textbutton")} href={mode === "login" ? "/admin/forgot-password/" : "/admin/login/"}>{mode === "login" ? "Quên mật khẩu?" : "Quay lại đăng nhập"}</Link>{mode === "forgot" && <Link className={cn("textbutton")} href="/admin/reset-password/">Xem màn hình đặt lại</Link>}</div>{feedback && <p className={cn("result")} role="status">{feedback}</p>}<p className={cn("muted", "sectiongap")}>Demo không xác thực, không gửi email và không lưu mật khẩu.</p><Link href="/" className={cn("textbutton")}>Về website</Link></div></section></main>;
}
