import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';

const origin = process.argv[2];
if (!origin)
  throw new Error('Supply the base URL of a running production preview.');
const read = (path) =>
  JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const manifest = read('src/content/photocraft-release.json');
const verification = read('src/generated/photocraft-release-check.json');
const history = read('src/content/photocraft-version-history.json');
const catalog = read('src/content/photocraft-download-files.json');
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
  assert.equal((table.match(/<tr\b[^>]*>/g) ?? []).length, files.length + 1);
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
assert.equal(verification.version, manifest.version);
assert.equal(verification.latestVersion, manifest.version);
assert.ok(
  home.includes(
    '<title>PhotoCraft Download — Free Photo Editor for Windows, macOS &amp; Linux</title>'
  )
);
assert.ok(!home.includes('A newer official release is available:'));
const homepageFiles = files.filter((file) => file.platform !== 'windows');
validate(tables(home)[0], homepageFiles);
const zhHome = await fetchHtml('/zh');
assert.ok(
  zhHome.includes(
    '<title>PhotoCraft 下载 — 适用于 Windows、macOS 和 Linux 的免费照片编辑器</title>'
  )
);
validate(tables(zhHome)[0], homepageFiles);
for (const html of [home, zhHome]) {
  assert.ok(html.includes('class="pc-windows-summary"'));
  assert.ok(
    html.includes('href="/photocraft-windows"') ||
      html.includes('href="/zh/photocraft-windows"')
  );
  assert.doesNotMatch(
    html,
    /href="https:\/\/github\.com\/storytold\/photocraft\/releases\/download\/[^/]+\/photocraft-[^"]+-windows-/
  );
  assert.ok(
    !html.includes('id="tab-windows"'),
    'Windows installation steps belong on the Windows page'
  );
}
assert.ok(
  home.indexOf('pc-download-table') < home.indexOf('pc-chooser-enhancement')
);
for (const locale of ['', '/zh']) {
  for (const platform of ['windows', 'macos', 'linux']) {
    const html = await fetchHtml(`${locale}/photocraft-${platform}`);
    if (platform === 'windows' && !locale) {
      assert.ok(html.includes('<h1>PhotoCraft for Windows Download</h1>'));
      assert.match(
        html,
        /<h2[^>]*>PhotoCraft Windows 11: choose x64, x86 or ARM64<\/h2>/
      );
      assert.ok(html.includes('MSI versus Portable ZIP'));
      assert.ok(html.includes('Missing DLL or runtime messages'));
    }
    validate(
      tables(html)[0],
      files.filter((file) => file.platform === platform)
    );
    const directDownloads = [
      ...html.matchAll(
        /href="https:\/\/github\.com\/storytold\/photocraft\/releases\/download\/v([^/]+)\//g
      ),
    ];
    assert.ok(directDownloads.length > 0);
    for (const [, version] of directDownloads)
      assert.equal(
        version,
        manifest.version,
        `${locale}/${platform}: stale direct download`
      );
  }
}
const archive = await fetchHtml('/photocraft-version-history');
assert.equal(tables(archive).length, 0);
history.releases.forEach((entry) => {
  assert.ok(
    archive.includes(
      `href="/photocraft-download-files#v${entry.version.replaceAll('.', '-')}"`
    )
  );
  assert.ok(archive.includes(`id="v${entry.version.replaceAll('.', '-')}"`));
  assert.ok(archive.includes(`href="${entry.releaseUrl}"`));
});
for (const locale of ['', '/zh']) {
  const html = await fetchHtml(`${locale}/photocraft-download-files`);
  const catalogTables = tables(html);
  assert.equal(catalogTables.length, catalog.releases.length);
  catalog.releases.forEach((entry, index) => {
    validate(catalogTables[index], entry.files);
    assert.ok(html.includes(`id="v${entry.version.replaceAll('.', '-')}"`));
    for (const file of entry.files) {
      assert.ok(
        catalogTables[index].includes(`id="v${entry.version}-${file.file}"`)
      );
      assert.ok(catalogTables[index].includes('pc-file-usage'));
    }
  });
  const rawHtml = await (
    await fetch(new URL(`${locale}/photocraft-download-files`, origin))
  ).text();
  assert.ok(rawHtml.includes('"@type":"CollectionPage"'));
  assert.ok(home.includes('href="/photocraft-download-files"'));
  const latest = catalog.releases.find(
    (entry) => entry.version === manifest.version
  );
  assert.ok(latest);
  for (const file of files) {
    const record = latest.files.find((item) => item.file === file.file);
    assert.equal(record?.sha256, file.sha256);
    assert.equal(record?.bytes, file.bytes);
  }
}
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
const recordedFile = (file) =>
  history.releases
    .flatMap((entry) => entry.files)
    .find((item) => item.file === file);
