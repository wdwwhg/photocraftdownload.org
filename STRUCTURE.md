# PhotoCraft site structure

Reviewed: 2026-10-12. Every topic has an English URL and a complete Chinese counterpart under `/zh`. Page focus follows search intent; closely related phrases are covered together when they answer the same question.

| URL                        | Main intent                   | Content boundary                                      |
| -------------------------- | ----------------------------- | ----------------------------------------------------- |
| `/`                        | PhotoCraft download           | Official release files and quick installation         |
| `/photocraft-vs-photoshop` | PhotoCraft vs Photoshop       | Feature comparison, PSD handoff and migration checks  |
| `/photocraft-open-source`  | PhotoCraft open source        | What the project is, Rust, licenses and contributing  |
| `/photocraft-linux`        | PhotoCraft Linux installation | Architectures, packages, commands and troubleshooting |
| `/photocraft-reddit`       | PhotoCraft Reddit discussions | Dated original threads and interpretation of feedback |
| `/photocraft-alternative`  | PhotoCraft alternatives       | Other editors selected by task                        |
| `/photocraft-app`          | PhotoCraft app use            | Interface, first edit, saving and exporting           |
| `/vectorcraft`             | VectorCraft                   | Vector workflow, official downloads and evaluation    |
| `/filmcraft`               | FilmCraft                     | Video workflow, official downloads and evaluation     |
| `/lightcraft`              | LightCraft                    | RAW development, library workflow and evaluation      |

## Implementation

- `src/content/guides/<slug>.{en,zh}.mdx` contains original localized copy and page metadata.
- `src/routes/(guides)/<slug>.tsx` declares an explicit route using the shared guide factory.
- `src/components/photocraft/guides.ts` defines the guide directory and related-topic links.
- `scripts/photocraft-copy.mjs` maintains bilingual navigation and card labels.
- Each guide has one H1, unique title and description, self-canonical, reciprocal language alternates, Article and BreadcrumbList structured data.
- The homepage links to every guide; guides link to related topics and the download homepage.
- `scripts/generate-sitemap.mjs` validates locale counterparts and route files, then writes `public/sitemap.xml` during production builds. The sitemap contains 20 canonical URLs and reciprocal hreflang links. No invented modification dates are generated.

## Content maintenance

The website is an independent guide. Link factual product claims to official documentation. Label community comments as individual reports, and date reviews. Do not infer feature parity, benchmarks or ratings from marketing claims or vote counts.

Review the release version and actual asset filenames together when updating download links. The current PhotoCraft installer examples are pinned to 0.7.0. Family product pages link to upstream release selectors and state the version observed on the review date.

After adding a guide, update both locales, the explicit route, guide registry, related links and card translations. Run the copy generator and production build. Verify that the new page returns 200, has the correct canonical URL, appears in the sitemap and can be reached through an internal link.
