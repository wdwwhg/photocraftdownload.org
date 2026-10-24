# PhotoCraft v0.15.1 download update — 24 October 2026

The current catalog is v0.15.1, published by storytold/photocraft at 2026-10-23T22:44:33Z (24 October 2026, 06:44 Singapore time).

## Download data

- The homepage, chooser, platform cards, installation buttons, page metadata and softwareVersion use the shared v0.15.1 manifest.
- All 23 desktop packages have exact bytes, MiB and complete SHA256 values generated from the official SHA256SUMS.txt. The checker cross-checks GitHub asset digests and follows HTTP HEAD redirects for all 23 packages and the checksum list.
- English and Chinese Windows, macOS and Linux guides use current download links and command examples. The public release-check.json and generated rendering data are written together by the checker.
- The version archive adds v0.15.1 with its official publication time, source-linked changes and 23 checksum-generated file records. Older releases retain their original hashes.

## Status and existing evidence

The v0.15.1 README still explicitly labels PhotoCraft early alpha. The homepage retains that status with a link to the versioned official README; a 0.15.x version number alone does not establish maturity.

Windows screenshots, the PSD editing exercise and the Microsoft Defender MSI scan still describe their actual v0.14.0 files. The safety page explicitly distinguishes the v0.15.1 download catalog from those historical checks. No screenshot, editing result or malware scan has been relabeled as a v0.15.1 test.

## Validation

- Release checker: official metadata, SHA256SUMS.txt and HTTP responses for all 24 configured assets.
- Release failure-handling tests: missing assets, malformed/missing/mismatched hashes, stale versions, HTML errors, wrong file sizes and failed responses.
- Rendered page checker: both homepage tables, platform tables, archive rows, all active English/Chinese guide download versions, original evidence hashes, and public/generated report agreement. Historical review checksum citations remain tied to the tested version.
- Production build passed. All 9 release-check tests passed. The rendered download check passed with 23 current rows and 179 historical file records; the search-policy check passed for 48 English/Chinese pages and 18 sitemap URLs.
- Three complete official downloads were streamed and hashed locally: Windows x64 MSI (73,039,872 bytes), macOS Universal DMG (95,834,266 bytes) and Linux x86_64 AppImage (81,381,880 bytes). Returned filenames, exact byte counts and all SHA256 characters matched. Results are saved in `artifacts/release-download-samples.json`; these byte checks are not malware scans.
- Full history verification passed for all 9 releases and 188 download/checksum links, including official release dates, changelog sources, filenames, sizes and SHA256 values.

The existing prebuild latest-version guard remains enabled. If a newer upstream version appears, the build requires another reviewed update.

Prepared for GitHub and Cloudflare Pages publication together with the Windows page and full download file catalog updates. Production checks must confirm the published version and catalog after deployment.
