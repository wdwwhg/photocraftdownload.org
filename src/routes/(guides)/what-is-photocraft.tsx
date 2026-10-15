import { createFileRoute } from '@tanstack/react-router';

import { guidePageRouteOptions } from './-guide-page';

export const Route = createFileRoute('/(guides)/what-is-photocraft')(
  guidePageRouteOptions('what-is-photocraft')
);
