import { fetchAllSponsors, type SponsorsPayload } from '../_lib/afdian';

interface SecretBinding {
  get(): Promise<string>;
}

interface Env {
  // Primary names (Secrets Store bindings or plain strings)
  AifadianAPIToken?: string | SecretBinding;
  AifadianUserID?: string | SecretBinding;
  // Fallback names (common alternate naming conventions)
  AFDIAN_API_TOKEN?: string | SecretBinding;
  AFDIAN_USER_ID?: string | SecretBinding;
  AFDIAN_TOKEN?: string | SecretBinding;
  AFDIAN_USERID?: string | SecretBinding;
}

const isSecretBinding = (value: unknown): value is SecretBinding =>
  typeof value === 'object' && value !== null && typeof (value as SecretBinding).get === 'function';

const resolveSecret = async (value: string | SecretBinding | undefined): Promise<string> => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (isSecretBinding(value)) return await value.get();
  return '';
};

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

const jsonResponse = (
  body: unknown,
  init: { status?: number; cache?: string } = {},
) =>
  new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': init.cache ?? 'public, s-maxage=3600, stale-while-revalidate=86400',
      ...corsHeaders,
    },
  });

export const onRequestOptions = () =>
  new Response(null, { status: 204, headers: corsHeaders });

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  // Try multiple possible env var names for compatibility
  const token =
    (await resolveSecret(env.AifadianAPIToken)) ||
    (await resolveSecret(env.AFDIAN_API_TOKEN)) ||
    (await resolveSecret(env.AFDIAN_TOKEN));

  const userId =
    (await resolveSecret(env.AifadianUserID)) ||
    (await resolveSecret(env.AFDIAN_USER_ID)) ||
    (await resolveSecret(env.AFDIAN_USERID));

  if (!token || !userId) {
    return jsonResponse(
      { error: 'not_configured', message: 'Aifadian API credentials not configured' },
      { status: 500, cache: 'no-store' },
    );
  }

  try {
    const payload: SponsorsPayload = await fetchAllSponsors(userId, token);
    return jsonResponse(payload);
  } catch {
    return jsonResponse(
      { error: 'upstream_failed' },
      { status: 502, cache: 'no-store' },
    );
  }
};
