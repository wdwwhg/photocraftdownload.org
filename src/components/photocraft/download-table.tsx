import { builds, release, type Platform } from './downloads';

export type DownloadFile = {
  platform: string;
  architecture: string;
  name: string;
  file: string;
  bytes: number;
  sha256: string;
  url: string;
};

export function DownloadTable({
  files,
  labels,
  caption,
}: {
  files: DownloadFile[];
  labels: Record<string, string>;
  caption: string;
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
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.file}>
              <td>
                {file.platform === 'macos'
                  ? 'macOS'
                  : file.platform === 'windows'
                    ? 'Windows'
                    : 'Linux'}
              </td>
              <td>{file.architecture}</td>
              <td>
                {labels[`mode.${file.name}`] ?? file.name} · {file.name}
              </td>
              <th scope="row">
                <a href={file.url}>{file.file}</a>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PlatformDownloads({
  platform,
  labels,
}: {
  platform?: Platform;
  labels: Record<string, string>;
}) {
  const platforms: Platform[] = platform
    ? [platform]
    : ['windows', 'macos', 'linux'];
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
