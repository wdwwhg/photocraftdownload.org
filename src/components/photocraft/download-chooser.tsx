import { useState } from 'react';
import { ArrowDownToLine, ArrowRight, Check, CircleHelp } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

import { builds, release, type Platform } from './downloads';

type Chip = 'x64' | 'x86' | 'arm64' | 'intel' | 'apple' | 'riscv64';
type Delivery = 'install' | 'portable';
const chips: Record<Platform, Chip[]> = {
  windows: ['x64', 'arm64', 'x86'],
  macos: ['apple', 'intel'],
  linux: ['x64', 'arm64', 'riscv64'],
};
const platformNames = { windows: 'Windows', macos: 'macOS', linux: 'Linux' };

export function DownloadChooser({
  text,
  onPlatformChange,
}: {
  text: (key: string) => string;
  onPlatformChange: (platform: Platform) => void;
}) {
  const [platform, setPlatform] = useState<Platform | ''>('');
  const [chip, setChip] = useState<Chip | 'unknown' | ''>('');
  const [delivery, setDelivery] = useState<Delivery | ''>('');
  const knownChip = chip !== '' && chip !== 'unknown';
  const modes: Delivery[] =
    platform === 'macos'
      ? ['install']
      : chip === 'riscv64'
        ? ['portable']
        : ['install', 'portable'];
  const format =
    platform === 'macos'
      ? 'DMG'
      : platform === 'windows'
        ? delivery === 'install'
          ? 'MSI'
          : 'Portable ZIP'
        : chip === 'riscv64'
          ? 'tar.gz'
          : delivery === 'install'
            ? 'Flatpak'
            : 'AppImage';
  const architecture =
    platform === 'macos'
      ? 'Universal'
      : chip === 'arm64'
        ? 'ARM64'
        : chip === 'riscv64'
          ? 'RISC-V 64'
          : platform === 'linux'
            ? 'x86_64'
            : chip;
  const build =
    platform && knownChip && delivery
      ? builds[platform].find(
          (item) => item.name === format && item.architecture === architecture
        )
      : undefined;
  const resultKey =
    platform === 'macos'
      ? 'macos'
      : chip === 'riscv64'
        ? 'riscv64'
        : `${platform}.${delivery}`;

  return (
    <section className="pc-chooser" aria-labelledby="pc-chooser-title">
      <div className="pc-chooser-heading">
        <span className="pc-chooser-icon">
          <CircleHelp size={23} aria-hidden="true" />
        </span>
        <div>
          <h3 id="pc-chooser-title">{text('title')}</h3>
          <p>{text('description')}</p>
        </div>
      </div>
      <div className="pc-chooser-questions">
        <fieldset>
          <legend>
            <span>1</span>
            {text('system')}
          </legend>
          <div className="pc-chooser-options">
            {(['windows', 'macos', 'linux'] as const).map((os) => (
              <label className="pc-chooser-option" key={os}>
                <input
                  type="radio"
                  name="download-system"
                  value={os}
                  checked={platform === os}
                  onChange={() => {
                    setPlatform(os);
                    onPlatformChange(os);
                    setChip('');
                    setDelivery('');
                  }}
                />
                <span>{platformNames[os]}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset disabled={!platform} aria-describedby="pc-chooser-chip-help">
          <legend>
            <span>2</span>
            {text('chip')}
          </legend>
          <div className="pc-chooser-options">
            {(platform
              ? [...chips[platform], 'unknown' as const]
              : ['unknown' as const]
            ).map((choice) => (
              <label className="pc-chooser-option" key={choice}>
                <input
                  type="radio"
                  name="download-chip"
                  value={choice}
                  checked={chip === choice}
                  onChange={() => {
                    setChip(choice);
                    setDelivery('');
                  }}
                />
                <span>
                  {text(
                    choice === 'arm64' && platform === 'windows'
                      ? 'chip.windowsArm'
                      : `chip.${choice}`
                  )}
                </span>
              </label>
            ))}
          </div>
          <p className="pc-chooser-help" id="pc-chooser-chip-help">
            {text(platform ? `help.${platform}` : 'chooseSystem')}
          </p>
        </fieldset>
        <fieldset disabled={!knownChip} aria-describedby="pc-chooser-mode-help">
          <legend>
            <span>3</span>
            {text('delivery')}
          </legend>
          <div className="pc-chooser-options">
            {modes.map((mode) => (
              <label className="pc-chooser-option" key={mode}>
                <input
                  type="radio"
                  name="download-delivery"
                  value={mode}
                  checked={delivery === mode}
                  onChange={() => setDelivery(mode)}
                />
                <span>{text(`mode.${mode}`)}</span>
              </label>
            ))}
          </div>
          <p className="pc-chooser-help" id="pc-chooser-mode-help">
            {text(
              !platform
                ? 'chooseSystem'
                : platform === 'macos'
                  ? 'modeHelp.macos'
                  : chip === 'riscv64'
                    ? 'modeHelp.riscv64'
                    : platform === 'linux'
                      ? 'modeHelp.linux'
                      : 'modeHelp.windows'
            )}
          </p>
        </fieldset>
      </div>
      <div
        className={`pc-chooser-result ${build ? 'pc-chooser-ready' : ''}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {build ? (
          <>
            <div className="pc-chooser-recommendation">
              <strong>
                <Check size={18} aria-hidden="true" />
                {text('result')}
              </strong>
              <code>{build.file}</code>
              <p>{text(`result.${resultKey}`)}</p>
              <span className="pc-chooser-meta">
                v{release.version} · {build.architecture} · {build.size}
              </span>
            </div>
            <div className="pc-chooser-actions">
              <a
                className="pc-button pc-button-orange"
                href={release.base + build.file}
              >
                <ArrowDownToLine size={18} aria-hidden="true" />
                {text('download')}
              </a>
              <Link
                className="pc-chooser-guide"
                href={`/photocraft-${platform}`}
              >
                {text('guide')}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          <p>
            {text(
              !platform
                ? 'chooseSystem'
                : !knownChip
                  ? 'chooseChip'
                  : !delivery
                    ? 'chooseMode'
                    : 'unavailable'
            )}
          </p>
        )}
      </div>
      <p className="pc-chooser-source">{text('source')}</p>
    </section>
  );
}
