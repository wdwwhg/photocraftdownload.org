export const guideSlugs = [
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

export const relatedGuides: Record<GuideSlug, GuideSlug[]> = {
  'photocraft-vs-photoshop': [
    'photocraft-alternative',
    'photocraft-app',
    'photocraft-linux',
  ],
  'photocraft-open-source': [
    'photocraft-app',
    'photocraft-reddit',
    'vectorcraft',
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
    'photocraft-linux',
    'photocraft-open-source',
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
