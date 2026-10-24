import { appendFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const origin = 'https://photocraftdownload.org';
const repository = 'wdwwhg/photocraftdownload.org';
const issueTitle = '[PhotoCraft releases] Automatic update needs attention';
const issueMarker = '<!-- photocraft-release-automation -->';
const validateVersion = (version) => {
  if (!/^\d+\.\d+\.\d+$/.test(version))
    throw new Error('Invalid expected version');
};

export async function inspectPublishedRelease(
  version,
  { fetchImpl = fetch } = {}
) {
  validateVersion(version);
  try {
    const options = {
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(15000),
      redirect: 'error',
    };
    const reportResponse = await fetchImpl(
      `${origin}/release-check.json?release=${version}&check=${Date.now()}`,
      options
    );
    if (!reportResponse.ok) return false;
    const report = await reportResponse.json();
    if (
      report.status !== 'passed' ||
      report.version !== version ||
      report.latestVersion !== version ||
      report.isLatest !== true
    )
      return false;
    const response = await fetchImpl(
      `${origin}/?release=${version}&check=${Date.now()}`,
      { ...options, signal: AbortSignal.timeout(15000) }
    );
    if (!response.ok) return false;
    const html = await response.text();
    const downloads = [
      ...html.matchAll(
        /href="https:\/\/github\.com\/storytold\/photocraft\/releases\/download\/v([^/]+)\//g
      ),
    ];
    return (
      downloads.length >= 3 && downloads.every(([, found]) => found === version)
    );
  } catch {
    return false;
  }
}

export async function triggerDeployHook(hook, { fetchImpl = fetch } = {}) {
  let url;
  try {
    url = new URL(hook);
  } catch {
    throw new Error('CLOUDFLARE_PAGES_DEPLOY_HOOK is missing or invalid');
  }
  if (
    url.origin !== 'https://api.cloudflare.com' ||
    !/^\/client\/v4\/pages\/webhooks\/deploy_hooks\/[a-zA-Z0-9-]+$/.test(
      url.pathname
    ) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw new Error('Expected an official Cloudflare Pages deploy hook');
  // The hook URL is a secret: never log the URL, body or raw network error.
  try {
    const response = await fetchImpl(hook, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok || (await response.json()).success !== true)
      throw new Error();
  } catch {
    throw new Error(
      'Cloudflare Pages rejected the deployment trigger; check the configured hook'
    );
  }
}

export async function waitForPublishedRelease(
  version,
  {
    fetchImpl = fetch,
    now = () => Date.now(),
    sleep = (ms) => new Promise((done) => setTimeout(done, ms)),
    timeout = 15 * 60 * 1000,
  } = {}
) {
  validateVersion(version);
  const deadline = now() + timeout;
  let attempts = 0;
  do {
    if (await inspectPublishedRelease(version, { fetchImpl })) return;
    if (++attempts % 3 === 0)
      console.log(`Waiting for production v${version} (${attempts} checks)`);
    if (now() >= deadline) break;
    await sleep(Math.min(20000, deadline - now()));
  } while (now() <= deadline);
  throw new Error(
    `Production has not published verified v${version} within the deployment window`
  );
}

export async function updateAutomationIssue(
  state,
  { token, runId, fetchImpl = fetch } = {}
) {
  if (
    !['success', 'failure'].includes(state) ||
    !/^\d+$/.test(runId ?? '') ||
    !token
  )
    throw new Error('Missing issue reporting context');
  const api = `https://api.github.com/repos/${repository}/issues`;
  const request = async (url, options = {}) => {
    const response = await fetchImpl(url, {
      ...options,
      redirect: 'error',
      signal: AbortSignal.timeout(20000),
      headers: {
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'photocraft-release-updater',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok)
      throw new Error(`Issue reporting failed: HTTP ${response.status}`);
    return response.json();
  };
  const issues = await request(`${api}?state=open&per_page=100`);
  const managed = issues.find(
    (issue) =>
      !issue.pull_request &&
      issue.title === issueTitle &&
      issue.body?.includes(issueMarker)
  );
  if (state === 'success') {
    if (managed)
      await request(`${api}/${managed.number}`, {
        method: 'PATCH',
        body: JSON.stringify({ state: 'closed', state_reason: 'completed' }),
      });
    return;
  }
  const body = `${issueMarker}\nThe automatic PhotoCraft release update or production verification failed. The next scheduled run will retry; the last successful production deployment remains available.\n\n[Inspect the workflow logs](https://github.com/${repository}/actions/runs/${runId}).\n\nThe updater checks the official latest tag, every required asset, SHA256SUMS.txt, GitHub asset digests, the production build and the published download links. This issue is updated instead of opening duplicates and closes after production verification succeeds.`;
  await request(managed ? `${api}/${managed.number}` : api, {
    method: managed ? 'PATCH' : 'POST',
    body: JSON.stringify(managed ? { body } : { title: issueTitle, body }),
  });
}

async function main() {
  const command = process.argv[2];
  if (command === 'report') {
    if (process.env.GITHUB_REPOSITORY !== repository)
      throw new Error('Issue reporter is limited to the production repository');
    await updateAutomationIssue(process.argv[3], {
      token: process.env.GITHUB_TOKEN,
      runId: process.env.GITHUB_RUN_ID,
    });
    return;
  }
  const manifest = JSON.parse(
    await readFile(
      new URL('../src/content/photocraft-release.json', import.meta.url),
      'utf8'
    )
  );
  const version = manifest.version;
  validateVersion(version);
  if (command === 'probe') {
    const current = await inspectPublishedRelease(version);
    if (process.env.GITHUB_OUTPUT)
      await appendFile(process.env.GITHUB_OUTPUT, `needs_deploy=${!current}\n`);
    console.log(
      current
        ? `Production already serves v${version}`
        : `Production needs verified v${version}`
    );
  } else if (command === 'deploy') {
    await triggerDeployHook(process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK);
    console.log(`Triggered production build for v${version}`);
  } else if (command === 'verify') {
    await waitForPublishedRelease(version);
    console.log(`Production verified: v${version}`);
  } else throw new Error('Expected probe, deploy, verify or report');
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
