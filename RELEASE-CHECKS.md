# Official release verification

`src/content/photocraft-release.json` is the download manifest. It supplies the homepage version, filenames, installation command and structured-data version. Displayed sizes come from the official GitHub release API, rather than a manually maintained estimate.

## What runs automatically

- `pnpm build` and `pnpm cf:build` verify the release before building. `pnpm dev` also generates the required local verification data.
- The checker compares the pinned version with the latest published official release, validates every listed asset plus `SHA256SUMS.txt`, then follows each download URL with HTTP HEAD. It checks response status, rejects HTML responses and compares a supplied content length with the release metadata.
- Only a successful run writes `src/generated/photocraft-release-check.json` and `public/release-check.json`. These generated files are ignored by Git. A failed build does not replace the deployed site or manufacture a new check date.
- GitHub Actions runs the same check daily at 02:23 UTC (10:23 Singapore time), when its relevant files change on `main`, and on manual dispatch. The workflow also runs failure-handling tests and retains successful reports for 30 days. It needs no custom secret; the default GitHub token is read-only.
- A new upstream version, missing file or inaccessible download makes the check fail. Review the Actions result; workflow notifications depend on the repository owner's GitHub notification settings. No automatic installation or upgrade occurs.

The homepage timestamp and JSON report describe the check performed for the deployed build. The separate daily-check link opens the latest scheduled results. The timestamp does not claim that an unmodified deployment was rebuilt each day. GitHub schedules can be delayed or disabled by GitHub's inactive-repository policy; use manual dispatch when needed.

## Updating a release

1. Review the official release notes and its actual file list.
2. Update the manifest version and adjust filename patterns if the upstream naming or supported platforms changed.
3. Review version-specific homepage claims and Linux tutorial examples. Historical examples may keep an explicitly dated version; do not relabel screenshots or old research as current testing.
4. Run `pnpm releases:test`, `pnpm releases:check` and `pnpm build`. Inspect the generated report and the rendered download cards, commands and schema.
5. Run the repository's security scan, commit and push. Cloudflare Pages performs another check before publishing.

The check sends its API credential only to `api.github.com`, never to installer/CDN URLs. It does not download or execute installers, scan for malware, or establish the safety of the application. A checksum comparison remains a separate local file-integrity check for the reader.
