import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  checkRelease,
  expectedFiles,
  writeReleaseReport,
} from './check-release-links.mjs';
import { catalogPath, syncCatalog } from './download-catalog.mjs';

const root = new URL('../', import.meta.url);
const repository = 'storytold/photocraft';
const api = `https://api.github.com/repos/${repository}/releases/latest`;

export function releaseVersion(metadata) {
  const match = /^v(\d+\.\d+\.\d+)$/.exec(metadata.tag_name ?? '');
  if (
    !match ||
    metadata.draft !== false ||
    metadata.prerelease !== false ||
    !Number.isFinite(Date.parse(metadata.published_at)) ||
    metadata.html_url !==
      `https://github.com/${repository}/releases/tag/${metadata.tag_name}`
  )
    throw new Error(
      'Latest must be a published official release with a numeric version.'
    );
  return match[1];
}

export function nextManifest(current, metadata) {
  expectedFiles(current);
  const version = releaseVersion(metadata);
  if (version.localeCompare(current.version, 'en', { numeric: true }) < 0)
    throw new Error('Refusing an automatic version downgrade.');
  const base = `https://github.com/${repository}/releases/download/v${version}/`;
  const assets = new Map(
    (metadata.assets ?? []).map((asset) => [asset.name, asset])
  );
  // An incomplete upload must never remove an existing architecture or format.
  for (const name of expectedFiles({ ...current, version })) {
    const asset = assets.get(name);
    if (
      !asset ||
      asset.state !== 'uploaded' ||
      !Number.isSafeInteger(asset.size) ||
      asset.size <= 0 ||
      asset.browser_download_url !== base + name
    )
      throw new Error(`Latest release is incomplete: ${name}`);
  }
  const builds = structuredClone(current.builds);
  const known = new Set(expectedFiles({ ...current, version }));
  for (const asset of assets.values()) {
    if (known.has(asset.name)) continue;
    const match = new RegExp(
      `^photocraft-${version.replaceAll('.', '\\.')}-(windows|linux)-(x64|arm64|x86|x86_64|aarch64|riscv64)(-portable\\.zip|\\.msi|\\.AppImage|\\.flatpak|\\.deb|\\.rpm|\\.tar\\.gz|\\.pkg\\.tar\\.zst)$`
    ).exec(asset.name);
    if (!match) continue;
    const [, platform, architecture, extension] = match;
    if (
      asset.browser_download_url !== base + asset.name ||
      asset.state !== 'uploaded' ||
      !(asset.size > 0)
    )
      throw new Error(`Unexpected new asset: ${asset.name}`);
    const names = {
      '-portable.zip': 'Portable ZIP',
      '.msi': 'MSI',
      '.AppImage': 'AppImage',
      '.flatpak': 'Flatpak',
      '.deb': 'DEB',
      '.rpm': 'RPM',
      '.tar.gz': 'tar.gz',
      '.pkg.tar.zst': 'Arch package',
    };
    builds[platform].push({
      name: names[extension],
      file: asset.name.replace(`-${version}-`, '-{version}-'),
      architecture: ['arm64', 'aarch64'].includes(architecture)
        ? 'ARM64'
        : architecture === 'riscv64'
          ? 'RISC-V 64'
          : architecture,
      since: version,
    });
  }
  return { ...current, version, builds };
}

export function releaseMaturity(readme) {
  const status = /Status:\s*(early alpha|alpha|beta|stable)\b/i
    .exec(readme)?.[1]
    ?.toLowerCase();
  return status ? status.replace(' ', '-') : 'unknown';
}

