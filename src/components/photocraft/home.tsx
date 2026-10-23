import { useEffect, useState, type ReactNode } from 'react';
import {
  Aperture,
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronDown,
  Code2,
  Copy,
  ExternalLink,
  Github,
  Layers3,
  Menu,
  Monitor,
  MousePointer2,
  Palette,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { getLocale } from '@/paraglide/runtime.js';
import downloadLabels from '@/content/download-labels.json';

import { CaptureGallery } from './capture-gallery';
import { DownloadChooser } from './download-chooser';
import { PlatformDownloads } from './download-table';
import {
  builds,
  formatReleaseCopy,
  linuxCommand,
  release,
  type Platform,
} from './downloads';
import { GuideCards } from './guide';
import {
  homepageGuideGroups,
  homepageRelatedGuides,
  priorityGuideSlugs,
} from './guides';
import { LanguageLink } from './language-link';

import '@/styles/photocraft.css';

const t = (key: string) => formatReleaseCopy(tDynamic(`photocraft.${key}`));
const platformNames = { windows: 'Windows', macos: 'macOS', linux: 'Linux' };

function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === 'windows')
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M2 3h9v8H2zm11 0h9v8h-9zM2 13h9v8H2zm11 0h9v8h-9z" />
      </svg>
    );
  if (platform === 'macos')
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.9 12.7c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.6.8-3.2.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 2-1.1 2.7-2.1.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.4-.9-2.4-3.9ZM14.7 6.5c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1.1 2.9 1.1.1 2.2-.6 2.9-1.3Z" />
      </svg>
    );
  return <Monitor aria-hidden="true" />;
}
function Brand() {
  return (
    <a className="pc-brand" href="#top" aria-label={envConfigs.app_name}>
      <span className="pc-brand-icon">
        <Aperture strokeWidth={1.8} />
      </span>
      <span>
        {envConfigs.app_name}
        <small>{t('brand.tag')}</small>
      </span>
    </a>
  );
}
function OutLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export function PhotoCraftHome() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>('windows');
  const [detected, setDetected] = useState<Platform | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  useEffect(() => {
    const agent = navigator.userAgent;
    const current = /Macintosh|Mac OS X/.test(agent)
      ? 'macos'
      : /Linux/.test(agent) && !/Android/.test(agent)
        ? 'linux'
        : /Windows/.test(agent)
          ? 'windows'
          : null;
    setDetected(current);
    if (current) setPlatform(current);
  }, []);
  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timeout);
  }, [copied]);
  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(linuxCommand);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  };
  const nav = ['downloads', 'install', 'features', 'guides'];
  const featureItems = [
    { key: 'layers', icon: Layers3 },
    { key: 'psd', icon: Code2 },
    { key: 'color', icon: Palette },
    { key: 'native', icon: Sparkles },
  ];
  const activeBuild = builds[platform][0];
  const faqKeys = [
    'free',
    'safe',
    'psd',
    'replacement',
    'installer',
    'account',
    'checksum',
    'updates',
    'failed',
    'official',
  ];
  const faqGuides: Record<string, string> = {
    free: 'photocraft-open-source',
    psd: 'photocraft-vs-photoshop',
    replacement: 'photocraft-vs-photoshop',
    installer: `photocraft-${platform}`,
    account: 'photocraft-app',
    failed: `photocraft-${platform}`,
  };

  return (
    <div className="pc-site" id="top">
      <a className="pc-skip" href="#main">
        {t('skip')}
      </a>
      <div className="pc-announcement">
        <span className="pc-status-dot" />
        <span>{t('announcement')}</span>
        <OutLink href={release.notes}>
          v{release.version}
          <ArrowUpRight size={12} />
        </OutLink>
      </div>
      <header className="pc-header pc-wrap">
        <Brand />
        <nav className="pc-desktop-nav" aria-label={t('nav.label')}>
          {nav.map((item) => (
            <a key={item} href={`#${item}`}>
              {t(`nav.${item}`)}
            </a>
          ))}
        </nav>
        <div className="pc-header-actions">
          <OutLink className="pc-github" href={release.repository}>
            <Github size={18} />
            <span>GitHub</span>
            <ArrowUpRight size={12} />
          </OutLink>
          <LanguageLink />
          <button
            className="pc-menu-button"
            aria-label={mobileOpen ? t('nav.close') : t('nav.open')}
            aria-expanded={mobileOpen}
            aria-controls="pc-mobile-nav"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {mobileOpen && (
        <nav
          id="pc-mobile-nav"
          className="pc-mobile-nav"
          aria-label={t('nav.label')}
        >
          {nav.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => setMobileOpen(false)}
            >
              {t(`nav.${item}`)}
              <ArrowUpRight size={16} />
            </a>
          ))}
        </nav>
      )}
      <main id="main">
        <section className="pc-hero pc-wrap">
          <div className="pc-hero-copy">
            <div className="pc-eyebrow">
              <span className="pc-tiny-cross">✳</span>
              {t('hero.eyebrow')}
            </div>
            <div className="pc-hero-heading">
              <h1>{t('hero.title1')}</h1>
              <p className="pc-hero-subtitle">{t('hero.title2')}</p>
            </div>
            <p className="pc-hero-description">{t('hero.description')}</p>
            <div className="pc-release-summary">
              <OutLink href={release.notes}>
                <span className="pc-status-dot" />
                {t('hero.currentVersion')} <strong>v{release.version}</strong>
                <ArrowUpRight size={12} />
              </OutLink>
              <span>
                {t('hero.updated')}{' '}
                <time dateTime={release.checked}>{release.checkedDisplay}</time>
              </span>
            </div>
            <div
              className="pc-quick-downloads"
              role="group"
              aria-label={t('hero.directDownloads')}
            >
              {(['windows', 'macos', 'linux'] as const).map((os) => (
                <a
                  href={release.base + builds[os][0].file}
                  key={os}
                  aria-label={`${t('hero.directDownload')} PhotoCraft ${platformNames[os]} · ${builds[os][0].name} · ${builds[os][0].architecture}`}
                >
                  <PlatformIcon platform={os} />
                  <span>
                    <strong>
                      {t('hero.directDownload')} {platformNames[os]}
                    </strong>
                    <small>
                      {builds[os][0].name} · {builds[os][0].architecture}
                    </small>
                  </span>
                </a>
              ))}
            </div>
            <div className="pc-hero-cta">
              <a href="#downloads" className="pc-button pc-button-orange">
                <ArrowDownToLine size={18} />
                {t('hero.allBuilds')}
                <ArrowRight size={18} />
              </a>
              <a className="pc-text-link" href="#features">
                {t('hero.explore')}
                <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="pc-hero-platforms">
              <span>
                <PlatformIcon platform="windows" />
                Windows
              </span>
              <span>
                <PlatformIcon platform="macos" />
                macOS
              </span>
              <span>
                <PlatformIcon platform="linux" />
                Linux
              </span>
              <i />
              {t('hero.noSubscription')}
            </div>
          </div>
          <div className="pc-hero-visual">
            <div className="pc-visual-grid" />
            <div className="pc-editor-frame">
              <a
                href="/imgs/photocraft/captures/windows-0.9.0-about.png"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('captures.open')}
              >
                <img
                  src="/imgs/photocraft/captures/windows-0.9.0-about.webp"
                  alt={t('images.interface')}
                  width="1440"
                  height="900"
                  fetchPriority="high"
                />
              </a>
            </div>
            <div className="pc-visual-caption">
              <span className="pc-caption-line" />
              {t('hero.caption')}
              <Link href="/photocraft-review#hands-on">
                <ArrowUpRight size={13} />
                <span className="pc-sr-only">{t('features.imageSource')}</span>
              </Link>
            </div>
          </div>
        </section>
        <div className="pc-proof-strip">
          <div className="pc-wrap">
            <span>
              <Code2 />
              {t('proof.open')}
            </span>
            <span>
              <Layers3 />
              {t('proof.psd')}
            </span>
            <span>
              <ShieldCheck />
              {t('proof.offline')}
            </span>
            <span>
              <Monitor />
              {t('proof.platforms')}
            </span>
          </div>
        </div>

        <section className="pc-download-section pc-wrap" id="downloads">
          <div className="pc-section-heading">
            <div>
              <div className="pc-eyebrow">01 / {t('downloads.eyebrow')}</div>
              <h2>{t('downloads.title')}</h2>
              <p>{t('downloads.description')}</p>
            </div>
            <div className="pc-version-chip">
              <span className="pc-status-dot" />v{release.version}
              <span>{t('downloads.alpha')}</span>
            </div>
          </div>
          {!release.isLatest && (
            <p className="pc-release-notice">
              {t('downloads.pinnedNotice')}{' '}
              <OutLink href={release.latest}>
                v{release.latestVersion} — {t('downloads.releases')}
              </OutLink>
            </p>
          )}
          <PlatformDownloads labels={downloadLabels[getLocale()]} />
          <details className="pc-chooser-enhancement">
            <summary>{t('chooser.title')}</summary>
            <DownloadChooser
              text={(key) => t(`chooser.${key}`)}
              onPlatformChange={setPlatform}
            />
          </details>
          <div className="pc-download-grid">
            {(['windows', 'macos', 'linux'] as const).map((os) => (
              <article
                className={`pc-download-card ${detected === os ? 'pc-recommended' : ''}`}
                key={os}
              >
                <div className="pc-card-top">
                  <span className="pc-os-icon">
                    <PlatformIcon platform={os} />
                  </span>
                  {detected === os ? (
                    <span className="pc-recommend-tag">
                      {t('downloads.detected')}
                    </span>
                  ) : (
                    <span className="pc-card-number">
                      {os === 'windows' ? '01' : os === 'macos' ? '02' : '03'}
                    </span>
                  )}
                </div>
                <h3>{platformNames[os]}</h3>
                <p>{t(`downloads.${os}.subtitle`)}</p>
                <div className="pc-build-info">
                  <span>{t(`downloads.${os}.format`)}</span>
                  <span>{builds[os][0].size}</span>
                </div>
                <a
                  className={`pc-button pc-download-button ${detected === os ? 'pc-button-orange' : 'pc-button-dark'}`}
                  href={release.base + builds[os][0].file}
                >
                  <ArrowDownToLine size={17} />
                  {t('downloads.button')} {platformNames[os]}
                  <ArrowUpRight size={15} />
                </a>
                <Link className="pc-install-link" href={`/photocraft-${os}`}>
                  {t('downloads.install')}
                  <ArrowRight size={14} />
                </Link>
                <details className="pc-build-details">
                  <summary>
                    {t('downloads.more')}
                    <ChevronDown size={14} />
                  </summary>
                  <div>
                    {builds[os].slice(1).map((build) => (
                      <a href={release.base + build.file} key={build.file}>
                        <span>
                          {build.name}
                          <small>{build.architecture}</small>
                        </span>
                        <ArrowDownToLine size={14} />
                      </a>
                    ))}
                  </div>
                </details>
              </article>
            ))}
          </div>
          <p className="pc-platform-links">
            {t('downloads.platformIntro')}{' '}
            <Link href="/photocraft-windows">
              PhotoCraft download for Windows
            </Link>
            ,{' '}
            <Link href="/photocraft-macos">PhotoCraft download for macOS</Link>
            {' · '}
            <Link href="/photocraft-linux">
              PhotoCraft download for Linux
            </Link>. {t('downloads.helpIntro')}{' '}
            <Link href="/is-photocraft-safe">{t('downloads.safetyGuide')}</Link>
            {' · '}
            <Link href="/photocraft-installer-not-working">
              {t('downloads.troubleshootingGuide')}
            </Link>
            .
          </p>
          <div className="pc-download-footer">
            <span>
              <ShieldCheck size={15} />
              {t('downloads.original')}
            </span>
            <div>
              <OutLink href={release.base + 'SHA256SUMS.txt'}>
                {t('downloads.checksum')}
                <ExternalLink size={12} />
              </OutLink>
              <OutLink href={release.latest}>
                {t('downloads.releases')}
                <ExternalLink size={12} />
              </OutLink>
              <Link href="/photocraft-version-history">
                {t('downloads.history')}
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
          <p className="pc-check-date">
            {t('downloads.checked')}{' '}
            <time dateTime={release.checked}>{release.checkedDisplay}</time>.{' '}
            {t('downloads.updateNote')}
          </p>
          <p className="pc-check-date">
            {t('downloads.checkMethod')}{' '}
            <OutLink href="/release-check.json">
              {t('downloads.report')}
            </OutLink>
            {' · '}
            <OutLink href={release.monitor}>{t('downloads.monitor')}</OutLink>
          </p>
        </section>

        <section className="pc-feature-section" id="features">
          <div className="pc-wrap">
            <div className="pc-section-heading">
              <div>
                <div className="pc-eyebrow">02 / {t('features.eyebrow')}</div>
                <h2>{t('features.title')}</h2>
              </div>
              <p className="pc-heading-aside">{t('features.description')}</p>
            </div>
            <div className="pc-feature-showcase">
              <figure className="pc-feature-image">
                <a
                  href="/imgs/photocraft/captures/windows-0.9.0-levels.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('captures.open')}
                >
                  <img
                    src="/imgs/photocraft/captures/windows-0.9.0-levels.webp"
                    alt={t('images.adjustments')}
                    width="1440"
                    height="900"
                    loading="lazy"
                  />
                </a>
                <figcaption>
                  <span>{t('features.imageCaption')}</span>
                  <Link href="/photocraft-review#hands-on">
                    {t('features.imageSource')}
                    <ArrowUpRight size={13} />
                  </Link>
                </figcaption>
              </figure>
              <div className="pc-feature-list">
                {featureItems.map(({ key, icon: Icon }, i) => (
                  <article key={key}>
                    <span className="pc-feature-icon">
                      <Icon size={20} />
                    </span>
                    <div>
                      <span className="pc-feature-index">0{i + 1}</span>
                      <h3>{t(`features.${key}.title`)}</h3>
                      <p>{t(`features.${key}.description`)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <CaptureGallery
              title={t('captures.title')}
              description={t('captures.description')}
              openLabel={t('captures.open')}
              images={[
                {
                  file: 'windows-0.9.0-system-info',
                  alt: t('captures.systemAlt'),
                  caption: t('captures.systemCaption'),
                },
              ]}
            />
            <p className="pc-capture-links">
              <Link href="/photocraft-review#hands-on">
                {t('captures.record')}
              </Link>
              <OutLink href="/imgs/photocraft/captures/coast-layers.psd">
                {t('captures.file')}
              </OutLink>
            </p>
            <div className="pc-interface-guide">
              <span className="pc-guide-label">
                <MousePointer2 size={16} />
                {t('interface.title')}
              </span>
              {['toolbar', 'canvas', 'panels'].map((item, i) => (
                <p key={item}>
                  <b>
                    0{i + 1} — {t(`interface.${item}.title`)}
                  </b>
                  <span>{t(`interface.${item}.description`)}</span>
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="pc-install-section pc-wrap" id="install">
          <div className="pc-section-heading">
            <div>
              <div className="pc-eyebrow">03 / {t('install.eyebrow')}</div>
              <h2>{t('install.title')}</h2>
              <p>{t('install.description')}</p>
              <Link className="pc-text-link" href={`/photocraft-${platform}`}>
                {t('install.fullGuide')}
                <ArrowRight size={14} />
              </Link>
            </div>
            <div
              className="pc-tabs"
              role="tablist"
              aria-label={t('install.tabs')}
            >
              {(['windows', 'macos', 'linux'] as const).map((os) => (
                <button
                  id={`tab-${os}`}
                  aria-selected={platform === os}
                  aria-controls="pc-install-panel"
                  role="tab"
                  tabIndex={platform === os ? 0 : -1}
                  className={platform === os ? 'pc-active-tab' : ''}
                  key={os}
                  onClick={() => setPlatform(os)}
                  onKeyDown={(event) => {
                    const options: Platform[] = ['windows', 'macos', 'linux'];
                    const index = options.indexOf(os);
                    const next =
                      event.key === 'ArrowRight'
                        ? options[(index + 1) % 3]
                        : event.key === 'ArrowLeft'
                          ? options[(index + 2) % 3]
                          : event.key === 'Home'
                            ? options[0]
                            : event.key === 'End'
                              ? options[2]
                              : null;
                    if (next) {
                      event.preventDefault();
                      setPlatform(next);
                      document.getElementById(`tab-${next}`)?.focus();
                    }
                  }}
                >
                  <PlatformIcon platform={os} />
                  {platformNames[os]}
                </button>
              ))}
            </div>
          </div>
          <div
            id="pc-install-panel"
            role="tabpanel"
            aria-labelledby={`tab-${platform}`}
            tabIndex={0}
          >
            <div className="pc-steps">
              {[1, 2, 3].map((step) => (
                <article key={`${platform}-${step}`}>
                  <span className="pc-step-number">0{step}</span>
                  <h3>{t(`install.${platform}.${step}.title`)}</h3>
                  <p>{t(`install.${platform}.${step}.text`)}</p>
                  {step === 1 && (
                    <a href={release.base + activeBuild.file}>
                      {t('install.getFile')}
                      <ArrowDownToLine size={13} />
                    </a>
                  )}
                </article>
              ))}
            </div>
            {platform === 'linux' && (
              <div className="pc-terminal">
                <div>
                  <span>{t('install.command')}</span>
                  <button onClick={copyCommand}>
                    {copied ? <CheckCheck size={15} /> : <Copy size={15} />}
                    {copied ? t('install.copied') : t('install.copy')}
                  </button>
                </div>
                <pre>
                  <code>{linuxCommand}</code>
                </pre>
                <span className="pc-copy-status" role="status">
                  {copyFailed
                    ? t('install.copyFailed')
                    : copied
                      ? t('install.copied')
                      : ''}
                </span>
              </div>
            )}
            <div className="pc-install-tip">
              <ShieldCheck size={18} />
              <p>
                <strong>{t('install.tip')}</strong>{' '}
                {t(`install.${platform}.tip`)}
              </p>
            </div>
          </div>
          <div className="pc-first-edit">
            <div>
              <span className="pc-eyebrow">{t('firstEdit.eyebrow')}</span>
              <h3>{t('firstEdit.title')}</h3>
            </div>
            <div className="pc-first-edit-instructions">
              <p>{t('firstEdit.text')}</p>
              <ol>
                {[1, 2, 3].map((step) => (
                  <li key={step}>{t(`firstEdit.step${step}`)}</li>
                ))}
              </ol>
            </div>
            <Link className="pc-text-link" href="/photocraft-tutorial">
              {t('firstEdit.docs')}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>

        <section className="pc-guide-index" id="guides">
          <div className="pc-wrap">
            <div className="pc-section-heading">
              <div>
                <div className="pc-eyebrow">04 / {t('guides.eyebrow')}</div>
                <h2>{t('guides.title')}</h2>
              </div>
              <p className="pc-heading-aside">{t('guides.description')}</p>
            </div>
            <GuideCards
              links={priorityGuideSlugs.map((slug) => ({
                href: `/${slug}`,
                title: t(`guides.${slug}.title`),
                description: t(`guides.${slug}.description`),
              }))}
            />
          </div>
        </section>

        <section className="pc-faq-section pc-wrap" id="faq">
          <div>
            <div className="pc-eyebrow">05 / {t('faq.eyebrow')}</div>
            <h2>{t('faq.title')}</h2>
            <p>{t('faq.description')}</p>
            <OutLink className="pc-text-link" href={release.product}>
              {t('faq.officialLink')}
              <ArrowUpRight size={16} />
            </OutLink>
          </div>
          <div className="pc-faq-list">
            {faqKeys.map((key) => (
              <details key={key}>
                <summary>
                  {t(`faq.${key}.q`)}
                  <span>
                    <ChevronDown size={18} />
                  </span>
                </summary>
                <p>{t(`faq.${key}.a`)}</p>
                {faqGuides[key] && (
                  <Link
                    className="pc-faq-guide-link"
                    href={`/${faqGuides[key]}`}
                  >
                    {t(`guides.${faqGuides[key]}.title`)}{' '}
                    <ArrowUpRight size={14} />
                  </Link>
                )}
              </details>
            ))}
          </div>
        </section>

        <section className="pc-bottom-cta pc-wrap">
          <span className="pc-cta-aperture">
            <Aperture strokeWidth={1} />
          </span>
          <div>
            <div className="pc-eyebrow">{t('cta.eyebrow')}</div>
            <h2>{t('cta.title')}</h2>
            <p>{t('cta.description')}</p>
          </div>
          <a className="pc-button pc-button-dark" href="#downloads">
            {t('hero.download')}
            <ArrowDownToLine size={19} />
          </a>
        </section>
        <nav
          className="pc-topic-nav pc-wrap"
          aria-labelledby="pc-topic-nav-title"
        >
          <h2 id="pc-topic-nav-title">{t('topicNav.title')}</h2>
          <div className="pc-topic-nav-groups">
            {homepageGuideGroups.map((group) => (
              <div key={group.key}>
                <h3>{t(`topicNav.${group.key}`)}</h3>
                <ul>
                  {group.slugs.map((slug) => (
                    <li key={slug}>
                      <Link href={`/${slug}`}>{t(`topicNav.${slug}`)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pc-topic-nav-related">
            <h3>{t('topicNav.related')}</h3>
            <ul>
              {homepageRelatedGuides.map((slug) => (
                <li key={slug}>
                  <Link href={`/${slug}`}>{t(`guides.${slug}.title`)}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </main>
      <footer className="pc-footer pc-wrap">
        <div className="pc-footer-main">
          <div>
            <Brand />
            <p>{t('footer.independent')}</p>
          </div>
          <div className="pc-footer-links">
            <Link href="/privacy-policy">{t('footer.privacy')}</Link>
            <Link href="/terms-of-service">{t('footer.terms')}</Link>
            <a href="#downloads">{t('nav.downloads')}</a>
            <a href="#install">{t('nav.install')}</a>
            <a href="#guides">{t('nav.guides')}</a>
            <Link href="/photocraft-linux">
              {t('guides.photocraft-linux.title')}
            </Link>
            <a href="#faq">FAQ</a>
            <OutLink href={release.repository}>
              GitHub
              <ArrowUpRight size={12} />
            </OutLink>
            <OutLink href={release.product}>
              ArtCraft
              <ArrowUpRight size={12} />
            </OutLink>
          </div>
        </div>
        <div className="pc-footer-bottom">
          <span>
            © 2026 {envConfigs.app_name}. {t('footer.disclaimer')}
          </span>
          <span>
            {t('footer.credit')}
            <Link href="/photocraft-review#hands-on">
              {t('captures.credit')}
              <ArrowUpRight size={11} />
            </Link>
          </span>
          <a href="#top">
            {t('footer.top')}
            <ArrowDown size={12} className="pc-up-arrow" />
          </a>
        </div>
      </footer>
    </div>
  );
}
