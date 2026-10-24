import type { ComponentType } from 'react';
import { notFound, useLoaderData } from '@tanstack/react-router';

import { tDynamic } from '@/core/i18n/dynamic';
import { envConfigs } from '@/config';
import { isPageIndexable, pageRobots } from '@/lib/search-policy';
import { getLocale, localizeUrl } from '@/paraglide/runtime.js';
import { PhotoCraftGuide } from '@/components/photocraft/guide';
import { relatedGuides, type GuideSlug } from '@/components/photocraft/guides';
import policy from '@/content/search-policy.json';

type GuideMeta = {
  title: string;
  heading: string;
  description: string;
  category: string;
  published_at?: string;
  updated_at: string;
  sections: string[];
  schemaType?: 'Article' | 'CollectionPage';
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
      if (policy.retiredGuideSlugs.includes(slug)) throw notFound();
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
          { name: 'robots', content: pageRobots(slug, locale) },
          { property: 'og:title', content: meta.title },
          { property: 'og:description', content: meta.description },
          {
            property: 'og:type',
            content:
              meta.schemaType === 'CollectionPage' ? 'website' : 'article',
          },
          { property: 'og:url', content: urlFor(locale) },
          { name: 'twitter:card', content: 'summary' },
        ],
        links: [{ rel: 'canonical', href: urlFor(locale) }],
        scripts: [
          {
            type: 'application/ld+json',
            children: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': meta.schemaType ?? 'Article',
                  name: meta.heading,
                  url: urlFor(locale),
                  headline: meta.heading,
                  description: meta.description,
                  inLanguage: locale,
                  datePublished: meta.published_at ?? '2026-10-12',
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
      slug={slug}
      skipLabel={t('skip')}
      privacyLabel={t('footer.privacy')}
      termsLabel={t('footer.terms')}
      tocLabel={t('guides.toc')}
      relatedLabel={t('guides.related')}
      downloadLabel={t('guides.download')}
      downloadDescription={t('guides.downloadDescription')}
      allGuidesLabel={t('nav.guides')}
      sections={meta.sections}
      related={relatedGuides[slug]
        .filter((item) => isPageIndexable(item))
        .map((item) => ({
          href: `/${item}`,
          title: t(`guides.${item}.title`),
          description: t(`guides.${item}.description`),
        }))}
    >
      <Content />
    </PhotoCraftGuide>
  );
}
