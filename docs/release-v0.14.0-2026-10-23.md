# PhotoCraft v0.14.0 download update — 23 October 2026

The current download catalog is v0.14.0, published upstream at 2026-10-23T00:43:42Z. The homepage title, softwareVersion structured data, chooser, platform tables, installation examples and versioned documentation references use this release.

## Files and history

- 23 current package records: six Windows packages (x64, ARM64 and x86, each MSI and Portable ZIP); macOS Universal DMG and CLI ZIP; 15 Linux packages. Linux includes AppImage, Flatpak, DEB, RPM, tar.gz and Arch .pkg.tar.zst where published for the relevant architecture.
- Every listed package has an official direct URL, exact bytes and full SHA256. The verifier reads the release's SHA256SUMS.txt, compares GitHub asset digests and follows HEAD requests for all 24 configured assets including the checksum list.
- The archive retains v0.9.0 and adds v0.10.0, v0.11.1, v0.12.0, v0.13.0 and v0.14.0. Eight releases have source-linked summaries, publication dates and 156 package records; 164 download/checksum links were verified.
- Original v0.9.0 application captures, PSD and MSI scan remain available. Their capture record is `public/imgs/photocraft/captures/capture-record-0.9.0.json`; the archive links to it. No old screenshot has been relabeled as v0.14.0.

## Repeated Windows test

The official x64 Portable ZIP was downloaded and its SHA256 matched `5b814c15034ddc68d35da837aef0cec18c90e9325f7682f516dfc331d64e9ab0`. About reports 0.14.0, commit ff4738810, build date 2026-10-23.

On Windows 11 25H2 (26200.9711), RTX 4060 Laptop GPU, the initial automatic-backend start did not finish. A retry automatically selected DX12; System Info records that fallback and driver 31.0.15.3197. This is recorded on the review and Windows guide rather than presented as a clean first launch.

The test opened the original 1200 × 800 PNG, duplicated its pixel layer, added Levels at RGB midtone 1.10, saved a new PSD, closed it and reopened through File → Open. Both pixel layers and Levels remained; the adjustment displayed 1.1. The new PSD, three original JPEG screenshots, compressed WebP previews and file hashes are published under `public/imgs/photocraft/captures/`. The current `capture-record.json` identifies this run.

No macOS/Linux execution, MSI installation, x86/ARM64 execution, complex PSD, export or Adobe round-trip result is claimed.

The official Windows x64 MSI was separately downloaded and its hash matched `a25a2a15c85dd0563f817e206da125ef594a7c8020f34301c1ff67767b2b8d6f`. Microsoft Defender custom-file scanning with remediation disabled returned exit code 0 and found no threats at 2026-10-23T14:10:40Z. The report retains the engine, signature and original output. This covers that MSI, not every release package.

## Preventing recurrence

Development and production builds now require the configured version to match GitHub's latest stable release. The build no longer passes `--allow-pinned`. The daily workflow can still record old-package availability after reporting that an update is due, and continues to fail its latest-version check.

The rendered download checker now checks both languages, current direct-link versions, catalog/latest-version agreement, retained v0.9.0 archive records, matching scan/capture hashes, original screenshot bytes and the new saved PSD.

## Validation commands

```text
node --test scripts/check-release-links.test.mjs
node scripts/check-release-links.mjs --write
node scripts/check-version-history.mjs --write
NITRO_PRESET=cloudflare_pages pnpm build
node scripts/check-download-pages.mjs http://localhost:4173
node scripts/check-search-policy.mjs http://localhost:4173
```

This source update has not been committed, pushed or deployed by this task.
