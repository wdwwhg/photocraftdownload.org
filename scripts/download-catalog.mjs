import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { assetChecksum, parseChecksums } from './release-assets.mjs';

const root = new URL('../', import.meta.url);
export const catalogPath = new URL(
  'src/content/photocraft-download-files.json',
  root
);
const repository = 'storytold/photocraft';
const base = `https://github.com/${repository}/releases/`;

export async function officialRequest(
  url,
  { fetchImpl = fetch, token, method = 'GET' } = {}
) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetchImpl(url, {
        method,
        signal: AbortSignal.timeout(60000),
        headers: {
          'User-Agent': 'photocraft-file-catalog',
          ...(token && new URL(url).origin === 'https://api.github.com'
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
      });
      if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
      return response;
    } catch (error) {
      if (attempt === 2) throw new Error(`${method} ${url}: ${error.message}`);
    }
  }
}

export function classifyFile(file) {
  const platform = /-windows-/.test(file)
    ? 'windows'
    : /-macos-/.test(file)
      ? 'macos'
      : /-linux-/.test(file)
        ? 'linux'
        : /-freebsd-/.test(file)
          ? 'freebsd'
          : /-web[-.]/.test(file)
            ? 'web'
            : 'all';
  const architecture =
    file.match(/-(x86_64|aarch64|riscv64|arm64|x64|x86)(?:[.-])/)?.[1] ??
    (platform === 'macos'
      ? 'Universal'
      : platform === 'web'
        ? 'Browser'
        : 'All');
  const name =
    file === 'SHA256SUMS.txt'
      ? 'SHA256 list'
      : file.endsWith('.wixpdb')
        ? 'Debug symbols'
        : file.endsWith('.zsync')
          ? 'AppImage update metadata'
          : file.endsWith('.msi')
            ? 'MSI'
            : file.endsWith('.dmg')
              ? 'DMG'
              : file.endsWith('.AppImage')
                ? 'AppImage'
                : file.endsWith('.flatpak')
                  ? 'Flatpak'
                  : file.endsWith('.deb')
                    ? 'DEB'
                    : file.endsWith('.rpm')
                      ? 'RPM'
                      : file.endsWith('.pkg.tar.zst')
                        ? 'Arch package'
                        : file.endsWith('.tar.gz')
                          ? 'tar.gz'
                          : file.endsWith('.zip')
                            ? platform === 'windows'
                              ? 'Portable ZIP'
                              : platform === 'web'
                                ? 'Web ZIP'
                                : 'CLI ZIP'
                            : file.split('.').at(-1);
  return { platform, architecture, name };
}

export async function catalogRelease(metadata, options = {}) {
  const tag = metadata.tag_name;
  if (
    metadata.draft ||
    !/^v\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/.test(tag) ||
    !metadata.published_at ||
    metadata.html_url !== `${base}tag/${tag}`
  )
    throw new Error('Invalid official catalog release.');
  const assets = metadata.assets;
  if (!Array.isArray(assets) || !assets.length)
    throw new Error(`No assets: ${tag}`);
  const names = new Set();
  for (const asset of assets) {
    if (
      !/^[a-zA-Z0-9._-]+$/.test(asset.name) ||
      names.has(asset.name) ||
      !Number.isSafeInteger(asset.size) ||
      asset.size <= 0 ||
      asset.state !== 'uploaded' ||
      asset.browser_download_url !== `${base}download/${tag}/${asset.name}`
    )
      throw new Error(`Invalid official asset: ${asset.name}`);
    names.add(asset.name);
  }
  const checksumAsset = assets.find((asset) => asset.name === 'SHA256SUMS.txt');
  if (!checksumAsset) throw new Error(`Missing checksum list: ${tag}`);
  const checksumBytes = Buffer.from(
    await (
      await officialRequest(checksumAsset.browser_download_url, options)
    ).arrayBuffer()
  );
  if (checksumBytes.length !== checksumAsset.size)
    throw new Error(`Checksum list byte size mismatch: ${tag}`);
  const checksumHash = createHash('sha256').update(checksumBytes).digest('hex');
  if (checksumAsset.digest && checksumAsset.digest !== `sha256:${checksumHash}`)
    throw new Error(`Checksum list digest mismatch: ${tag}`);
  const checksums = parseChecksums(checksumBytes.toString('utf8'));
  const files = assets
    .map((asset) => ({
      ...classifyFile(asset.name),
      file: asset.name,
      bytes: asset.size,
      sha256:
        asset === checksumAsset
          ? checksumHash
          : assetChecksum(asset, checksums),
      hashSource:
        asset === checksumAsset ? 'downloaded-checksum-file' : 'SHA256SUMS.txt',
      url: asset.browser_download_url,
    }))
    .sort((a, b) => a.file.localeCompare(b.file, 'en'));
  // Check delivery metadata without downloading hundreds of installer binaries.
  for (let offset = 0; offset < files.length; offset += 4) {
    const results = await Promise.allSettled(
      files.slice(offset, offset + 4).map(async (file) => {
        const response = await officialRequest(file.url, {
          ...options,
          method: 'HEAD',
        });
        if (Number(response.headers.get('content-length')) !== file.bytes)
          throw new Error(`Asset byte size mismatch: ${file.file}`);
      })
    );
    for (const result of results)
      if (result.status === 'rejected') throw result.reason;
  }
  return {
    version: tag.slice(1),
    publishedAt: metadata.published_at,
    prerelease: metadata.prerelease || tag.includes('-'),
    releaseUrl: metadata.html_url,
    checksumUrl: checksumAsset.browser_download_url,
    files,
  };
}

export async function syncCatalog({ existing, ...options } = {}) {
  const metadata = [];
  for (let page = 1; ; page++) {
    const batch = await (
      await officialRequest(
        `https://api.github.com/repos/${repository}/releases?per_page=100&page=${page}`,
        options
      )
    ).json();
    if (!Array.isArray(batch))
      throw new Error('Invalid official release list.');
    metadata.push(...batch.filter((entry) => !entry.draft));
    if (batch.length < 100) break;
  }
  const releases = [];
  for (let offset = 0; offset < metadata.length; offset += 3) {
    const results = await Promise.allSettled(
      metadata.slice(offset, offset + 3).map(async (entry) => {
        const previous = existing?.releases.find(
          (item) => `v${item.version}` === entry.tag_name
        );
        const unchanged =
          previous &&
          previous.releaseUrl === entry.html_url &&
          previous.publishedAt === entry.published_at &&
          previous.files.length === entry.assets.length &&
          entry.assets.every((asset) => {
            const file = previous.files.find(
              (item) => item.file === asset.name
            );
            return (
              file &&
              asset.state === 'uploaded' &&
              file.bytes === asset.size &&
              file.url === asset.browser_download_url &&
              file.url === `${base}download/${entry.tag_name}/${file.file}` &&
              asset.digest === `sha256:${file.sha256}`
            );
          });
        if (unchanged) return previous;
        const result = await catalogRelease(entry, options);
        console.log(
          `Verified ${entry.tag_name}: ${entry.assets.length} official files`
        );
        return result;
      })
    );
    for (const result of results) {
      if (result.status === 'rejected') throw result.reason;
      releases.push(result.value);
    }
  }
  releases.sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  );
  return { repository, checkedAt: new Date().toISOString(), releases };
}

async function main() {
  const catalog = await syncCatalog({ token: process.env.GITHUB_TOKEN });
  if (process.argv.includes('--write'))
    await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
  console.log(
    `${catalog.releases.length} versions; ${catalog.releases.reduce((sum, release) => sum + release.files.length, 0)} files`
  );
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
