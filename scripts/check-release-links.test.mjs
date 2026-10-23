import assert from 'node:assert/strict';
import test from 'node:test';

import { checkRelease, expectedFiles } from './check-release-links.mjs';
import { parseChecksums } from './release-assets.mjs';

const manifest = {
  version: '0.7.0',
  repository: 'storytold/photocraft',
  builds: Object.fromEntries(
    ['windows', 'macos', 'linux'].map((os) => [
      os,
      [{ file: `photocraft-{version}-${os}.zip` }],
    ])
  ),
};
function fixture({
  latest = 'v0.7.0',
  missing,
  html,
  sizeMismatch,
  badDigest = false,
  missingHash = false,
  status = 200,
} = {}) {
  const calls = [];
  const pinned = {
    tag_name: 'v0.7.0',
    draft: false,
    prerelease: false,
    assets: expectedFiles(manifest)
      .filter((name) => name !== missing)
      .map((name) => ({
        name,
        state: 'uploaded',
        size: 123,
        digest: `sha256:${(badDigest ? 'b' : 'a').repeat(64)}`,
        browser_download_url: `https://github.com/storytold/photocraft/releases/download/v0.7.0/${name}`,
      })),
  };
  return {
    calls,
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      if (url.endsWith('/latest')) return Response.json({ tag_name: latest });
      if (url.includes('/tags/')) return Response.json(pinned);
      if (url.endsWith('/SHA256SUMS.txt') && options.method !== 'HEAD')
        return new Response(
          expectedFiles(manifest)
            .filter(
              (name) =>
                name !== 'SHA256SUMS.txt' &&
                !(missingHash && name.includes('windows'))
            )
            .map((name) => `${'a'.repeat(64)}  ${name}`)
            .join('\n')
        );
      return new Response(null, {
        status,
        headers: {
          'content-type': html ? 'text/html' : 'application/octet-stream',
          'content-length': sizeMismatch ? '1' : '123',
        },
      });
    },
  };
}
test('all downloads and checksum must pass; API token never reaches downloads', async () => {
  const f = fixture();
  const report = await checkRelease(manifest, {
    ...f,
    token: 'dummy-test-token',
    now: () => new Date('2026-10-12T00:00:00Z'),
  });
  assert.equal(report.checkedFiles, 4);
  assert.equal(report.checkedAt, '2026-10-12T00:00:00.000Z');
  const downloads = f.calls.filter(({ url }) => url.includes('/download/'));
  assert.equal(
    report.assetHashes['photocraft-0.7.0-windows.zip'],
    'a'.repeat(64)
  );
  assert.equal(downloads.length, 5);
  assert.ok(downloads.every(({ options }) => !options.headers));
});

test('pinned builds report the actual newer release without claiming latest', async () => {
  const report = await checkRelease(manifest, {
    ...fixture({ latest: 'v0.8.0' }),
    allowPinned: true,
  });
  assert.equal(report.isLatest, false);
  assert.equal(report.latestVersion, '0.8.0');
});

test('missing or inconsistent hashes fail before publication', async () => {
  await assert.rejects(
    checkRelease(manifest, fixture({ missingHash: true })),
    /Missing SHA256/
  );
  await assert.rejects(
    checkRelease(manifest, fixture({ badDigest: true })),
    /SHA256 mismatch/
  );
  assert.throws(() => parseChecksums('bad checksum'), /Invalid/);
  assert.throws(
    () => parseChecksums(`${'a'.repeat(64)}  a.zip\n${'a'.repeat(64)}  a.zip`),
    /duplicate/
  );
});
test('new upstream version fails before publishing a fresh checked date', async () => {
  await assert.rejects(
    checkRelease(manifest, fixture({ latest: 'v0.8.0' })),
    /New official release/
  );
});
test('missing checksum fails even if installers exist', async () => {
  await assert.rejects(
    checkRelease(manifest, fixture({ missing: 'SHA256SUMS.txt' })),
    /Missing/
  );
});
test('HTML error pages cannot count as successful downloads', async () => {
  await assert.rejects(
    checkRelease(manifest, fixture({ html: true })),
    /returned HTML/
  );
});
test('unexpected file sizes fail verification', async () => {
  await assert.rejects(
    checkRelease(manifest, fixture({ sizeMismatch: true })),
    /size differs/
  );
});
test('dead download links fail after bounded retries', async () => {
  await assert.rejects(
    checkRelease(manifest, fixture({ status: 404 })),
    /HTTP 404/
  );
});
test('manifest cannot point the checker at a different host or path', () => {
  assert.throws(
    () => expectedFiles({ ...manifest, repository: 'elsewhere/repo' }),
    /Invalid/
  );
  assert.throws(
    () => expectedFiles({ ...manifest, version: '../../oops' }),
    /Invalid/
  );
});
