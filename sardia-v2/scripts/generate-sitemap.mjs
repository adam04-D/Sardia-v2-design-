import { writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/sitemap.xml');
const SITE = process.env.SITE_URL ?? 'https://sardia.me';
const API = process.env.VITE_API_BASE_URL ?? process.env.API_BASE_URL ?? 'http://localhost:5000';

const staticRoutes = [
  { loc: '/', priority: '1.0' },
  { loc: '/gallery', priority: '0.9' },
  { loc: '/about', priority: '0.8' },
  { loc: '/author', priority: '0.7' },
];

async function fetchWorks() {
  try {
    const res = await fetch(`${API}/api/works?page=1&limit=1000`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json?.data?.works ?? [];
  } catch (err) {
    console.warn(`[sitemap] API unreachable (${err.message}) — writing static-only sitemap`);
    return [];
  }
}

function urlEntry({ loc, priority, lastmod }) {
  const parts = [`  <url>`, `    <loc>${SITE}${loc}</loc>`];
  if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
  if (priority) parts.push(`    <priority>${priority}</priority>`);
  parts.push(`  </url>`);
  return parts.join('\n');
}

const works = await fetchWorks();
const workEntries = works.map((w) => ({
  loc: `/reading/${w.id}`,
  priority: '0.8',
  lastmod: w.updated_at ? new Date(w.updated_at).toISOString().slice(0, 10) : undefined,
}));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticRoutes, ...workEntries].map(urlEntry).join('\n')}
</urlset>
`;

await writeFile(OUT, xml, 'utf8');
console.log(`[sitemap] wrote ${staticRoutes.length + workEntries.length} urls → ${OUT}`);
