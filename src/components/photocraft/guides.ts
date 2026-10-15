export const guideSlugs = [
  'photocraft-vs-vectorcraft',
  'photocraft-github',
  'photocraft-version-history',
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

export const homepageGuideGroups = [
  {
    key: 'comparisons',
    slugs: [
      'photocraft-vs-vectorcraft',
      'photocraft-review',
      'photocraft-vs-photoshop',
    ],
  },
  {
    key: 'tutorials',
    slugs: [
      'photocraft-github',
      'photocraft-version-history',
      'photocraft-tutorial',
      'photocraft-artcraft',
      'what-is-photocraft',
      'photocraft-free',
      'photocraft-rust',
      'photocraft-app',
      'photocraft-open-source',
      'photocraft-reddit',
    ],
  },
  {
    key: 'platforms',
    slugs: [
      'photocraft-windows',
      'photocraft-macos',
      'photocraft-linux',
      'photocraft-web',
    ],
  },
  { key: 'alternatives', slugs: ['photocraft-alternative'] },
] as const satisfies readonly { key: string; slugs: readonly GuideSlug[] }[];

export const homepageRelatedGuides = [
  'vectorcraft',
  'filmcraft',
  'lightcraft',
] as const satisfies readonly GuideSlug[];

export const relatedGuides: Record<GuideSlug, GuideSlug[]> = {
  'photocraft-vs-vectorcraft': [
    'vectorcraft',
    'photocraft-artcraft',
    'photocraft-vs-photoshop',
  ],
  'photocraft-github': [
    'photocraft-windows',
    'photocraft-version-history',
    'photocraft-open-source',
  ],
  'photocraft-version-history': [
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
    'photocraft-macos',
    'photocraft-tutorial',
    'photocraft-linux',
  ],
  'photocraft-macos': [
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
