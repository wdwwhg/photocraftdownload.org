import { builds, release, type Platform } from './downloads';

export type DownloadFile = {
  platform: string;
  architecture: string;
  name: string;
  file: string;
  bytes: number;
  sha256: string;
  url: string;
  usage?: string;
  id?: string;
};

export function DownloadTable({
  files,
  labels,
  caption,
  showUsage = false,
}: {
  files: DownloadFile[];
  labels: Record<string, string>;
  caption: string;
  showUsage?: boolean;
}) {
  return (
    <div
      className="pc-download-table"
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{labels.platform}</th>
            <th scope="col">{labels.architecture}</th>
            <th scope="col">{labels.format}</th>
            <th scope="col">{labels.file}</th>
            <th scope="col">{labels.size}</th>
            <th scope="col">SHA256</th>
            {showUsage && <th scope="col">{labels.usage}</th>}
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.file} id={file.id}>
              <td>
                {file.platform === 'macos'
                  ? 'macOS'
                  : file.platform === 'windows'
                    ? 'Windows'
                    : file.platform === 'linux'
                      ? 'Linux'
                      : file.platform === 'freebsd'
                        ? 'FreeBSD'
                        : file.platform === 'web'
                          ? 'Web'
                          : labels.allPlatforms}
              </td>
              <td>{file.architecture}</td>
              <td>
                {labels[`mode.${file.name}`]
                  ? `${labels[`mode.${file.name}`]} · ${file.name}`
                  : file.name}
              </td>
              <th scope="row">
                <a href={file.url}>{file.file}</a>
                {file.id && (
                  <small>
                    <a
                      href={`#${file.id}`}
                      aria-label={`${labels.permalink}: ${file.file}`}
                    >
                      #
                    </a>
                  </small>
                )}
              </th>
              <td>
                <span>{(file.bytes / 1024 / 1024).toFixed(1)} MiB</span>
                <small>
                  {file.bytes.toLocaleString('en-US')} {labels.bytes}
                </small>
              </td>
              <td>
                <code>{file.sha256}</code>
              </td>
              {showUsage && <td className="pc-file-usage">{file.usage}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PlatformDownloads({
  platform,
  platforms: requestedPlatforms,
  labels,
}: {
  platform?: Platform;
  platforms?: readonly Platform[];
  labels: Record<string, string>;
}) {
  const platforms: readonly Platform[] =
    requestedPlatforms ??
    (platform ? [platform] : ['windows', 'macos', 'linux']);
  return (
    <DownloadTable
      labels={labels}
      caption={`${labels.caption} · v${release.version}`}
      files={platforms.flatMap((os) =>
        builds[os].map((build) => ({
          ...build,
          platform: os,
          url: release.base + build.file,
        }))
      )}
    />
  );
}
