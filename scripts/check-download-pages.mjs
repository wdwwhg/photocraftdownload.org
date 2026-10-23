import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const origin = process.argv[2];
if (!origin)
  throw new Error('Supply the base URL of a running production preview.');
const read = (path) =>
  JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const manifest = read('src/content/photocraft-release.json');
const verification = read('src/generated/photocraft-release-check.json');
const history = read('src/content/photocraft-version-history.json');
const policy = read('src/content/search-policy.json');
const fetchHtml = async (path) => {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  return (await response.text()).replace(
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    ''
  );
};
const tables = (html) =>
  [
    ...html.matchAll(
      /<div[^>]*class="pc-download-table"[^>]*>[\s\S]*?<\/table>/g
    ),
  ].map((match) => match[0]);
const validate = (table, files) => {
  assert.equal((table.match(/<tr>/g) ?? []).length, files.length + 1);
  for (const file of files) {
    assert.ok(table.includes(`href="${file.url}"`), file.file);
    assert.ok(
      table.includes(file.bytes.toLocaleString('en-US')),
      `${file.file}: exact bytes`
    );
    assert.ok(
      table.includes(`<code>${file.sha256}</code>`),
      `${file.file}: full hash in initial HTML`
    );
    assert.match(file.sha256, /^[a-f0-9]{64}$/);
  }
};
const files = Object.entries(manifest.builds).flatMap(([platform, builds]) =>
  builds.map((build) => {
    const file = build.file.replaceAll('{version}', manifest.version);
    return {
      platform,
      file,
      url: `https://github.com/${manifest.repository}/releases/download/v${manifest.version}/${file}`,
      bytes: verification.assetSizes[file],
      sha256: verification.assetHashes[file],
    };
  })
);
const home = await fetchHtml('/');
validate(tables(home)[0], files);
assert.ok(
  home.indexOf('pc-download-table') < home.indexOf('pc-chooser-enhancement')
);
for (const platform of ['windows', 'macos', 'linux'])
  validate(
    tables(await fetchHtml(`/photocraft-${platform}`))[0],
    files.filter((file) => file.platform === platform)
  );
const archive = await fetchHtml('/photocraft-version-history');
const historicalTables = tables(archive);
assert.equal(historicalTables.length, history.releases.length);
history.releases.forEach((entry, index) => {
  validate(historicalTables[index], entry.files);
  assert.ok(archive.includes(`id="v${entry.version.replaceAll('.', '-')}"`));
  assert.ok(archive.includes(`href="${entry.releaseUrl}"`));
});
for (const path of ['', ...policy.priorityGuideSlugs]) {
  const html = path ? await fetchHtml(`/${path}`) : home;
  for (const slug of policy.retiredGuideSlugs)
    assert.ok(
      !html.includes(`href="/${slug}"`),
      `${path}: links to retired ${slug}`
    );
}
const safe = await fetchHtml('/is-photocraft-safe');
assert.ok(safe.includes('found no threats'));
for (const command of ['Get-FileHash', 'shasum -a 256', 'sha256sum'])
  assert.ok(safe.includes(command));
const scan = await (
  await fetch(new URL('/photocraft-security-scan.json', origin))
).json();
assert.equal(scan.sha256, verification.assetHashes[scan.file]);
assert.equal(scan.exitCode, 0);
console.log(
  `Passed: ${files.length} initial-HTML download rows; 3 platform tables; ${history.releases.reduce((n, entry) => n + entry.files.length, 0)} historical file records; full SHA256 and byte sizes; no promoted retired links; scan evidence.`
);
