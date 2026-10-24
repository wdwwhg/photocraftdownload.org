# PhotoCraft download file catalog

Implemented `/photocraft-download-files` and its Chinese translation. The English page is indexable, self-canonical, included in the sitemap and linked from the homepage, Windows, GitHub, safety and version history pages. The existing policy keeps Chinese guides noindex.

The checked snapshot contains all 17 public GitHub releases and 396 attached assets, including v0.1.0, the two v0.1.1 release candidates, and current v0.15.1. It includes desktop builds, FreeBSD, Web, AppImage zsync files, Windows installer debugging symbols and SHA256SUMS.txt. GitHub's automatically generated source archives are explicitly outside the binary asset catalog.

`scripts/download-catalog.mjs --write` discovers all release API pages, reads each version's official checksum list, compares asset digests, and checks each asset URL's response byte size. SHA256SUMS.txt is hashed from its actual downloaded bytes. The initial run verified all 396 URLs and their sizes. A separate comparison confirmed every catalog record against the saved official API response.

Each version has an anchor, and each filename has a row permalink. All filename, exact byte size, rounded MiB, SHA256, official direct link and purpose text are server-rendered. No client script or filter is required to expose the data. The page includes exact filename search guidance and verification commands. Version history retains editorial change summaries and sends full-file lookups to the matching catalog version.

The release updater syncs the complete public release list when the current version changes, so intermediate releases between checks are included too. It reuses an existing record only when all official asset names, sizes, URLs and digests still agree. New or changed assets pass checksum and delivery checks before source files are written. The workflow stages the catalog alongside the manifest and historical release data.

Local checks: 25 release/catalog automation tests passed. The final production build passed. Rendered checks passed for 50 pages and 19 sitemap URLs, including all 396 catalog rows in both languages, complete SHA256 values, exact byte counts, history links and current-download consistency. Browser checks confirmed 17 tables, no page overflow, readable column widths, version navigation and the exact Windows x64 MSI row permalink. Table content scrolls horizontally inside its own region.

Prepared for GitHub and Cloudflare Pages publication with the six-hour release updater. Verify the published version, catalog and workflow after deployment. No Google indexing or ranking outcome is claimed.
