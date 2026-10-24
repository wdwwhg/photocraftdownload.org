import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { expectedFiles } from './check-release-links.mjs';
import { remarkCurrentRelease } from './remark-current-release.mjs';
import {
  nextManifest,
  planReleaseUpdate,
  releaseMaturity,
} from './update-photocraft-release.mjs';

const current = JSON.parse(
  readFileSync(
    new URL('../src/content/photocraft-release.json', import.meta.url),
    'utf8'
  )
);
const version = '99.0.0';
const history = {
  releases: [
    {
      version: current.version,
      files: [{ file: 'original-evidence.zip', sha256: 'b'.repeat(64) }],
    },
  ],
};
function fixture({
  target = version,
  missingHash = false,
  badDigest = false,
  missingAsset,
  extra = false,
  readme = 'Status: early alpha',
} = {}) {
  const base = `https://github.com/storytold/photocraft/releases/download/v${target}/`;
  const names = expectedFiles({ ...current, version: target });
  if (extra) names.push(`photocraft-${target}-linux-riscv64.AppImage`);
  const metadata = {
    tag_name: `v${target}`,
    draft: false,
    prerelease: false,
    published_at: '2026-10-24T00:00:00Z',
    html_url: `https://github.com/storytold/photocraft/releases/tag/v${target}`,
    body: `https://github.com/storytold/photocraft/compare/v${current.version}...v${target}`,
    assets: names
      .filter((name) => name !== missingAsset)
      .map((name) => ({
        name,
        size: 123,
        state: 'uploaded',
        digest: `sha256:${(badDigest ? 'b' : 'a').repeat(64)}`,
        browser_download_url: base + name,
      })),
  };
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    if (url.startsWith('https://api.github.com/'))
      return Response.json(metadata);
    if (url.startsWith('https://raw.githubusercontent.com/'))
      return new Response(readme);
    if (url.endsWith('SHA256SUMS.txt') && options.method !== 'HEAD')
      return new Response(
        names
          .filter(
            (name) =>
              name !== 'SHA256SUMS.txt' &&
              !(missingHash && name.includes('windows-x64.msi'))
          )
          .map((name) => `${'a'.repeat(64)}  ${name}`)
          .join('\n')
      );
    return new Response(null, {
      headers: {
        'content-type': 'application/octet-stream',
        'content-length': '123',
      },
    });
  };
  return { metadata, fetchImpl, calls };
}

test('new releases generate complete hashes and history without relabeling evidence', async () => {
  const f = fixture();
  const result = await planReleaseUpdate(current, history, {
    ...f,
    token: 'dummy-test-token',
    now: () => new Date('2026-10-24T01:00:00Z'),
  });
  assert.equal(result.changed, true);
  assert.equal(result.manifest.version, version);
  assert.equal(
    result.history.releases[0].files.length,
    expectedFiles(current).length - 1
  );
  assert.ok(
    result.history.releases[0].files.every(
      (file) =>
        file.sha256 === 'a'.repeat(64) &&
        file.bytes === 123 &&
        file.file.includes(version)
    )
  );
  assert.deepEqual(result.history.releases[1], history.releases[0]);
  assert.equal(current.version === version, false);
  assert.equal(result.manifest.maturity, 'early-alpha');
  assert.ok(
    f.calls
      .filter(({ url }) => !url.startsWith('https://api.github.com/'))
      .every(({ options }) => !options.headers?.Authorization)
  );
});
test('a no-change run preserves the history and existing evidence', async () => {
  const result = await planReleaseUpdate(
    current,
    history,
    fixture({ target: current.version })
  );
  assert.equal(result.changed, false);
  assert.deepEqual(result.manifest, current);
  assert.equal(result.history, history);
});
test('incomplete uploads, checksum errors and digest disagreements block an update', async () => {
  const name = expectedFiles({ ...current, version })[0];
  await assert.rejects(
    planReleaseUpdate(current, history, fixture({ missingAsset: name })),
    /incomplete/
  );
  await assert.rejects(
    planReleaseUpdate(current, history, fixture({ missingHash: true })),
    /Missing SHA256/
  );
  await assert.rejects(
    planReleaseUpdate(current, history, fixture({ badDigest: true })),
    /SHA256 mismatch/
  );
  assert.equal(history.releases.length, 1);
});
test('new supported packages are added with a history cutoff', async () => {
  const result = await planReleaseUpdate(
    current,
    history,
    fixture({ extra: true })
  );
  const added = result.manifest.builds.linux.find((file) =>
    file.file.endsWith('riscv64.AppImage')
  );
  assert.equal(added.since, version);
  assert.ok(
    result.history.releases[0].files.some((file) =>
      file.file.endsWith('riscv64.AppImage')
    )
  );
});
test('drafts, prereleases, foreign URLs, unsafe tags and rollbacks cannot be promoted', () => {
  const { metadata } = fixture();
  for (const change of [
    { draft: true },
    { prerelease: true },
    { tag_name: 'v99.0.0; unsafe' },
    { html_url: 'https://example.com/release' },
  ])
    assert.throws(
      () => nextManifest(current, { ...metadata, ...change }),
      /Latest/
    );
  assert.throws(
    () => nextManifest(current, fixture({ target: '0.1.0' }).metadata),
    /downgrade/
  );
  const foreign = structuredClone(metadata);
  foreign.assets[0].browser_download_url = 'https://example.com/file';
  assert.throws(() => nextManifest(current, foreign), /incomplete/);
});
test('maturity follows explicit upstream status and falls back without inventing a status', () => {
  assert.equal(releaseMaturity('Status: beta'), 'beta');
  assert.equal(releaseMaturity('Status: stable'), 'stable');
  assert.equal(
    releaseMaturity('A release with no status declaration'),
    'unknown'
  );
});
test('current-version placeholders expand only marked prose, links and commands', () => {
  const tree = {
    type: 'root',
    children: [
      { type: 'text', value: 'v%CURRENT_VERSION%' },
      { type: 'code', value: 'photocraft-%CURRENT_VERSION%-windows-x64.msi' },
      {
        type: 'link',
        url: 'https://example.com/v%CURRENT_VERSION%',
        children: [],
      },
      { type: 'mdxjsEsm', value: 'const historical = "%CURRENT_VERSION%"' },
      { type: 'text', value: 'Tested v0.14.0' },
    ],
  };
  remarkCurrentRelease({ version })(tree);
  assert.equal(tree.children[0].value, `v${version}`);
  assert.equal(tree.children[1].value, `photocraft-${version}-windows-x64.msi`);
  assert.equal(tree.children[2].url, `https://example.com/v${version}`);
  assert.equal(
    tree.children[3].value,
    'const historical = "%CURRENT_VERSION%"'
  );
  assert.equal(tree.children[4].value, 'Tested v0.14.0');
});
