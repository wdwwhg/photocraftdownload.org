import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const origin = 'https://photocraftdownload.org';
const directory = new URL('../src/content/guides/', import.meta.url);
const files = readdirSync(directory);
const slugs = files
  .filter((name) => name.endsWith('.en.mdx'))
  .map((name) => name.slice(0, -7))
  .sort();
const routes = ['', ...slugs];
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

const entries = routes.flatMap((slug) =>
  ['en', 'zh'].map((locale) => {
    const links = ['en', 'zh', 'x-default']
      .map(
        (language) =>
          `    <xhtml:link rel="alternate" hreflang="${language}" href="${urlFor(slug, language === 'zh' ? 'zh' : 'en')}" />`
      )
      .join('\n');
    return `  <url>\n    <loc>${urlFor(slug, locale)}</loc>\n${links}\n  </url>`;
  })
);

writeFileSync(
  new URL('../public/sitemap.xml', import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`
);
console.log(`Generated sitemap with ${entries.length} canonical URLs.`);
