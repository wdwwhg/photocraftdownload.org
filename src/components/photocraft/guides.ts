import { isPageIndexable } from '@/lib/search-policy';
import policy from '@/content/search-policy.json';

export const guideSlugs = [
  'is-photocraft-safe',
  'photocraft-installer-not-working',
  'photocraft-vs-vectorcraft',
  'photocraft-github',
  'photocraft-version-history',
  'photocraft-download-files',
  'photocraft-tutorial',
  'photocraft-artcraft',
  'photocraft-review',
  'photocraft-windows',
  'photocraft-macos',
  'photocraft-web',
  'what-is-photocraft',
  'photocraft-free',
  'photocraft-rust',
  'photocraft-vs-photoshop',
  'photocraft-open-source',
  'photocraft-linux',
  'photocraft-reddit',
  'photocraft-alternative',
  'photocraft-app',
  'vectorcraft',
  'filmcraft',
  'lightcraft',
] as const;

export type GuideSlug = (typeof guideSlugs)[number];

// Editorial priorities shared with the sitemap and rendered-page checks.
export const priorityGuideSlugs = policy.priorityGuideSlugs as GuideSlug[];

export const homepageGuideGroups = [
  {
    key: 'comparisons',
    slugs: ['photocraft-review', 'photocraft-vs-photoshop'],
  },
  {
    key: 'tutorials',
    slugs: ['photocraft-github', 'photocraft-tutorial', 'photocraft-free'],
  },
  {
    key: 'platforms',
    slugs: ['photocraft-windows', 'photocraft-macos', 'photocraft-linux'],
  },
  { key: 'alternatives', slugs: ['photocraft-alternative'] },
] as const satisfies readonly { key: string; slugs: readonly GuideSlug[] }[];

export const homepageRelatedGuides = guideSlugs.filter(
  (slug) => isPageIndexable(slug) && !priorityGuideSlugs.includes(slug)
);

export const relatedGuides: Record<GuideSlug, GuideSlug[]> = {
  'photocraft-download-files': [
    'photocraft-windows',
    'photocraft-macos',
    'photocraft-linux',
    'photocraft-version-history',
    'is-photocraft-safe',
  ],
  'is-photocraft-safe': [
    'photocraft-download-files',
    'photocraft-version-history',
    'photocraft-installer-not-working',
    'photocraft-github',
  ],
  'photocraft-installer-not-working': [
    'is-photocraft-safe',
    'photocraft-windows',
    'photocraft-macos',
    'photocraft-linux',
  ],
  'photocraft-vs-vectorcraft': [
    'vectorcraft',
    'photocraft-artcraft',
    'photocraft-vs-photoshop',
  ],
  'photocraft-github': [
    'photocraft-download-files',
    'photocraft-windows',
    'photocraft-version-history',
    'photocraft-open-source',
  ],
  'photocraft-version-history': [
    'photocraft-download-files',
    'photocraft-windows',
    'photocraft-macos',
    'photocraft-linux',
  ],
  'photocraft-tutorial': [
    'photocraft-app',
    'photocraft-review',
    'photocraft-vs-photoshop',
  ],
  'photocraft-artcraft': [
    'what-is-photocraft',
    'photocraft-vs-vectorcraft',
    'photocraft-github',
  ],
  'photocraft-review': [
    'photocraft-tutorial',
    'photocraft-vs-photoshop',
    'photocraft-version-history',
  ],
  'photocraft-windows': [
    'photocraft-download-files',
    'photocraft-installer-not-working',
    'is-photocraft-safe',
    'photocraft-macos',
    'photocraft-tutorial',
    'photocraft-linux',
  ],
  'photocraft-macos': [
    'photocraft-installer-not-working',
    'is-photocraft-safe',
    'photocraft-windows',
    'photocraft-linux',
    'photocraft-github',
  ],
  'photocraft-web': ['photocraft-github', 'photocraft-rust', 'photocraft-app'],
  'what-is-photocraft': [
    'photocraft-tutorial',
    'photocraft-free',
    'photocraft-artcraft',
  ],
  'photocraft-free': [
    'photocraft-open-source',
    'photocraft-github',
    'photocraft-review',
  ],
  'photocraft-rust': [
    'photocraft-github',
    'photocraft-open-source',
    'photocraft-web',
  ],
  'photocraft-vs-photoshop': [
    'photocraft-alternative',
    'photocraft-app',
    'photocraft-linux',
  ],
  'photocraft-open-source': [
    'photocraft-github',
    'photocraft-rust',
    'photocraft-free',
  ],
  'photocraft-linux': [
    'photocraft-installer-not-working',
    'is-photocraft-safe',
    'photocraft-app',
    'photocraft-open-source',
    'lightcraft',
  ],
  'photocraft-reddit': [
    'photocraft-open-source',
    'photocraft-vs-photoshop',
    'photocraft-app',
  ],
  'photocraft-alternative': [
    'photocraft-vs-photoshop',
    'photocraft-linux',
    'lightcraft',
  ],
  'photocraft-app': [
    'photocraft-tutorial',
    'photocraft-web',
    'photocraft-vs-photoshop',
  ],
  vectorcraft: ['photocraft-app', 'filmcraft', 'lightcraft'],
  filmcraft: ['vectorcraft', 'lightcraft', 'photocraft-app'],
  lightcraft: ['photocraft-app', 'vectorcraft', 'filmcraft'],
};

export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');
}
