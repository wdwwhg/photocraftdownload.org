import policy from '@/content/search-policy.json';

// Keep translations and reference pages accessible. Crawlers must be able to
// fetch them to see the noindex, so do not disallow these URLs in robots.txt.
export function isPageIndexable(path: string, locale = 'en'): boolean {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  return (
    locale === policy.primaryLocale &&
    normalized !== 'zh' &&
    !normalized.startsWith('zh/') &&
    !policy.retiredGuideSlugs.includes(normalized) &&
    !policy.noindexGuideSlugs.includes(normalized)
  );
}

export function pageRobots(path: string, locale = 'en'): string {
  return isPageIndexable(path, locale) ? 'index,follow' : 'noindex,follow';
}
