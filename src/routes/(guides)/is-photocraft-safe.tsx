import { createFileRoute } from '@tanstack/react-router';

import { guidePageRouteOptions } from './-guide-page';

export const Route = createFileRoute('/(guides)/is-photocraft-safe')(
  guidePageRouteOptions('is-photocraft-safe')
);
