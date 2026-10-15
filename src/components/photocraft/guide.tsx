import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Aperture, ArrowRight, ArrowUpRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { mdxComponents } from '@/components/mdx-components';

import { headingId } from './guides';
import { LanguageLink } from './language-link';

import '@/styles/photocraft.css';

const guideMdxComponents = {
  ...mdxComponents,
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 id={headingId(String(children))}>{children}</h2>
  ),
  a: ({
    href = '',
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Link href={href} {...props}>
      {children}
    </Link>
  ),
  table: ({ children }: { children?: ReactNode }) => (
    <div className="pc-guide-table">
      <table>{children}</table>
    </div>
  ),
};

type GuideLink = { href: string; title: string; description: string };

export function GuideCards({ links }: { links: GuideLink[] }) {
  return (
    <div className="pc-guide-cards">
      {links.map((link) => (
        <Link href={link.href} className="pc-guide-card" key={link.href}>
          <span className="pc-guide-card-title">
            {link.title}
            <ArrowUpRight size={18} />
          </span>
          <p>{link.description}</p>
        </Link>
      ))}
    </div>
  );
}

export function PhotoCraftGuide({
  brand,
  tag,
  title,
  description,
  category,
  updated,
  independent,
  slug,
  skipLabel,
  privacyLabel,
  termsLabel,
  tocLabel,
  relatedLabel,
  downloadLabel,
  downloadDescription,
  allGuidesLabel,
  sections,
  related,
  children,
}: {
  brand: string;
  tag: string;
  title: string;
  description: string;
  category: string;
  updated: string;
  independent: string;
  slug: string;
  skipLabel: string;
  privacyLabel: string;
  termsLabel: string;
  tocLabel: string;
  relatedLabel: string;
  downloadLabel: string;
  downloadDescription: string;
  allGuidesLabel: string;
  sections: string[];
  related: GuideLink[];
  children: ReactNode;
}) {
  return (
    <div className="pc-site pc-guide-site" id="top">
      <a className="pc-skip" href="#main">
        {skipLabel}
      </a>
      <header className="pc-header pc-wrap">
        <Link className="pc-brand" href="/" aria-label={brand}>
          <span className="pc-brand-icon">
            <Aperture strokeWidth={1.8} />
          </span>
          <span>
            {brand}
            <small>{tag}</small>
          </span>
        </Link>
        <div className="pc-guide-header-links">
          <Link href="/#guides">{allGuidesLabel}</Link>
          <Link
            className="pc-guide-download"
            href="/#downloads"
            aria-label={downloadLabel}
          >
            {downloadLabel}
            <ArrowRight size={16} />
          </Link>
          <LanguageLink href={`/${slug}`} />
        </div>
      </header>
      <main className="pc-wrap" id="main">
        <div className="pc-guide-hero">
          <div className="pc-eyebrow">{category}</div>
          <h1>{title}</h1>
          <p className="pc-guide-lead">{description}</p>
          <p className="pc-guide-byline">{updated}</p>
        </div>
        <div className="pc-guide-layout">
          <article className="pc-guide-article">
            <MDXProvider components={guideMdxComponents}>
              {children}
            </MDXProvider>
          </article>
          <aside className="pc-guide-sidebar">
            <nav aria-label={tocLabel}>
              <h2>{tocLabel}</h2>
              {sections.map((section) => (
                <a key={section} href={`#${headingId(section)}`}>
                  {section}
                </a>
              ))}
            </nav>
            <div className="pc-guide-sidebar-cta">
              <p>{downloadDescription}</p>
              <Link className="pc-button pc-button-orange" href="/#downloads">
                {downloadLabel}
                <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
        <section className="pc-guide-related">
          <div className="pc-section-heading">
            <h2>{relatedLabel}</h2>
          </div>
          <GuideCards links={related} />
        </section>
      </main>
      <footer className="pc-footer pc-wrap">
        <p>{independent}</p>
        <div className="pc-footer-bottom">
          <span>© 2026 {brand}</span>
          <Link href="/privacy-policy">{privacyLabel}</Link>
          <Link href="/terms-of-service">{termsLabel}</Link>
          <Link href="/#downloads">
            {downloadLabel}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
