import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

// Run against a built server: node scripts/check-search-policy.mjs http://localhost:3000
const origin = process.argv[2];
if (!origin) throw new Error('Supply the base URL of a running preview.');
const policy = JSON.parse(
  readFileSync(
    new URL('../src/content/search-policy.json', import.meta.url),
    'utf8'
  )
);
const slugs = readdirSync(new URL('../src/content/guides/', import.meta.url))
  .filter((file) => file.endsWith('.en.mdx'))
  .map((file) => file.slice(0, -7));
const failures = [];
const paths = ['', ...slugs].flatMap((slug) => [
  {
    path: `/${slug}`,
    noindex: policy.noindexGuideSlugs.includes(slug),
    retired: policy.retiredGuideSlugs.includes(slug),
  },
  {
    path: `/zh${slug ? `/${slug}` : ''}`,
    noindex: true,
    retired: policy.retiredGuideSlugs.includes(slug),
  },
]);
async function checkPage({ path, noindex, retired }) {
  const response = await fetch(new URL(path, origin));
  if (retired) {
    assert.equal(
      response.status,
      404,
      `${path}: retired page must be HTTP 404`
    );
    assert.match(
      response.headers.get('x-robots-tag') ?? '',
      /noindex/,
      `${path}: retired HTTP noindex`
    );
    return;
  }
  assert.equal(response.status, 200, `${path}: HTTP status`);
  const html = await response.text();
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const robots = tags.filter((tag) => /name=["']robots["']/i.test(tag));
  assert.equal(robots.length, 1, `${path}: exactly one robots meta`);
  assert.match(
    robots[0],
    noindex ? /noindex,\s*follow/ : /content=["']index,\s*follow/,
    `${path}: robots directive`
  );
  if (noindex)
    assert.match(
      response.headers.get('x-robots-tag') ?? '',
      /noindex/,
      `${path}: HTTP noindex`
    );
  else
    assert.doesNotMatch(
      response.headers.get('x-robots-tag') ?? '',
      /noindex/,
      `${path}: indexable HTTP header`
    );
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  assert.ok(
    !links.some((tag) => /hreflang=/i.test(tag)),
    `${path}: no alternates to excluded locales`
  );
  const canonical = links.find((tag) => /rel=["']canonical["']/i.test(tag));
  assert.ok(canonical, `${path}: canonical exists`);
  const href = canonical.match(/href=["']([^"']+)/i)?.[1];
  assert.equal(
    new URL(href).pathname.replace(/\/$/, ''),
    path.replace(/\/$/, ''),
    `${path}: self canonical`
  );
  if (path === '/') {
    for (const slug of [
      ...policy.noindexGuideSlugs,
      ...policy.retiredGuideSlugs,
    ]) {
      assert.ok(
        !html.includes(`href="/${slug}"`),
        `Homepage still promotes ${slug}`
      );
    }
    for (const slug of policy.priorityGuideSlugs) {
      assert.ok(
        html.includes(`href="/${slug}"`),
        `Homepage missing priority guide ${slug}`
      );
    }
  }
}
for (let offset = 0; offset < paths.length; offset += 4) {
  const results = await Promise.allSettled(
    paths.slice(offset, offset + 4).map(checkPage)
  );
  for (const result of results)
    if (result.status === 'rejected') failures.push(result.reason.message);
}

const sitemapResponse = await fetch(new URL('/sitemap.xml', origin));
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
assert.equal(
  sitemap.trim(),
  readFileSync(
    new URL('../public/sitemap.xml', import.meta.url),
    'utf8'
  ).trim(),
  'Runtime and static sitemaps must match'
);
const indexedPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname
);
assert.deepEqual(
  indexedPaths.sort(),
  paths
    .filter((item) => !item.noindex && !item.retired)
    .map((item) => item.path)
    .sort(),
  'Sitemap must contain exactly the indexable English pages'
);
assert.doesNotMatch(sitemap, /hreflang/);
const robots = await (await fetch(new URL('/robots.txt', origin))).text();
const disallowed = robots.split(/\r?\n/).flatMap((line) => {
  const match = line.match(/^Disallow:\s*(\S+)/i);
  return match ? [match[1]] : [];
});
for (const path of [
  '/zh',
  ...policy.noindexGuideSlugs.map((slug) => `/${slug}`),
]) {
  assert.ok(
    !disallowed.some((rule) => path.startsWith(rule)),
    `${path}: must remain crawlable to expose noindex`
  );
}
if (failures.length) throw new Error(failures.join('\n'));
console.log(
  `Passed: ${paths.length} rendered pages; meta and HTTP robots; self canonicals; homepage priorities; ${indexedPaths.length} sitemap URLs; crawl access.`
);
