// Explicit UI-only routes permitted in the public Pages demo. This list must
// never include auth handlers, API routes or production data-fetching endpoints.
export const demoAdminTemplates = [
  '/admin', '/admin/projects', '/admin/projects/new', '/admin/projects/edit', '/admin/projects/[id]/edit',
  '/admin/equipment', '/admin/equipment/new', '/admin/equipment/edit', '/admin/equipment/[id]/edit',
  '/admin/media', '/admin/leads', '/admin/editors', '/admin/login', '/admin/forgot-password', '/admin/reset-password',
];
export const demoAdminPaths = [
  ...demoAdminTemplates.filter(route => !route.includes('[id]')),
  ...[1, 2, 3, 4].map(id => `/admin/projects/${id}/edit`),
  ...[1, 2, 3].map(id => `/admin/equipment/${id}/edit`),
];
export function normalizedAppRoute(route) { return route.replace(/\/\([^/]+\)/g, '').replace(/\/(page|route)$/, '').replace(/\/$/, '') || '/'; }
export function assertDemoRouteBoundary(routes) {
  for (const route of routes) {
    const path = normalizedAppRoute(route);
    if (/^\/api(?:\/|$)/.test(path) || /^\/admin(?:\/|$)/.test(path) && !demoAdminTemplates.includes(path)) {
      throw new Error(`Server or unapproved admin route leaked into demo artifact: ${path}`);
    }
  }
}
