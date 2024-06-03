import { getAppDepsHandler } from '@verity/deps-api';

export async function GET(request: Request) {
  return getAppDepsHandler(request);
}
