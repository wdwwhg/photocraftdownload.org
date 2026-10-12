// Official GitHub Release API snapshot, verified on 2026-10-12.
// Update this snapshot and its displayed version together for a new release.
export const release = {
  version: '0.7.0',
  checked: '2026-10-12',
  notes: 'https://github.com/storytold/photocraft/releases/tag/v0.7.0',
  latest: 'https://github.com/storytold/photocraft/releases/latest',
  repository: 'https://github.com/storytold/photocraft',
  product: 'https://getartcraft.com/apps/photocraft',
  docs: 'https://github.com/storytold/photocraft/tree/v0.7.0/docs',
  base: 'https://github.com/storytold/photocraft/releases/download/v0.7.0/',
};
export type Platform = 'windows' | 'macos' | 'linux';
export type Build = {
  name: string;
  file: string;
  architecture: string;
  size?: string;
};
export const builds: Record<Platform, Build[]> = {
  windows: [
    {
      name: 'MSI',
      file: 'photocraft-0.7.0-windows-x64.msi',
      architecture: 'x64',
      size: '61.6 MB',
    },
    {
      name: 'Portable ZIP',
      file: 'photocraft-0.7.0-windows-x64-portable.zip',
      architecture: 'x64',
    },
    {
      name: 'MSI',
      file: 'photocraft-0.7.0-windows-arm64.msi',
      architecture: 'ARM64',
    },
    {
      name: 'Portable ZIP',
      file: 'photocraft-0.7.0-windows-arm64-portable.zip',
      architecture: 'ARM64',
    },
    {
      name: 'MSI',
      file: 'photocraft-0.7.0-windows-x86.msi',
      architecture: 'x86',
    },
    {
      name: 'Portable ZIP',
      file: 'photocraft-0.7.0-windows-x86-portable.zip',
      architecture: 'x86',
    },
  ],
  macos: [
    {
      name: 'DMG',
      file: 'photocraft-0.7.0-macos-universal.dmg',
      architecture: 'Universal',
      size: '80.2 MB',
    },
    {
      name: 'CLI ZIP',
      file: 'photocraft-cli-0.7.0-macos-universal.zip',
      architecture: 'Universal',
    },
  ],
  linux: [
    {
      name: 'AppImage',
      file: 'photocraft-0.7.0-linux-x86_64.AppImage',
      architecture: 'x86_64',
      size: '69.2 MB',
    },
    ...(['x86_64', 'aarch64'] as const).flatMap((architecture) =>
      [
        'flatpak',
        'deb',
        'rpm',
        'tar.gz',
        ...(architecture === 'aarch64' ? ['AppImage'] : []),
      ].map((format) => ({
        name:
          format === 'deb'
            ? 'DEB'
            : format === 'rpm'
              ? 'RPM'
              : format === 'flatpak'
                ? 'Flatpak'
                : format,
        architecture,
        file: `photocraft-0.7.0-linux-${architecture}.${format}`,
      }))
    ),
    {
      name: 'tar.gz',
      file: 'photocraft-0.7.0-linux-riscv64.tar.gz',
      architecture: 'RISC-V 64',
    },
  ],
};
export const linuxCommand =
  'chmod +x photocraft-0.7.0-linux-x86_64.AppImage\n./photocraft-0.7.0-linux-x86_64.AppImage';
