import { fetchAllSponsors, type SponsorsPayload } from '../_lib/afdian';

interface SecretBinding {
  get(key?: string): Promise<string>;
}

interface Env {
  // Direct env vars or individual secret bindings
  AifadianAPIToken?: string | SecretBinding;
  AifadianUserID?: string | SecretBinding;
  // Secrets Store namespace bindings (common names)
  SECRETS?: SecretBinding;
  SECRETS_STORE?: SecretBinding;
  SECRET_STORE?: SecretBinding;
  AIFADIAN_SECRETS?: SecretBinding;
  CF_SECRETS?: SecretBinding;
}

const isSecretBinding = (value: unknown): value is SecretBinding =>
  typeof value === 'object' && value !== null && typeof (value as SecretBinding).get === 'function';

const resolveSecret = async (value: string | SecretBinding | undefined): Promise<string> => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (isSecretBinding(value)) {
    try {
      // Try without key first (individual secret binding)
      return await value.get();
    } catch {
      // If that fails, the binding might require a key
      return '';
    }
  }
  return '';
};

const resolveFromStore = async (
  env: Env,
  secretName: string,
): Promise<string> => {
  // Try direct env var / individual binding first
  const direct =
    secretName === 'AifadianAPIToken'
      ? await resolveSecret(env.AifadianAPIToken)
      : secretName === 'AifadianUserID'
        ? await resolveSecret(env.AifadianUserID)
        : '';
  if (direct) return direct;

  // Try Secrets Store namespace bindings with common names
  const storeBindings = [env.SECRETS, env.SECRETS_STORE, env.SECRET_STORE, env.AIFADIAN_SECRETS, env.CF_SECRETS];
  for (const binding of storeBindings) {
    if (isSecretBinding(binding)) {
      try {
        const value = await binding.get(secretName);
        if (value) return value;
      } catch {
        // Continue to next binding
      }
    }
  }

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
  const token = await resolveFromStore(env as unknown as Env, 'AifadianAPIToken');
  const userId = await resolveFromStore(env as unknown as Env, 'AifadianUserID');

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
