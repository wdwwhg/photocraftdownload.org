import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const origin = 'https://photocraftdownload.org';
const directory = new URL('../src/content/guides/', import.meta.url);
const files = readdirSync(directory);
const policy = JSON.parse(
  readFileSync(
    new URL('../src/content/search-policy.json', import.meta.url),
    'utf8'
  )
);
const slugs = files
  .filter((name) => name.endsWith('.en.mdx'))
  .map((name) => name.slice(0, -7))
  .sort();
const routes = [
  '',
  ...slugs.filter(
    (slug) =>
      !policy.noindexGuideSlugs.includes(slug) &&
      !policy.retiredGuideSlugs.includes(slug)
  ),
];
const urlFor = (slug, locale) =>
  locale === 'zh'
    ? `${origin}/zh${slug ? `/${slug}` : ''}`
    : `${origin}/${slug}`;

for (const slug of slugs) {
  if (!files.includes(`${slug}.zh.mdx`))
    throw new Error(`Missing Chinese content: ${slug}`);
  const route = new URL(`../src/routes/(guides)/${slug}.tsx`, import.meta.url);
  readFileSync(route, 'utf8');
}

const entries = routes.map(
  (slug) =>
    `  <url>\n    <loc>${urlFor(slug, policy.primaryLocale)}</loc>\n  </url>`
);

writeFileSync(
  new URL('../public/sitemap.xml', import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`
);
console.log(`Generated sitemap with ${entries.length} canonical URLs.`);
