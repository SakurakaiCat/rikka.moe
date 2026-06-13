import { createHash } from 'crypto';

const ARTIC_IIIF_BASE = 'https://www.artic.edu/iiif/2';
const ARTIC_API_BASE = 'https://api.artic.edu/api/v1';

interface ArtworkEntry {
  id: number;
  title: string;
  image_id: string;
}

let _pool: ArtworkEntry[] | null = null;

async function ensurePool(): Promise<ArtworkEntry[]> {
  if (_pool) return _pool;

  const pageSize = 100;
  const url = `${ARTIC_API_BASE}/artworks/search?` +
    `query[term][is_public_domain]=true` +
    `&fields=id,title,image_id` +
    `&limit=${pageSize}` +
    `&page=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      _pool = [];
      return _pool;
    }
    const json: any = await res.json();
    const items: ArtworkEntry[] = (json.data || []).filter((item: ArtworkEntry) => item.image_id);
    _pool = items;
  } catch {
    _pool = [];
  }

  return _pool;
}

function hashSlug(slug: string): number {
  const h = createHash('sha256').update(slug).digest();
  return h.readUInt32BE(0);
}

export function articImageUrl(imageId: string, width = 800): string {
  return `${ARTIC_IIIF_BASE}/${imageId}/full/${width},/0/default.jpg`;
}

export async function artFallbackForSlug(slug: string, width = 800): Promise<string> {
  const pool = await ensurePool();
  if (!pool.length) return '/images/profile/background.jpg';
  const idx = hashSlug(slug) % pool.length;
  return articImageUrl(pool[idx].image_id, width);
}

export async function resolveArtFallbacks(
  slugs: string[],
  width = 800,
): Promise<Map<string, string>> {
  await ensurePool();
  const map = new Map<string, string>();
  for (const slug of slugs) {
    map.set(slug, await artFallbackForSlug(slug, width));
  }
  return map;
}
