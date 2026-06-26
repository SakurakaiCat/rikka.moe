/**
 * GET /api/books/download/{index}
 *
 * Checks the HttpOnly signed cookie set by /api/books/verify.
 * If valid, 302 redirects to the real download URL.
 * The URL never appears in page source or JS — only as a temporary
 * redirect in the browser's network stack.
 */

import { verifyToken } from '../verify';

interface Env {
  BOOK_KEYS?: string;
  PREMIUM_DOWNLOAD_URL?: string;
  SIGNING_SECRET?: string;
  [key: string]: unknown;
}

const COOKIE_NAME = 'book_auth';
const MAX_COOKIE_AGE_SEC = 1800; // 30 minutes

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const signingSecret = env.SIGNING_SECRET || env.BOOK_KEYS || '';

  // 1. Validate cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) {
    return new Response('Unauthorized', { status: 401 });
  }
  const token = match.slice(COOKIE_NAME.length + 1);
  if (!verifyToken(token, signingSecret, MAX_COOKIE_AGE_SEC)) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. Get requested index
  const indexStr = (params as Record<string, string>).index ?? '0';
  const index = parseInt(indexStr, 10);
  if (isNaN(index) || index < 0) {
    return new Response('Bad Request', { status: 400 });
  }

  // 3. Resolve URL
  const raw = (env.PREMIUM_DOWNLOAD_URL ?? '').trim();
  const urls = raw.split(',').map((u) => u.trim()).filter(Boolean);

  if (index >= urls.length) {
    return new Response('Not Found', { status: 404 });
  }

  const targetUrl = urls[index];

  // 4. 302 redirect — URL only appears as a Location header which
  //    the browser follows immediately; it won't be in page HTML or JS.
  return new Response(null, {
    status: 302,
    headers: {
      Location: targetUrl,
      'Cache-Control': 'no-store',
    },
  });
};
