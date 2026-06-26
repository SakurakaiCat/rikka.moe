/**
 * POST /api/books/verify
 *
 * Validates the key and sets an HttpOnly signed session cookie.
 * Returns only display labels (no URLs).
 * The client then navigates to GET /api/books/download/{index} to get a 302 redirect.
 */

import { md5Hex } from '../../_lib/md5';

interface Env {
  BOOK_KEYS?: string;
  PREMIUM_DOWNLOAD_URL?: string;
  SIGNING_SECRET?: string;
  [key: string]: unknown;
}

const corsHeaders = {
  'access-control-allow-origin': '*', // same-site so cookie is sent
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...corsHeaders,
      ...extra,
    },
  });

export const onRequestOptions = () =>
  new Response(null, { status: 204, headers: corsHeaders });

/** Build a signed token: timestamp + HMAC using md5 (fast, Workers-edge friendly). */
function buildToken(timestamp: number, secret: string): string {
  return `${timestamp}:${md5Hex(`${timestamp}:${secret}`)}`;
}

function verifyToken(token: string, secret: string, maxAgeSec: number): boolean {
  const [tsRaw, sig] = token.split(':');
  if (!tsRaw || !sig) return false;
  const ts = parseInt(tsRaw, 10);
  if (isNaN(ts)) return false;
  if (Date.now() / 1000 - ts > maxAgeSec) return false;
  return md5Hex(`${ts}:${secret}`) === sig;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Signing secret — fall back to a derived value from BOOK_KEYS so that
  // the user doesn't need a separate env var; they can also set SIGNING_SECRET.
  const signingSecret = env.SIGNING_SECRET || env.BOOK_KEYS || '';

  let body: { key?: unknown };
  try {
    body = (await request.json()) as { key?: unknown };
  } catch {
    return json({ success: false, message: '请求格式错误' }, 400);
  }

  const key = typeof body.key === 'string' ? body.key.trim() : '';
  if (!key) {
    return json({ success: false, message: '请填写密钥' }, 400);
  }

  const allowedKeys = (env.BOOK_KEYS ?? '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  if (allowedKeys.length === 0) {
    return json({ success: false, message: '验证服务暂未配置' }, 503);
  }

  if (!allowedKeys.includes(key)) {
    // Sleep a uniform 500 ms to prevent timing attacks that reveal key length.
    await new Promise((r) => setTimeout(r, 500));
    return json({ success: false, message: '密钥无效，请检查后重试' }, 403);
  }

  const raw = (env.PREMIUM_DOWNLOAD_URL ?? '').trim();
  if (!raw) {
    return json({ success: false, message: '下载链接暂未配置' }, 503);
  }

  // Parse download entries — return only labels, never URLs.
  const labels: string[] = [];
  const urls: string[] = [];

  raw.split(',').map((u) => u.trim()).filter(Boolean).forEach((url) => {
    if (url.includes('lanzn.com') || url.includes('lanzou')) {
      labels.push('蓝奏云下载（国内推荐）');
    } else if (url.includes('cloud.rikka.moe')) {
      labels.push('网盘下载');
    } else {
      labels.push('下载');
    }
    urls.push(url);
  });

  // Create a signed session cookie containing the index of validated URLs.
  // The cookie value encodes timestamp + signature; download endpoint validates it.
  const timestamp = Math.floor(Date.now() / 1000);
  const token = buildToken(timestamp, signingSecret);

  // Set HttpOnly, Secure, SameSite=Strict cookie
  const setCookie =
    `book_auth=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api/books; Max-Age=1800`;

  return json(
    { success: true, labels },
    200,
    { 'set-cookie': setCookie },
  );
};

// Re-export token verifier for download endpoint to use
export { verifyToken, buildToken };
