import verification from '@/generated/photocraft-release-check.json';

import manifest from '@/content/photocraft-release.json';

const repository = `https://github.com/${manifest.repository}`;
export const release = {
  version: manifest.version,
  checked: verification.checkedAt,
  notes: `${repository}/releases/tag/v${manifest.version}`,
  latest: `${repository}/releases/latest`,
  repository,
  product: 'https://getartcraft.com/apps/photocraft',
  docs: `${repository}/tree/v${manifest.version}/docs`,
  base: `${repository}/releases/download/v${manifest.version}/`,
  monitor:
    'https://github.com/wdwwhg/photocraftdownload.org/actions/workflows/check-release-links.yml',
};
export type Platform = 'windows' | 'macos' | 'linux';
export type Build = {
  name: string;
  file: string;
  architecture: string;
  size: string;
};
const sizes = verification.assetSizes as Record<string, number>;
export const builds = Object.fromEntries(
  Object.entries(manifest.builds).map(([platform, items]) => [
    platform,
    items.map((item) => {
      const file = item.file.replaceAll('{version}', release.version);
      return {
        ...item,
        file,
        size: `${(sizes[file] / 1024 / 1024).toFixed(1)} MiB`,
      };
    }),
  ])
) as Record<Platform, Build[]>;
export const linuxCommand = `chmod +x ${builds.linux[0].file}\n./${builds.linux[0].file}`;
