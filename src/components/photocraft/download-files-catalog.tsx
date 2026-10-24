import { DownloadTable } from './download-table';

type CatalogRelease = {
  version: string;
  publishedAt: string;
  prerelease: boolean;
  releaseUrl: string;
  checksumUrl: string;
  files: {
    platform: string;
    architecture: string;
    name: string;
    file: string;
    bytes: number;
    sha256: string;
    url: string;
  }[];
};
export function DownloadFilesCatalog({
  entries,
  currentVersion,
  labels,
  tableLabels,
}: {
  entries: CatalogRelease[];
  currentVersion: string;
  labels: Record<string, string>;
  tableLabels: Record<string, string>;
}) {
  return (
    <div className="pc-file-catalog">
      <nav className="pc-version-jump" aria-label={labels.versions}>
        {entries.map((entry) => (
          <a
            key={entry.version}
            href={`#v${entry.version.replaceAll('.', '-')}`}
          >
            v{entry.version}
          </a>
        ))}
      </nav>
      {entries.map((entry) => (
        <section
          key={entry.version}
          aria-labelledby={`v${entry.version.replaceAll('.', '-')}`}
        >
          <h2 id={`v${entry.version.replaceAll('.', '-')}`}>
            PhotoCraft v{entry.version}
            <span className="pc-version-current">
              {entry.version === currentVersion
                ? labels.current
                : entry.prerelease
                  ? labels.prerelease
                  : labels.archived}
            </span>
          </h2>
          <p>
            <time dateTime={entry.publishedAt}>
              {entry.publishedAt.slice(0, 10)} UTC
            </time>{' '}
            · {entry.files.length} {labels.files}
          </p>
          <p>
            <a href={entry.releaseUrl}>{labels.release}</a> ·{' '}
            <a href={entry.checksumUrl}>SHA256SUMS.txt</a> ·{' '}
            <a href="#top">{labels.top}</a>
          </p>
          <DownloadTable
            caption={`${labels.caption} · v${entry.version}`}
            labels={{ ...tableLabels, ...labels }}
            showUsage
            files={entry.files.map((file) => ({
              ...file,
              id: `v${entry.version}-${file.file}`,
              usage: labels[`usage.${file.name}`] ?? labels['usage.other'],
            }))}
          />
        </section>
      ))}
    </div>
  );
}
