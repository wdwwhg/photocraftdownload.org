import { Link } from '@/core/i18n/navigation';

import { type DownloadFile } from './download-table';

type Locale = 'en' | 'zh';
type ReleaseHistoryEntry = {
  version: string;
  publishedAt: string;
  releaseUrl: string;
  checksumUrl: string;
  compareUrl: string;
  summary: Record<Locale, string>;
  audience: Record<Locale, string>;
  changes: { en: string; zh: string; source: string }[];
  downloads: { platform: string; url: string }[];
  files: DownloadFile[];
};

export function VersionHistoryTable({
  entries,
  labels,
  locale,
  currentVersion,
}: {
  entries: ReleaseHistoryEntry[];
  labels: Record<string, string>;
  locale: Locale;
  currentVersion: string;
}) {
  return (
    <div className="pc-version-history">
      <nav className="pc-version-jump" aria-label={labels.version}>
        {entries.map((entry) => (
          <a
            key={entry.version}
            href={`#v${entry.version.replaceAll('.', '-')}`}
          >
            v{entry.version}
          </a>
        ))}
      </nav>
      <table role="table">
        <caption>{labels.caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">
              {labels.version}
            </th>
            <th scope="col" role="columnheader">
              {labels.published}
            </th>
            <th scope="col" role="columnheader">
              {labels.changes}
            </th>
            <th scope="col" role="columnheader">
              {labels.download}
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {entries.map((entry) => {
            const localTime = new Date(
              Date.parse(entry.publishedAt) + 8 * 60 * 60 * 1000
            ).toISOString();
            const anchor = `#v${entry.version.replaceAll('.', '-')}`;
            return (
              <tr key={entry.version} role="row">
                <th scope="row" role="rowheader" data-label={labels.version}>
                  <a href={anchor}>v{entry.version}</a>
                  {entry.version === currentVersion && (
                    <span className="pc-version-current">{labels.current}</span>
                  )}
                </th>
                <td role="cell" data-label={labels.published}>
                  <time dateTime={entry.publishedAt} title={entry.publishedAt}>
                    {localTime.slice(0, 10)}
                    <small>{localTime.slice(11, 16)} · UTC+8</small>
                  </time>
                </td>
                <td role="cell" data-label={labels.changes}>
                  <p>{entry.summary[locale]}</p>
                  <a className="pc-version-details" href={anchor}>
                    {labels.details}
                  </a>
                </td>
                <td role="cell" data-label={labels.download}>
                  <ul className="pc-version-downloads">
                    {entry.downloads.map((download) => (
                      <li key={download.platform}>
                        <a
                          href={download.url}
                          aria-label={`${labels.downloadLabel} v${entry.version} · ${labels[download.platform]}`}
                        >
                          {labels[download.platform]}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="pc-version-source"
                    href={`/photocraft-download-files#v${entry.version.replaceAll('.', '-')}`}
                  >
                    {labels.allFiles}
                  </Link>
                  <a className="pc-version-source" href={entry.checksumUrl}>
                    {labels.checksums}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function VersionHistoryDetails({
  entries,
  labels,
  locale,
}: {
  entries: ReleaseHistoryEntry[];
  labels: Record<string, string>;
  locale: Locale;
}) {
  return (
    <div className="pc-version-detail-list">
      {entries.map((entry) => (
        <section key={entry.version}>
          <h3 id={`v${entry.version.replaceAll('.', '-')}`}>
            v{entry.version}
          </h3>
          <p>{entry.audience[locale]}</p>
          <ul>
            {entry.changes.map((change) => (
              <li key={change.source}>
                {change[locale]}{' '}
                <a
                  className="pc-version-evidence"
                  href={change.source}
                  aria-label={`${labels.changeSource}: ${change[locale]}`}
                >
                  {labels.changeSource}
                </a>
              </li>
            ))}
          </ul>
          <div className="pc-version-records">
            <a href={entry.releaseUrl}>{labels.notes}</a>
            <a href={entry.compareUrl}>{labels.compare}</a>
          </div>
          <p>
            <Link
              href={`/photocraft-download-files#v${entry.version.replaceAll('.', '-')}`}
            >
              {labels.allFiles} · v{entry.version} · SHA256
            </Link>
          </p>
        </section>
      ))}
    </div>
  );
}
