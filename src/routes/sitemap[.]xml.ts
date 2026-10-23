import { createFileRoute } from '@tanstack/react-router';

// Generated from search-policy.json before builds; static and app hosting agree.
import sitemap from '../../public/sitemap.xml?raw';

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(sitemap, {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        }),
    },
  },
});
