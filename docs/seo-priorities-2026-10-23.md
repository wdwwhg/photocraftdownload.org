# Download and search improvements — 23 October 2026

Implementation record for the 23 October release. Publication is tracked by the repository's commit and Cloudflare deployment history. Ranking, CTR, crawl and indexation targets are outcomes to measure after publication, not results established by a build.

## Implemented

- Homepage: server-rendered HTML table of all 19 reviewed desktop/CLI packages, platform, architecture, delivery, direct filename links, exact bytes, MiB and full SHA256. The chooser remains inside an optional disclosure. All file links are available without JavaScript.
- Homepage: contextual platform links with PhotoCraft download anchors, safety and troubleshooting links, and an internal version-history link.
- Windows: H1 “PhotoCraft for Windows Download,” Windows 11 architecture section, six direct downloads and hash/size evidence.
- Linux: positioned as a builds and installation reference; file table, distribution matrix, actual documented Flatpak commands and explicit absence of Linux execution evidence. No invented FUSE fix, terminal output or screenshots.
- macOS: direct DMG and CLI ZIP table and links to verification/troubleshooting.
- History: English page indexable again; per-version jump navigation, dates, source-linked changes, tag links, 19 filenames with sizes and hashes per version. Selected archive covers v0.7.0, v0.8.2 and v0.9.0, not every later release.
- New pages: `/is-photocraft-safe` and `/photocraft-installer-not-working`, with platform links, self canonicals, metadata, related guides and sitemap entries.
- Free/alternatives: task-based “free Photoshop alternative with PSD support” sections distinguish the recorded simple PSD exercise from an Adobe handoff test.
- No new language was introduced. Existing Chinese routes retain the site's English-first indexing policy.

## Actual Search Console findings

Source: the user's signed-in Search Console Page indexing report for `sc-domain:photocraftdownload.org`, read on 23 October 2026. The UI displayed “Last update: 10/16/26.” It showed 38 indexed URLs and 11 excluded URLs: 7 discovered, 1 crawled, and 3 redirects. This is a report snapshot, not a live URL Inspection result for every URL.

| URL path                     | Reported reason                   | Action in this change                                                                     |
| ---------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------- |
| `/lightcraft`                | Discovered, currently not indexed | HTTP 404; remove recommendations and replace article links with the official product page |
| `/vectorcraft`               | Discovered, currently not indexed | HTTP 404; useful task distinction retained in alternatives                                |
| `/photocraft-vs-vectorcraft` | Discovered, currently not indexed | HTTP 404; raster/vector/RAW task guidance consolidated into alternatives                  |
| `/photocraft-web`            | Discovered, currently not indexed | HTTP 404; direct readers to official web packaging documentation                          |
| `/zh/lightcraft`             | Discovered, currently not indexed | HTTP 404 with the retired topic                                                           |
| `/zh/photocraft-web`         | Discovered, currently not indexed | HTTP 404 with the retired topic                                                           |
| `/zh/photocraft-tutorial`    | Discovered, currently not indexed | Retain accessible, `noindex,follow`; prioritize the English tutorial                      |
| `/zh/photocraft-app`         | Crawled, currently not indexed    | Retain accessible, `noindex,follow`; prioritize the English app guide                     |

The same four retired topics also return 404 in both existing languages. Source MDX is retained for recovery. Related cards and sitemap exclude retired topics. Contextual article links no longer point to the retired routes. The unrelated products' official pages remain useful outbound references.

No Validate Fix, Request Indexing, removal request or sitemap submission was performed. Google must recrawl before its reason counts change. The two intentionally excluded Chinese URLs should not be counted as English indexing failures. Normal redirect exclusions also remain separate from content that needs indexing.

## Verification evidence

- Official latest release observed: v0.14.0. The site still reviews v0.9.0 because its existing instructions and recorded test use that version. Homepage wording now identifies the reviewed version and links to the newer official release. No old screenshot is relabelled as a new-version test.
- Latest build verifier: official asset metadata, SHA256SUMS.txt, GitHub digest comparison where available, and HTTP HEAD checks for 20 assets including the checksum file. It does not claim to scan package contents.
- Historical verifier: 60 download responses across the three reviewed release tags, with dates, change sources, byte sizes and SHA256 checked.
- Real antivirus scan: official v0.9.0 Windows x64 MSI, 69,443,584 bytes, SHA256 `785c81a5fc78c9b683b0f9e6653c38f95b306a38303f60b391670a9e1ac590d4`.
- Scan completed 23 October 2026, 19:28 Singapore time. Microsoft Defender product 4.18.26090.9, engine 1.1.26090.9, signature 1.461.161.0. Exit 0; original output says it found no threats. Remediation was disabled; installer was not executed. This covers one file and one point in time.
- Original scan record: `public/photocraft-security-scan.json`; source-rendered copy: `src/content/photocraft-security-scan.json`.
- Successful link snapshots are retained with actual timestamps. The old 16 October record is preserved with its original method; missing days are not invented. Workflow run artifacts remain the source for later successes or failures.

Builds use the explicit `--allow-pinned` mode to publish the reviewed version while recording the actual latest version. The default `releases:check` still fails when a newer release exists. The daily workflow records pinned-file availability, uploads its evidence and still marks the job failed when its latest-release check fails. Workflow changes take effect only after they are pushed to the workflow's repository branch.

## Remaining work

- Actual MSI installation-error, SmartScreen, macOS Gatekeeper and Linux FUSE screenshots. Only the existing Windows portable application's About, System Info and simple PSD exercise are recorded. The new pages state these limits.
- Linux distribution/package execution and a real Flatpak terminal-output capture. The current Linux page is a documentation-based reference.
- Review and test v0.14.0 or a subsequent official release before moving version-specific instructions and screenshots forward.
- External community submissions and answers: prepare using `outreach-preparation-2026-10-23.md`; nothing has been posted from this change.
- Measure GSC after deployment using equal date windows: the user targets top 8 for the main download term, top 5 for Windows/history, top 3 for Flatpak, impressions for the new pages, and a lower homepage/brand click share. Monitor platform clicks alongside click shares, so a drop in homepage clicks alone is not mistaken for growth.

## Checks

- `pnpm build`: passed, including the live official file precheck in pinned-version mode.
- Release verifier unit tests: 9 passed, including newer-release handling, missing/mismatched SHA256, dead links, HTML responses and size mismatches.
- `node scripts/check-search-policy.mjs http://127.0.0.1:3100`: passed all 48 page variants, 8 retired-topic 404 responses, robots meta/headers, self canonicals, homepage priorities, crawl access and exactly 18 matching runtime/static sitemap URLs.
- `node scripts/check-download-pages.mjs http://127.0.0.1:3100`: passed 19 raw-HTML homepage rows, all three platform tables and 57 historical package records, including every full hash and exact byte count. Raw HTML was checked after removing scripts, so values cannot pass solely because they appear in hydration data.
- Browser: desktop download and safety pages inspected; narrow homepage and Windows page had no document-level horizontal overflow. Download tables retain their own horizontal scrolling region. All 19 homepage hashes had 64 hexadecimal characters, and the Windows table had all six files.
- Chooser: Windows → Intel/AMD 64-bit → Portable selected the correct official x64 Portable ZIP URL and 79.3 MiB size.
- Clean in-app browser: no page errors on the homepage. The user's Chrome extension environment reported an injected listener error and a React hydration warning; neither appeared in the clean browser.
- `git diff --check`: passed. These implementation checks were completed before the release was committed and deployed. No external community post was performed.
