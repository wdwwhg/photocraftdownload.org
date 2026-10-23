# English content consolidation — 18 October 2026

English is the primary search language. All Chinese routes remain accessible
with `noindex,follow`. The seven reference guides in
`src/content/search-policy.json` also remain accessible with `noindex,follow`.
They are excluded from the sitemap, homepage recommendations and related-guide
cards. Contextual links within articles may still lead to them when useful.
Self canonicals are retained; hreflang references to excluded translations are
removed. Crawling is allowed so search engines can observe the noindex.

The homepage and nine priority English guides now link their instructions to
the available evidence. The tutorial reproduces the recorded exercise; Free
defines its verified scope; Alternatives and vs Photoshop distinguish feature
documentation from observed behavior. Version-specific sources use v0.9.0.

## Existing evidence

- Capture date: 15 October 2026, not the editorial update date.
- Windows 11 25H2 x64, RTX 4060 Laptop GPU, Vulkan.
- PhotoCraft 0.9.0 x64 Portable; About commit c699e3cda.
- Original 1200 × 800 PNG; duplicate pixel layer; Levels midtone 1.10;
  save, close and reopen a three-layer PSD.
- Three original PNG screenshots, WebP previews, source artwork, saved PSD,
  package hash and capture hashes under `public/imgs/photocraft/captures/`.

## Evidence still required before claiming every priority page has a local test

| Page / task                 | Missing material                                    | Acceptance record                                                                                                                                                                            |
| --------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| macOS                       | Actual DMG installation and application screenshots | macOS version, CPU family, DMG checksum, Applications copy, first launch, About and System Info, saved sample reopened with three layers and 1.10; record Intel and Apple silicon separately |
| Linux                       | Actual installation and application screenshots     | Distribution, architecture, package format, X11/Wayland session, About and System Info, sample save/reopen result; record each tested package separately                                     |
| vs Photoshop / Alternatives | Adobe handoff and equivalent competitor exercises   | Versions, original and saved files, layer/adjustment inspection, reference render and any differences                                                                                        |
| Windows MSI                 | Installer run                                       | Installer version and checksum, install result, launch and document exercise                                                                                                                 |

Do not label Windows captures as Mac/Linux evidence or add generated app
screenshots. The public Mac/Linux guides explicitly disclose the missing tests
and provide a sample-based acceptance checklist. No new application test was
performed on 18 October.

## Verification

After `pnpm build`, start the built server and run:

```sh
node scripts/check-search-policy.mjs http://localhost:3000
```

The check covers all 44 homepage/guide language variants, robots meta and
headers, self canonicals, excluded hreflang, homepage recommendations, identical
runtime/static sitemaps, and crawl access. Search engine removal requires a
recrawl after deployment; local checks do not establish Google index status.

Results on 18 October: Vite client/server production compilation passed using
the already-published v0.9.0 verification cache dated 16 October. All 44 rendered
page checks and the seven release-checker unit tests passed. Browser checks of
the Free table, tutorial capture and homepage exercise covered desktop and
390-pixel mobile layouts.

The standard build lifecycle is blocked by the existing release guard:
upstream now publishes v0.10.0 while the site's manifest pins v0.9.0. The failed
prebuild removed its local generated cache; the published report was restored
unchanged from `https://photocraftdownload.org/release-check.json`. Its historical
verification date remains 16 October. The release manifest and default guard
were not changed.

## Production deployment — 18 October 2026

The user explicitly requested deployment of these content changes before the
software-version update. A separate pinned-release check confirmed all 20
official v0.9.0 download assets, published sizes and HTTP responses. This check
also recorded v0.10.0 as the newer official version; it did not manufacture a
fresh latest-version verification report for v0.9.0.

- Target: existing Cloudflare Pages project `photocraftdownload-org`, production
  branch `main`, `https://photocraftdownload.org`.
- Build: `NITRO_PRESET=cloudflare_pages` with the published historical cache.
- Upload: direct deployment of `dist` with `--no-bundle` and `--commit-dirty=true`.
- Deployment ID: `b1537bef-b803-417f-a658-964935b2df98`.
- Deployment URL: `https://b1537bef.photocraftdownload-org.pages.dev`.
- Previous deployment: `1e364126-fcd2-4474-8ead-6b47302e86ae`.
- Live validation: all 44 homepage/guide variants passed robots meta and HTTP
  header, canonical, hreflang exclusion and crawl-access checks. The live
  sitemap exactly matches the generated 15 English URLs.
- Production browser: updated homepage exercise present, zero script errors
  or warnings, no broken loaded images, no desktop horizontal overflow.
- Source changes remain local; no Git commit or GitHub push was performed.

The separate pinned-link check report is in
`artifacts/content-deployment-pinned-check.json` (ignored local artifact).