export function historyEntry(manifest, metadata, report) {
  const version = manifest.version;
  const compare = metadata.body?.match(
    new RegExp(
      `https://github\\.com/${repository}/compare/v[0-9.]+\\.\\.\\.v${version.replaceAll('.', '\\.')}(?![0-9.])`
    )
  )?.[0];
  const base = `https://github.com/${repository}/releases/download/v${version}/`;
  return {
    version,
    publishedAt: metadata.published_at,
    releaseUrl: metadata.html_url,
    compareUrl: compare ?? metadata.html_url,
    summary: {
      en: `Official v${version} release. Read the upstream notes for the full changes.`,
      zh: `官方 v${version} 发布。完整变更请查看上游发布说明。`,
    },
    audience: {
      en: 'Download metadata, checksums and links were verified automatically. Installation tests and malware scans retain their original version and scope.',
      zh: '下载元数据、校验值和链接已自动核对。安装实测和病毒扫描仍以各自记录的原始版本与范围为准。',
    },
    changes: [],
    downloads: [
      ['windows', 'windows-x64.msi'],
      ['macos', 'macos-universal.dmg'],
      ['linux', 'linux-x86_64.AppImage'],
    ].map(([platform, suffix]) => ({
      platform,
      url: `${base}photocraft-${version}-${suffix}`,
    })),
    checksumUrl: base + 'SHA256SUMS.txt',
    files: Object.entries(manifest.builds).flatMap(([platform, items]) =>
      items.map((item) => {
        const file = item.file.replaceAll('{version}', version);
        return {
          platform,
          architecture: item.architecture,
          name: item.name,
          file,
          url: base + file,
          bytes: report.assetSizes[file],
          sha256: report.assetHashes[file],
        };
      })
    ),
  };
}

export async function planReleaseUpdate(
  current,
  history,
  { fetchImpl = fetch, token, now } = {}
) {
  const get = async (url, options = {}) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetchImpl(url, {
          ...options,
          signal: AbortSignal.timeout(20000),
        });
        if (!response.ok)
          throw new Error(`Official request failed: HTTP ${response.status}`);
        return response;
      } catch (error) {
        if (attempt === 2) throw error;
      }
    }
  };
  const metadata = await (
    await get(api, {
      redirect: 'error',
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'photocraft-release-updater',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  ).json();
  const manifest = nextManifest(current, metadata);
  const changed = manifest.version !== current.version;
  if (changed) {
    const readme = await (
      await get(
        `https://raw.githubusercontent.com/${repository}/v${manifest.version}/README.md`,
        { redirect: 'error' }
      )
    ).text();
    manifest.maturity = releaseMaturity(readme);
  }
  const report = await checkRelease(manifest, { fetchImpl, token, now });
  const nextHistory = changed
    ? {
        ...history,
        checkedAt: report.checkedAt,
        releases: [
          historyEntry(manifest, metadata, report),
          ...history.releases.filter(
            (entry) => entry.version !== manifest.version
          ),
        ],
      }
    : history;
  return {
    changed,
    previousVersion: current.version,
    version: manifest.version,
    manifest,
    history: nextHistory,
    report,
  };
}

async function main() {
  const read = async (path) =>
    JSON.parse(await readFile(new URL(path, root), 'utf8'));
  const result = await planReleaseUpdate(
    await read('src/content/photocraft-release.json'),
    await read('src/content/photocraft-version-history.json'),
    { token: process.env.GITHUB_TOKEN }
  );
  const catalog = result.changed
    ? await syncCatalog({
        token: process.env.GITHUB_TOKEN,
        existing: await read('src/content/photocraft-download-files.json'),
      })
    : undefined;
  // All upstream data and every download must pass before any source file is changed.
  if (process.argv.includes('--write')) {
    await writeReleaseReport(result.report, { recordHistory: result.changed });
    if (result.changed) {
      await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
      await writeFile(
        new URL('src/content/photocraft-version-history.json', root),
        JSON.stringify(result.history, null, 2) + '\n'
      );
      await writeFile(
        new URL('src/content/photocraft-release.json', root),
        JSON.stringify(result.manifest, null, 2) + '\n'
      );
    }
  }
  if (process.env.GITHUB_OUTPUT)
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `changed=${result.changed}\nversion=${result.version}\nprevious_version=${result.previousVersion}\n`
    );
  console.log(
    result.changed
      ? `Verified update: v${result.previousVersion} → v${result.version}`
      : `Already current: v${result.version}`
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main().catch((error) => {
    console.error(`Automatic release update failed: ${error.message}`);
    process.exitCode = 1;
  });
