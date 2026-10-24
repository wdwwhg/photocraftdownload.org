import assert from 'node:assert/strict';
import test from 'node:test';

import {
  inspectPublishedRelease,
  triggerDeployHook,
  updateAutomationIssue,
  waitForPublishedRelease,
} from './release-automation.mjs';

const version = '99.0.0';
const report = {
  status: 'passed',
  version,
  latestVersion: version,
  isLatest: true,
};
const homepage = (v) =>
  Array(3)
    .fill(
      `<a href="https://github.com/storytold/photocraft/releases/download/v${v}/file.zip">Download</a>`
    )
    .join('');
const published =
  (record = report, html = homepage(version)) =>
  async (url) =>
    url.includes('release-check.json')
      ? Response.json(record)
      : new Response(html);

test('production requires both a current report and current download links', async () => {
  assert.equal(
    await inspectPublishedRelease(version, { fetchImpl: published() }),
    true
  );
  assert.equal(
    await inspectPublishedRelease(version, {
      fetchImpl: published({ ...report, version: '0.1.0' }),
    }),
    false
  );
  assert.equal(
    await inspectPublishedRelease(version, {
      fetchImpl: published(report, homepage('0.1.0')),
    }),
    false
  );
  assert.equal(
    await inspectPublishedRelease(version, {
      fetchImpl: async () => {
        throw new Error('offline');
      },
    }),
    false
  );
});
test('deployment verification retries stale output and has a bounded deadline', async () => {
  let attempts = 0;
  let elapsed = 0;
  const fetchImpl = async (url) => {
    if (url.includes('release-check.json'))
      return Response.json(
        ++attempts < 2 ? { ...report, version: '0.1.0' } : report
      );
    return new Response(homepage(version));
  };
  await waitForPublishedRelease(version, {
    fetchImpl,
    now: () => elapsed,
    sleep: async (ms) => {
      elapsed += ms;
    },
    timeout: 40000,
  });
  assert.equal(attempts, 2);
  await assert.rejects(
    waitForPublishedRelease(version, {
      fetchImpl: published({ ...report, isLatest: false }),
      now: () => elapsed,
      sleep: async (ms) => {
        elapsed += ms;
      },
      timeout: 10,
    }),
    /has not published/
  );
});
test('deploy hooks are allowlisted and errors do not expose the secret URL', async () => {
  await assert.rejects(
    triggerDeployHook('https://example.com/secret'),
    /official Cloudflare/
  );
  const hook =
    'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/dummy-test-hook';
  await assert.rejects(
    triggerDeployHook(hook, {
      fetchImpl: async () => {
        throw new Error(hook);
      },
    }),
    (error) => !error.message.includes('dummy-test-hook')
  );
  await triggerDeployHook(hook, {
    fetchImpl: async (_, options) => {
      assert.equal(options.method, 'POST');
      assert.equal(options.redirect, 'error');
      return Response.json({ success: true });
    },
  });
});
test('failure reporting updates one managed issue and closes it on recovery', async () => {
  const calls = [];
  const existing = {
    number: 7,
    title: '[PhotoCraft releases] Automatic update needs attention',
    body: '<!-- photocraft-release-automation -->',
  };
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return Response.json(options.method ? {} : [existing]);
  };
  const context = { token: 'dummy-test-token', runId: '123', fetchImpl };
  await updateAutomationIssue('failure', context);
  assert.equal(calls[1].options.method, 'PATCH');
  assert.ok(calls[1].url.endsWith('/issues/7'));
  await updateAutomationIssue('success', context);
  assert.equal(JSON.parse(calls[3].options.body).state, 'closed');
});
test('first failures create an issue; healthy runs never open an issue', async () => {
  const calls = [];
  const fetchImpl = async (_, options) => {
    calls.push(options);
    return Response.json(options.method ? {} : []);
  };
  const context = { token: 'dummy-test-token', runId: '123', fetchImpl };
  await updateAutomationIssue('success', context);
  assert.equal(calls.length, 1);
  await updateAutomationIssue('failure', context);
  assert.equal(calls[2].method, 'POST');
  assert.ok(JSON.parse(calls[2].body).body.includes('/actions/runs/123'));
});
