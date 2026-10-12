import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import { PhotoCraftHome } from '@/components/photocraft/home';

function HomePage() {
  return <PhotoCraftHome />;
}

export const Route = createFileRoute('/')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? 'en';
    const urlFor = (loc: string) =>
      localizeUrl(`${envConfigs.app_url.replace(/\/$/, '')}/`, {
        locale: loc as 'en' | 'zh',
      }).href;
    const title = m['photocraft.meta.title']({}, { locale });
    const description = m['photocraft.meta.description']({}, { locale });
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: urlFor(locale) },
        {
          property: 'og:image',
          content: `${envConfigs.app_url.replace(/\/$/, '')}/imgs/photocraft/interface.jpg`,
        },
        { name: 'twitter:card', content: 'summary_large_image' },
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
            '@type': 'WebPage',
            name: title,
            description,
            url: urlFor(locale),
            inLanguage: locale,
            about: {
              '@type': 'SoftwareApplication',
              name: 'PhotoCraft',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Windows, macOS, Linux',
              softwareVersion: '0.7.0',
              url: 'https://getartcraft.com/apps/photocraft',
              author: {
                '@type': 'Organization',
                name: 'ArtCraft',
                url: 'https://getartcraft.com',
              },
              license:
                'https://github.com/storytold/photocraft/blob/v0.7.0/LICENSE-MIT',
              isAccessibleForFree: true,
            },
          }).replace(/</g, '\\u003c'),
        },
      ],
    };
  },
  component: HomePage,
});
