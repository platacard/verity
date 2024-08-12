import { NextResponse } from 'next/server';

import { metrics } from '@verity/metrics';

export const GET = async () => {
  const resp = await metrics.getMetrics();

  metrics.resetMetrics();

  return NextResponse.json(resp, {
    status: 200,
    headers: {
      'Content-Type': metrics.getContentType(),
    },
  });
};
