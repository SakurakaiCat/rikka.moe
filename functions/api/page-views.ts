import {
  type AnalyticsContext,
  jsonResponse,
} from '../_lib/analytics';

const POST_OPTIONS_HEADERS = {
  allow: 'POST, OPTIONS',
  'cache-control': 'no-store',
};

export const onRequestOptions = () =>
  new Response(null, { status: 204, headers: POST_OPTIONS_HEADERS });

export const onRequestPost = async ({ request, env }: AnalyticsContext) => {
  let paths: string[] = [];

  try {
    const body = await request.json<{ paths?: unknown[] } | null>();
    if (Array.isArray(body?.paths)) {
      paths = body.paths.filter((p: unknown): p is string => typeof p === 'string' && p.length > 0);
    }
  } catch {
    return jsonResponse({ views: {} });
  }

  if (!paths.length) {
    return jsonResponse({ views: {} });
  }

  // D1 has a 999-parameter limit; cap to stay well under it.
  paths = paths.slice(0, 100);

  const placeholders = paths.map(() => '?').join(', ');
  const result = await env.DB.prepare(
    `SELECT path, COUNT(*) as views
     FROM visit_logs
     WHERE counted_as_pageview = 1 AND path IN (${placeholders})
     GROUP BY path`,
  )
    .bind(...paths)
    .all<{ path: string; views: number | string }>();

  const views: Record<string, number> = {};
  for (const row of result.results) {
    views[row.path] = typeof row.views === 'number'
      ? row.views
      : Number.parseInt(String(row.views), 10) || 0;
  }

  return jsonResponse({ views });
};
