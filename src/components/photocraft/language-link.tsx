import { getLocale, localizeHref } from '@/paraglide/runtime.js';

export function LanguageLink({ href = '/' }: { href?: string }) {
  const locale = getLocale() === 'zh' ? 'en' : 'zh';
  return (
    <a
      className="pc-language"
      href={localizeHref(href, { locale })}
      hrefLang={locale}
      lang={locale}
      aria-label={locale === 'zh' ? '切换到中文' : 'Switch to English'}
    >
      {locale === 'zh' ? '中文' : 'EN'}
    </a>
  );
}
