import { fetchAllSponsors, type SponsorsPayload } from '../_lib/afdian';

interface SecretBinding {
  get(key?: string): Promise<string>;
}

interface Env {
  // Names user actually configured in the Pages dashboard
  user_id?: string;
  api_token?: string;
  // Original planned names
  AifadianAPIToken?: string | SecretBinding;
  AifadianUserID?: string | SecretBinding;
  // Uppercase variants
  USER_ID?: string;
  API_TOKEN?: string;
  // Other naming conventions
  AIFADIAN_API_TOKEN?: string | SecretBinding;
  AIFADIAN_USER_ID?: string | SecretBinding;
  AFDIAN_API_TOKEN?: string | SecretBinding;
  AFDIAN_USER_ID?: string | SecretBinding;
  AFDIAN_TOKEN?: string | SecretBinding;
  AFDIAN_USERID?: string | SecretBinding;
  SECRETS?: SecretBinding;
  SECRETS_STORE?: SecretBinding;
  SECRET_STORE?: SecretBinding;
  AIFADIAN_SECRETS?: SecretBinding;
  CF_SECRETS?: SecretBinding;
  CLOUDFLARE_SECRETS?: SecretBinding;
  SECRET?: SecretBinding;
  SECRET_STORE_BINDING?: SecretBinding;
  [key: string]: unknown;
}

const isSecretBinding = (value: unknown): value is SecretBinding =>
  typeof value === 'object' && value !== null && typeof (value as SecretBinding).get === 'function';

const resolveSecret = async (value: string | SecretBinding | undefined): Promise<string> => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (isSecretBinding(value)) {
    try {
      return await value.get();
    } catch {
      return '';
    }
  }
  return '';
};

const resolveFromStore = async (
  env: Env,
  secretName: string,
): Promise<string> => {
  // Try the names user actually configured first
  if (secretName === 'AifadianAPIToken') {
    if (env.api_token && typeof env.api_token === 'string') return env.api_token;
    if (env.API_TOKEN && typeof env.API_TOKEN === 'string') return env.API_TOKEN;
  }
  if (secretName === 'AifadianUserID') {
    if (env.user_id && typeof env.user_id === 'string') return env.user_id;
    if (env.USER_ID && typeof env.USER_ID === 'string') return env.USER_ID;
  }

  const directBindings: Record<string, string | SecretBinding | undefined> = {
    AifadianAPIToken: env.AifadianAPIToken,
    AifadianUserID: env.AifadianUserID,
    AIFADIAN_API_TOKEN: env.AIFADIAN_API_TOKEN,
    AIFADIAN_USER_ID: env.AIFADIAN_USER_ID,
    AFDIAN_API_TOKEN: env.AFDIAN_API_TOKEN,
    AFDIAN_USER_ID: env.AFDIAN_USER_ID,
    AFDIAN_TOKEN: env.AFDIAN_TOKEN,
    AFDIAN_USERID: env.AFDIAN_USERID,
  };

  const directValue = await resolveSecret(directBindings[secretName]);
  if (directValue) return directValue;

  const storeBindings = [
    env.SECRETS,
    env.SECRETS_STORE,
    env.SECRET_STORE,
    env.AIFADIAN_SECRETS,
    env.CF_SECRETS,
    env.CLOUDFLARE_SECRETS,
    env.SECRET,
    env.SECRET_STORE_BINDING,
  ];

  for (const binding of storeBindings) {
    if (isSecretBinding(binding)) {
      try {
        const value = await binding.get(secretName);
        if (value) return value;
      } catch {
        // Continue
      }
    }
  }

  for (const [key, value] of Object.entries(env)) {
    if (isSecretBinding(value)) {
      try {
        const result = await value.get(secretName);
        if (result) return result;
      } catch {
        try {
          const result = await value.get();
          if (result) return result;
        } catch {
          // Continue
        }
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

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);

  // Debug mode: list env keys and their types
  const keys: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      keys[key] = 'undefined';
    } else if (value === null) {
      keys[key] = 'null';
    } else if (typeof value === 'string') {
      keys[key] = `string(${value.length})`;
    } else if (isSecretBinding(value)) {
      keys[key] = 'SecretBinding';
    } else {
      keys[key] = typeof value;
    }
  }

  if (url.searchParams.get('debug') === '1') {
    return jsonResponse({ debug: true, keys });
  }

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