assert.ok(
  recordedFile(scan.file),
  'Scanned file must exist in the verified archive'
);
assert.equal(scan.sha256, recordedFile(scan.file)?.sha256);
assert.equal(scan.bytes, recordedFile(scan.file)?.bytes);
assert.equal(scan.exitCode, 0);
assert.ok(
  safe.includes(scan.file),
  'Scan scope must identify the actual scanned version'
);
const capture = await (
  await fetch(new URL('/imgs/photocraft/captures/capture-record.json', origin))
).json();
assert.ok(
  history.releases.some((entry) => entry.version === capture.appVersion)
);
assert.ok(
  recordedFile(capture.package),
  'Captured build must exist in the verified archive'
);
assert.equal(capture.packageSha256, recordedFile(capture.package)?.sha256);
const review = await fetchHtml('/photocraft-review');
assert.ok(
  review.includes(`v${capture.appVersion}`),
  'Review must disclose its tested version'
);
for (const screenshot of capture.screenshots) {
  const path = `/imgs/photocraft/captures/${screenshot.file}.${screenshot.originalFormat ?? 'png'}`;
  assert.ok(
    review.includes(`href="${path}"`),
    'Review must link to the current original capture'
  );
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  assert.equal(
    createHash('sha256')
      .update(Buffer.from(await response.arrayBuffer()))
      .digest('hex'),
    screenshot.originalSha256,
    path
  );
}
const document = await fetch(
  new URL(`/imgs/photocraft/captures/${capture.document.file}`, origin)
);
assert.equal(document.status, 200);
assert.equal(
  createHash('sha256')
    .update(Buffer.from(await document.arrayBuffer()))
    .digest('hex'),
  capture.document.sha256,
  'Current saved test document'
);
assert.ok(
  history.releases.some((entry) => entry.version === '0.9.0'),
  'Keep v0.9.0 downloads in the archive'
);
const slugs = readdirSync(new URL('../src/content/guides/', import.meta.url))
  .filter((file) => file.endsWith('.en.mdx'))
  .map((file) => file.slice(0, -7))
  .filter((slug) => !policy.retiredGuideSlugs.includes(slug));
for (const locale of ['', '/zh']) {
  for (const slug of ['', ...slugs]) {
    if (
      ['photocraft-version-history', 'photocraft-download-files'].includes(slug)
    )
      continue;
    const path = `${locale}/${slug}`;
    const html = await fetchHtml(path);
    for (const [, version, filename] of html.matchAll(
      /href="https:\/\/github\.com\/storytold\/photocraft\/releases\/download\/v([^/]+)\/([^"?#]+)/g
    )) {
      // The review cites the checksum list for the original hands-on evidence.
      if (slug === 'photocraft-review' && filename === 'SHA256SUMS.txt') {
        assert.equal(
          version,
          capture.appVersion,
          `${path}: evidence checksum version`
        );
        continue;
      }
      assert.equal(
        version,
        manifest.version,
        `${path}: stale download ${filename}`
      );
    }
    if (slug !== 'is-photocraft-safe')
      assert.ok(
        !html.includes('0.9.0'),
        `${path}: v0.9.0 outside historical records`
      );
  }
}
const publicVerification = await (
  await fetch(new URL('/release-check.json', origin))
).json();
assert.deepEqual(
  publicVerification,
  verification,
  'Public report and rendered download data must agree'
);
console.log(
  `Passed: ${homepageFiles.length} homepage download rows; 3 platform tables; ${catalog.releases.length} catalog versions / ${catalog.releases.reduce((n, entry) => n + entry.files.length, 0)} file rows in both languages; full SHA256 and byte sizes; history links; scan evidence.`
);
