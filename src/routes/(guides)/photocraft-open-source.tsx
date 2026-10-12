import { createFileRoute } from '@tanstack/react-router';

import { guidePageRouteOptions } from './-guide-page';

export const Route = createFileRoute('/(guides)/photocraft-open-source')(
  guidePageRouteOptions('photocraft-open-source')
);
