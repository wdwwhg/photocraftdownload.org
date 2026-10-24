import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import {
  catalogRelease,
  classifyFile,
  syncCatalog,
} from './download-catalog.mjs';

function fixture() {
  const tag = 'v0.1.1-rc.4';
  const name = 'photocraft-0.1.1-rc.4-windows-x64.wixpdb';
  const text = `${'a'.repeat(64)}  ${name}\n`;
  const digest = createHash('sha256').update(text).digest('hex');
  const metadata = {
    tag_name: tag,
    published_at: '2026-01-01T00:00:00Z',
    draft: false,
    prerelease: false,
    html_url: `https://github.com/storytold/photocraft/releases/tag/${tag}`,
    assets: [
      { name, size: 123, digest: `sha256:${'a'.repeat(64)}` },
      {
        name: 'SHA256SUMS.txt',
        size: Buffer.byteLength(text),
        digest: `sha256:${digest}`,
      },
    ].map((asset) => ({
      ...asset,
      state: 'uploaded',
      browser_download_url: `https://github.com/storytold/photocraft/releases/download/${tag}/${asset.name}`,
    })),
  };
  const fetchImpl = async (url, options) =>
    options.method === 'HEAD'
      ? new Response(null, {
          headers: {
            'content-length': String(
              metadata.assets.find(
                (asset) => asset.browser_download_url === url
              )?.size
            ),
          },
        })
      : new Response(text);
  return { metadata, fetchImpl, digest };
}
test('catalog covers auxiliary files and labels RC versions even if upstream prerelease flag is false', async () => {
  const { metadata, fetchImpl, digest } = fixture();
  const release = await catalogRelease(metadata, { fetchImpl });
  assert.equal(release.prerelease, true);
  assert.equal(release.files.length, 2);
  assert.equal(
    release.files.find((file) => file.file === 'SHA256SUMS.txt').sha256,
    digest
  );
  assert.equal(
    release.files.find((file) => file.name === 'Debug symbols').platform,
    'windows'
  );
  assert.equal(classifyFile('photocraft-web-0.15.1.zip').name, 'Web ZIP');
  assert.equal(
    classifyFile('photocraft-0.15.1-freebsd-aarch64.tar.gz').architecture,
    'aarch64'
  );
  assert.equal(
    classifyFile('photocraft-0.15.1-linux-x86_64.AppImage.zsync').name,
    'AppImage update metadata'
  );
});
test('rejects files missing from official checksums and mismatched digests', async () => {
  const { metadata, fetchImpl } = fixture();
  metadata.assets[0].digest = `sha256:${'b'.repeat(64)}`;
  await assert.rejects(
    catalogRelease(metadata, { fetchImpl }),
    /SHA256 mismatch/
  );
  metadata.assets[0].name = 'unlisted.zip';
  metadata.assets[0].browser_download_url = `https://github.com/storytold/photocraft/releases/download/${metadata.tag_name}/unlisted.zip`;
  await assert.rejects(
    catalogRelease(metadata, { fetchImpl }),
    /Missing SHA256/
  );
});
test('rejects changed checksum-list bytes and unofficial download destinations', async () => {
  const { metadata, fetchImpl } = fixture();
  metadata.assets[1].digest = `sha256:${'c'.repeat(64)}`;
  await assert.rejects(
    catalogRelease(metadata, { fetchImpl }),
    /Checksum list digest mismatch/
  );
  metadata.assets[0].browser_download_url = 'https://example.org/installer.zip';
  await assert.rejects(
    catalogRelease(metadata, { fetchImpl }),
    /Invalid official asset/
  );
});

test('full sync retains verified releases only when every official asset still matches', async () => {
  const { metadata, fetchImpl } = fixture();
  const previous = await catalogRelease(metadata, { fetchImpl });
  let downloads = 0;
  const syncFetch = async (url, options) => {
    if (url.startsWith('https://api.github.com/'))
      return Response.json([metadata]);
    downloads++;
    return fetchImpl(url, options);
  };
  const result = await syncCatalog({
    existing: { releases: [previous] },
    fetchImpl: syncFetch,
  });
  assert.equal(result.releases.length, 1);
  assert.equal(downloads, 0);
  // A changed asset must be rechecked rather than silently copying the old row.
  metadata.assets[0].digest = `sha256:${'b'.repeat(64)}`;
  await assert.rejects(
    syncCatalog({ existing: { releases: [previous] }, fetchImpl: syncFetch }),
    /SHA256 mismatch/
  );
  assert.ok(downloads > 0);
});
