import { fetchAllSponsors, type SponsorsPayload } from '../_lib/afdian';

interface SecretBinding {
  get(): Promise<string>;
}

interface Env {
  AifadianAPIToken?: string | SecretBinding;
  AifadianUserID?: string | SecretBinding;
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
  let token: string;
  let userId: string;
  try {
    token = await resolveSecret(env.AifadianAPIToken);
    userId = await resolveSecret(env.AifadianUserID);
  } catch (error) {
    return jsonResponse(
      { error: 'binding_resolution_failed' },
      { status: 500, cache: 'no-store' },
    );
  }

  if (!token || !userId) {
    return jsonResponse({
      sponsors: [],
      total: 0,
      updated_at: Math.floor(Date.now() / 1000),
    });
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
