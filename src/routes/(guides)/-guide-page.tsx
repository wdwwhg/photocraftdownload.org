import type { ComponentType } from 'react';
import { notFound, useLoaderData } from '@tanstack/react-router';

import { tDynamic } from '@/core/i18n/dynamic';
import { envConfigs } from '@/config';
import {
  getLocale,
  locales,
  localizeHref,
  localizeUrl,
} from '@/paraglide/runtime.js';
import { PhotoCraftGuide } from '@/components/photocraft/guide';
import { relatedGuides, type GuideSlug } from '@/components/photocraft/guides';

type GuideMeta = {
  title: string;
  heading: string;
  description: string;
  category: string;
  updated_at: string;
  sections: string[];
};
type GuideModule = { default: ComponentType; meta: GuideMeta };
type GuideData = {
  meta: GuideMeta;
  slug: GuideSlug;
  locale: ReturnType<typeof getLocale>;
};
const pages = import.meta.glob<GuideModule>('/src/content/guides/*.mdx', {
  eager: true,
});
const getPage = (slug: GuideSlug, locale: string) =>
  pages[`/src/content/guides/${slug}.${locale}.mdx`];

export function guidePageRouteOptions(slug: GuideSlug) {
  return {
    loader: (): GuideData => {
      const locale = getLocale();
      const page = getPage(slug, locale);
      if (!page) throw notFound();
      return { meta: page.meta, slug, locale };
    },
    head: ({ loaderData }: { loaderData?: GuideData }) => {
      if (!loaderData) return {};
      const { meta, locale } = loaderData;
      const urlFor = (loc: ReturnType<typeof getLocale>) =>
        localizeUrl(`${envConfigs.app_url.replace(/\/$/, '')}/${slug}`, {
          locale: loc,
        }).href;
      return {
        meta: [
          { title: meta.title },
          { name: 'description', content: meta.description },
          { property: 'og:title', content: meta.title },
          { property: 'og:description', content: meta.description },
          { property: 'og:type', content: 'article' },
          { property: 'og:url', content: urlFor(locale) },
          { name: 'twitter:card', content: 'summary' },
        ],
        links: [
          { rel: 'canonical', href: urlFor(locale) },
          ...locales.map((loc) => ({
            rel: 'alternate',
            hrefLang: loc,
            href: urlFor(loc),
          })),
          { rel: 'alternate', hrefLang: 'x-default', href: urlFor('en') },
        ],
        scripts: [
          {
            type: 'application/ld+json',
            children: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Article',
                  headline: meta.heading,
                  description: meta.description,
                  inLanguage: locale,
                  datePublished: '2026-10-12',
                  dateModified: meta.updated_at,
                  mainEntityOfPage: urlFor(locale),
                  author: {
                    '@type': 'Organization',
                    name: envConfigs.app_name,
                    url: envConfigs.app_url,
                  },
                },
                {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: envConfigs.app_name,
                      item: localizeUrl(`${envConfigs.app_url}/`, { locale })
                        .href,
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: meta.heading,
                      item: urlFor(locale),
                    },
                  ],
                },
              ],
            }).replace(/</g, '\\u003c'),
          },
        ],
      };
    },
    component: GuidePage,
  };
}

function GuidePage() {
  const { meta, slug, locale } = useLoaderData({ strict: false }) as GuideData;
  const Content = getPage(slug, locale).default;
  const t = (key: string) => tDynamic(`photocraft.${key}`);
  return (
    <PhotoCraftGuide
      brand={envConfigs.app_name}
      tag={t('brand.tag')}
      title={meta.heading}
      description={meta.description}
      category={meta.category}
      updated={`${t('guides.updated')} ${meta.updated_at}`}
      independent={t('footer.disclaimer')}
      languageHref={localizeHref(`/${slug}`, {
        locale: locale === 'en' ? 'zh' : 'en',
      })}
      languageLabel={locale === 'en' ? '中文' : 'EN'}
      tocLabel={t('guides.toc')}
      relatedLabel={t('guides.related')}
      downloadLabel={t('guides.download')}
      downloadDescription={t('guides.downloadDescription')}
      allGuidesLabel={t('nav.guides')}
      sections={meta.sections}
      related={relatedGuides[slug].map((item) => ({
        href: `/${item}`,
        title: t(`guides.${item}.title`),
        description: t(`guides.${item}.description`),
      }))}
    >
      <Content />
    </PhotoCraftGuide>
  );
}
