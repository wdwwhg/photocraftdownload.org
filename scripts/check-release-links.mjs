import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = 'storytold/photocraft';
const root = new URL('../', import.meta.url);
const snapshot = new URL('src/generated/photocraft-release-check.json', root);
const publicReport = new URL('public/release-check.json', root);

export function expectedFiles(manifest) {
  if (
    manifest.repository !== repository ||
    !/^\d+\.\d+\.\d+$/.test(manifest.version)
  )
    throw new Error('Invalid official repository or release version.');
  const files = ['windows', 'macos', 'linux'].flatMap((platform) => {
    const items = manifest.builds[platform];
    if (!Array.isArray(items) || !items.length)
      throw new Error(`No ${platform} builds.`);
    return items.map(({ file }) =>
      file.replaceAll('{version}', manifest.version)
    );
  });
  files.push('SHA256SUMS.txt');
  if (
    new Set(files).size !== files.length ||
    files.some((file) => !/^[a-zA-Z0-9._-]+$/.test(file))
  )
    throw new Error('Duplicate or invalid release filename.');
  return files;
}

export async function checkRelease(
  manifest,
  { fetchImpl = fetch, token, now = () => new Date() } = {}
) {
  const files = expectedFiles(manifest);
  const tag = `v${manifest.version}`;
  const api = `https://api.github.com/repos/${repository}/releases`;
  const base = `https://github.com/${repository}/releases/download/${tag}/`;
  const request = async (url, options) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetchImpl(url, {
          ...options,
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
        return response;
      } catch (error) {
        if (attempt === 2) throw error;
        await new Promise((done) => setTimeout(done, 500 * (attempt + 1)));
      }
    }
  };
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'photocraftdownload.org-release-check',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const [pinned, latest] = await Promise.all(
    [`${api}/tags/${tag}`, `${api}/latest`].map(async (url) =>
      (await request(url, { headers, redirect: 'error' })).json()
    )
  );
  if (pinned.tag_name !== tag || pinned.draft || pinned.prerelease)
    throw new Error(
      `The configured release ${tag} is not a published stable release.`
    );
  if (latest.tag_name !== tag)
    throw new Error(
      `New official release ${latest.tag_name}; site still lists ${tag}. Review the manifest and version-specific guides before updating.`
    );
  const assets = new Map(pinned.assets.map((asset) => [asset.name, asset]));
  const assetSizes = {};
  for (const file of files) {
    const asset = assets.get(file);
    if (
      !asset ||
      asset.state !== 'uploaded' ||
      !(asset.size > 0) ||
      asset.browser_download_url !== base + file
    )
      throw new Error(`Missing, empty or unexpected official asset: ${file}`);
    assetSizes[file] = asset.size;
  }
  // HEAD follows GitHub's download redirects without downloading installers.
  // No API credential is sent to asset URLs or their CDN redirects.
  for (let offset = 0; offset < files.length; offset += 3) {
    await Promise.all(
      files.slice(offset, offset + 3).map(async (file) => {
        const response = await request(base + file, {
          method: 'HEAD',
          redirect: 'follow',
        });
        if (response.status !== 200)
          throw new Error(
            `Unexpected download status ${response.status}: ${file}`
          );
        if (response.headers.get('content-type')?.includes('text/html'))
          throw new Error(`Download returned HTML instead of a file: ${file}`);
        const size = response.headers.get('content-length');
        if (size && Number(size) !== assetSizes[file])
          throw new Error(
            `Download size differs from the official release: ${file}`
          );
      })
    );
  }
  return {
    status: 'passed',
    version: manifest.version,
    latestVersion: latest.tag_name.slice(1),
    checkedAt: now().toISOString(),
    checkedFiles: files.length,
    method:
      'Official release metadata and HTTP HEAD for every listed asset, including SHA256SUMS.txt. This is not a malware scan.',
    assetSizes,
  };
}

async function main() {
  const write = process.argv.includes('--write');
  await rm(new URL('artifacts/release-check.json', root), { force: true });
  if (write)
    await Promise.all([
      rm(snapshot, { force: true }),
      rm(publicReport, { force: true }),
    ]);
  const manifest = JSON.parse(
    await readFile(new URL('src/content/photocraft-release.json', root), 'utf8')
  );
  const report = await checkRelease(manifest, {
    token: process.env.GITHUB_TOKEN,
  });
  const data = JSON.stringify(report, null, 2) + '\n';
  await mkdir(new URL('artifacts/', root), { recursive: true });
  await writeFile(new URL('artifacts/release-check.json', root), data);
  if (write) {
    await mkdir(new URL('src/generated/', root), { recursive: true });
    await Promise.all([
      writeFile(snapshot, data),
      writeFile(publicReport, data),
    ]);
  }
  console.log(
    `Release check passed: v${report.version}, ${report.checkedFiles} files, ${report.checkedAt}`
  );
  if (process.env.GITHUB_STEP_SUMMARY) {
    await writeFile(
      process.env.GITHUB_STEP_SUMMARY,
      `## PhotoCraft release check\n\nPassed: v${report.version}; ${report.checkedFiles} official assets.\n\nChecked: ${report.checkedAt}\n`,
      { flag: 'a' }
    );
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(`Release check failed: ${error.message}`);
    process.exitCode = 1;
  });
}
