import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const history = JSON.parse(
  await readFile(
    new URL('src/content/photocraft-version-history.json', root),
    'utf8'
  )
);
const report = {
  checkedAt: new Date().toISOString(),
  releases: [],
  checkedDownloads: 0,
};
const request = async (url, options = {}) => {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
      return response;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
};

try {
  const versions = new Set();
  for (const entry of history.releases) {
    if (!/^\d+\.\d+\.\d+$/.test(entry.version) || versions.has(entry.version))
      throw new Error('Invalid or duplicate history version');
    versions.add(entry.version);
    const url = `https://api.github.com/repos/storytold/photocraft/releases/tags/v${entry.version}`;
    const metadata = await (
      await request(url, {
        headers: {
          'User-Agent': 'photocraft-version-history-check',
          Accept: 'application/vnd.github+json',
        },
      })
    ).json();
    if (
      metadata.draft ||
      metadata.prerelease ||
      metadata.published_at !== entry.publishedAt ||
      metadata.html_url !== entry.releaseUrl
    )
      throw new Error(`Release/date mismatch: ${entry.version}`);
    if (!metadata.body?.includes(entry.compareUrl))
      throw new Error(`Changelog comparison mismatch: ${entry.version}`);
    for (const change of entry.changes) {
      if (!change.en || !change.zh || !metadata.body.includes(change.source))
        throw new Error(`Unverified change source: ${entry.version}`);
    }
    const platforms = new Set(entry.downloads.map((item) => item.platform));
    if (
      platforms.size !== 3 ||
      !['windows', 'macos', 'linux'].every((platform) =>
        platforms.has(platform)
      )
    )
      throw new Error(`Missing platform: ${entry.version}`);
    const links = [
      ...entry.downloads.map((item) => item.url),
      entry.checksumUrl,
    ];
    for (const link of links) {
      const asset = metadata.assets.find(
        (item) =>
          item.browser_download_url === link &&
          item.state === 'uploaded' &&
          item.size > 0
      );
      if (!asset) throw new Error(`Unverified historical asset: ${link}`);
      const response = await request(link, {
        method: 'HEAD',
        redirect: 'follow',
      });
      if (response.headers.get('content-type')?.includes('text/html'))
        throw new Error(`Historical asset returned HTML: ${link}`);
      const size = response.headers.get('content-length');
      if (size && Number(size) !== asset.size)
        throw new Error(`Historical asset size mismatch: ${link}`);
      report.checkedDownloads++;
    }
    report.releases.push({
      version: entry.version,
      publishedAt: entry.publishedAt,
      changes: entry.changes.length,
      downloads: links.length,
    });
  }
  if (!report.releases.length) throw new Error('Empty version history');
  await mkdir(new URL('artifacts/', root), { recursive: true });
  await writeFile(
    new URL('artifacts/version-history-check.json', root),
    JSON.stringify(report, null, 2) + '\n'
  );
  console.log(JSON.stringify({ status: 'passed', ...report }, null, 2));
} catch (error) {
  console.error(`Version history check failed: ${error.message}`);
  process.exitCode = 1;
}
