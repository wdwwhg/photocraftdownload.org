import { createFileRoute } from '@tanstack/react-router';

import { guidePageRouteOptions } from './-guide-page';

export const Route = createFileRoute('/(guides)/photocraft-rust')(
  guidePageRouteOptions('photocraft-rust')
);
