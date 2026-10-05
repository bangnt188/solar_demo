// Design-fixture generator, not an application runtime importer.
// Run from repository root: node database/seeds/build-landing-seed.cjs
// Generates a fresh-database DRAFT seed. It never connects to any database.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const cache = new Map();
function load(relative) {
  const file = path.resolve(root, relative);
  if (!file.startsWith(path.join(root, 'src/data') + path.sep)) throw new Error('Only local content modules are allowed');
  if (cache.has(file)) return cache.get(file);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports,
    require(specifier) {
      if (specifier.startsWith('@/data/')) return load('src/' + specifier.slice(2) + '.ts');
      if (!specifier.startsWith('./')) throw new Error(`Unsupported content import: ${specifier}`);
      return load(path.relative(root, path.resolve(path.dirname(file), specifier + '.ts')));
    },
  }, { filename: file });
  cache.set(file, module.exports);
  return module.exports;
}
const copy = value => JSON.parse(JSON.stringify(value));
const home = copy(load('src/data/content/home.ts').homeContent);
const chrome = copy(load('src/data/content/site-chrome.ts').siteChromeContent);
const catalog = copy(load('src/data/mock/catalog.ts'));
const id = (group, index) => `${group}0000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;
const revisionId = id(4, 0);
const mediaBindings = [];
const media = [];
function bind(slot, staticPath) {
  let asset = media.find(item => item.staticPath === staticPath);
  if (!asset) {
    const image = fs.readFileSync(path.join(root, 'public', staticPath));
    // Image dimensions from committed PNG/WebP assets; no external decoder needed.
    let width, height, mimeType;
    if (image.subarray(1, 4).toString() === 'PNG') {
      width = image.readUInt32BE(16); height = image.readUInt32BE(20); mimeType = 'image/png';
    } else if (image.subarray(8, 12).toString() === 'WEBP') {
      mimeType = 'image/webp';
      const kind = image.subarray(12, 16).toString();
      if (kind === 'VP8X') { width = image.readUIntLE(24, 3) + 1; height = image.readUIntLE(27, 3) + 1; }
      else if (kind === 'VP8L') {
        const bits = image.readUInt32LE(21);
        width = (bits & 0x3fff) + 1; height = ((bits >>> 14) & 0x3fff) + 1;
      } else if (kind === 'VP8 ') { width = image.readUInt16LE(26) & 0x3fff; height = image.readUInt16LE(28) & 0x3fff; }
      else throw new Error(`Unsupported WebP fixture: ${staticPath}`);
    } else throw new Error(`Unsupported image fixture: ${staticPath}`);
    asset = { id: id(1, media.length), staticPath, mimeType, sizeBytes: image.length, width, height };
    media.push(asset);
  }
  if (slot) mediaBindings.push({ slot, mediaId: asset.id });
  return asset.id;
}
function imageSlot(object, property, slot) {
  bind(slot, `images/demo/${object[property]}`);
  delete object[property];
  object[property + 'Slot'] = slot;
}
chrome.brand.logoSlot = 'chrome.logo';
bind('chrome.logo', 'images/common/logo.png');
chrome.announcement.enabled = true;
chrome.conversion.phoneHref = null;
chrome.conversion.zaloHref = null;
imageSlot(home.hero, 'image', 'hero.image');
imageSlot(home.hero, 'bottomImage', 'hero.bottomImage');
home.services.items.forEach((item, index) => {
  item.key = ['epc', 'equipment-supply', 'investment'][index] || `service-${index + 1}`;
  imageSlot(item, 'image', `services.${item.key}.image`);
});
home.solutions.items.forEach((item, index) => {
  item.key = ['household', 'small-business', 'enterprise'][index] || `solution-${index + 1}`;
  imageSlot(item, 'image', `solutions.${item.key}.image`);
});
home.whyUs.images.forEach((item, index) => {
  item.key = ['primary', 'secondary', 'panel'][index];
  imageSlot(item, 'image', `whyUs.${item.key}.image`);
});
imageSlot(home.faq, 'image', 'faq.image');
const slug = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
catalog.projects.forEach((item, index) => { item.id = id(2, index); item.slug = slug(item.title); item.mediaId = bind(null, `images/demo/${item.image}`); });
catalog.equipment.forEach((item, index) => { item.id = id(3, index); item.slug = slug(item.title); item.mediaId = bind(null, `images/demo/${item.image}`); });
const featuredProjectTitles = home.featuredProjects.projectTitles;
delete home.featuredProjects.projectTitles;
const projectIdByTitle = new Map(catalog.projects.map(item => [item.title, item.id]));
const featuredProjects = featuredProjectTitles.map((title, position) => {
  const projectId = projectIdByTitle.get(title);
  if (!projectId) throw new Error(`Featured project title not found in catalog: ${title}`);
  return { projectId, position };
});
const snapshot = {
  schemaVersion: 1,
  chrome,
  seo: {
    title: 'Giải pháp điện mặt trời cho gia đình và doanh nghiệp',
    description: 'Tìm hiểu giải pháp điện mặt trời của Lúa Xanh Đồng Bằng: khảo sát, thiết kế, thi công, vận hành và các công trình đã triển khai.',
    requestedIndexable: false,
  },
  sections: Object.entries(home).map(([key, content], position) => ({ key, position, enabled: key !== 'testimonials' || content.items.length > 0, content })),
  mediaBindings,
  featuredProjects,
  featuredEquipment: catalog.equipment.map((item, position) => ({ equipmentId: item.id, position })),
};
const q = value => "'" + String(value).replace(/'/g, "''") + "'";
const j = value => q(JSON.stringify(value)) + '::jsonb';
const lines = [
  '-- Generated by build-landing-seed.cjs from the current landing content.',
  '-- FRESH SANDBOX ONLY. All catalog records remain DRAFT; media unapproved;',
  '-- landing_site.published_revision_id remains NULL. Not safe production copy.',
  '-- Intentionally fails on duplicate IDs. Never upsert over editorial changes.',
  'BEGIN;', 'SET LOCAL search_path = solar_appdata, pg_catalog;',
];
for (const m of media) lines.push(`INSERT INTO media(id,storage_kind,static_path,mime_type,size_bytes,width,height,state) VALUES (${q(m.id)},'STATIC',${q(m.staticPath)},${q(m.mimeType)},${m.sizeBytes},${m.width},${m.height},'READY');`);
for (const p of catalog.projects) {
  lines.push(`INSERT INTO projects(id,title,slug,summary,location,category,system,cover_media_id) VALUES (${[p.id,p.title,p.slug,p.description,p.location,p.category,p.system,p.mediaId].map(q).join(',')});`);
  lines.push(`INSERT INTO project_media(project_id,media_id,position,alt_text) VALUES (${q(p.id)},${q(p.mediaId)},0,${q('Hình minh họa: ' + p.title)});`);
}
for (const e of catalog.equipment) {
  lines.push(`INSERT INTO equipment(id,name,slug,summary,category,cover_media_id) VALUES (${[e.id,e.title,e.slug,e.description,e.category,e.mediaId].map(q).join(',')});`);
  lines.push(`INSERT INTO equipment_media(equipment_id,media_id,position,alt_text) VALUES (${q(e.id)},${q(e.mediaId)},0,${q('Hình minh họa: ' + e.title)});`);
}
lines.push(`INSERT INTO landing_revisions(id,label,chrome,seo) VALUES (${q(revisionId)},'Landing hiện tại — cần duyệt nội dung và quyền ảnh',${j(chrome)},${j(snapshot.seo)});`);
for (const s of snapshot.sections) lines.push(`INSERT INTO landing_sections(revision_id,section_key,position,enabled,content) VALUES (${q(revisionId)},${q(s.key)},${s.position},${s.enabled},${j(s.content)});`);
for (const b of mediaBindings) lines.push(`INSERT INTO landing_media_bindings(revision_id,slot,media_id) VALUES (${q(revisionId)},${q(b.slot)},${q(b.mediaId)});`);
for (const f of snapshot.featuredProjects) lines.push(`INSERT INTO landing_featured_projects(revision_id,project_id,position) VALUES (${q(revisionId)},${q(f.projectId)},${f.position});`);
for (const f of snapshot.featuredEquipment) lines.push(`INSERT INTO landing_featured_equipment(revision_id,equipment_id,position) VALUES (${q(revisionId)},${q(f.equipmentId)},${f.position});`);
lines.push('COMMIT;', '');
fs.writeFileSync(path.join(__dirname, 'landing-demo.json'), JSON.stringify(snapshot, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, '001_landing_demo.sql'), lines.join('\n'));
console.log(`Generated DRAFT fixture: ${snapshot.sections.length} sections, ${media.length} media, ${catalog.projects.length} projects, ${catalog.equipment.length} equipment.`);
