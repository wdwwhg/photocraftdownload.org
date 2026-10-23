import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { pageRobots } from '@/lib/search-policy';
import { m } from '@/paraglide/messages.js';
import { getLocale, localizeUrl } from '@/paraglide/runtime.js';
import { formatReleaseCopy, release } from '@/components/photocraft/downloads';
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
    const title = formatReleaseCopy(m['photocraft.meta.title']({}, { locale }));
    const description = formatReleaseCopy(
      m['photocraft.meta.description']({}, { locale })
    );
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { name: 'robots', content: pageRobots('/', locale) },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: urlFor(locale) },
        {
          property: 'og:image',
          content: `${envConfigs.app_url.replace(/\/$/, '')}/imgs/photocraft/captures/windows-0.9.0-levels.png`,
        },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      links: [{ rel: 'canonical', href: urlFor(locale) }],
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
            dateModified: release.checked,
            about: {
              '@type': 'SoftwareApplication',
              name: 'PhotoCraft',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Windows, macOS, Linux',
              softwareVersion: release.version,
              url: 'https://getartcraft.com/apps/photocraft',
              author: {
                '@type': 'Organization',
                name: 'ArtCraft',
                url: 'https://getartcraft.com',
              },
              license: `${release.repository}/blob/v${release.version}/LICENSE-MIT`,
              isAccessibleForFree: true,
            },
          }).replace(/</g, '\\u003c'),
        },
      ],
    };
  },
  component: HomePage,
});
