import { createHash } from 'crypto';

const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1';

interface ArtworkEntry {
  title: string;
  imageUrl: string;
}

let _pool: ArtworkEntry[] | null = null;

async function fetchObjectImage(objectID: number): Promise<ArtworkEntry | null> {
  try {
    const res = await fetch(`${MET_API_BASE}/objects/${objectID}`);
    if (!res.ok) return null;
    const data: any = await res.json();
    const imageUrl = data?.primaryImageSmall || data?.primaryImage || '';
    if (!imageUrl) return null;
    return { title: data.title || '', imageUrl };
  } catch {
    return null;
  }
}

async function ensurePool(): Promise<ArtworkEntry[]> {
  if (_pool) return _pool;

  try {
    const searchRes = await fetch(
      `${MET_API_BASE}/search?hasImages=true&q=painting&isPublicDomain=true`,
    );
    if (!searchRes.ok) {
      _pool = [];
      return _pool;
    }
    const searchData: any = await searchRes.json();
    const objectIDs: number[] = searchData.objectIDs || [];

    const batchResults = await Promise.allSettled(
      objectIDs.map((id) => fetchObjectImage(id)),
    );

    _pool = batchResults
      .filter((r): r is { status: 'fulfilled'; value: ArtworkEntry | null } =>
        r.status === 'fulfilled' && r.value !== null,
      )
      .map((r) => r.value!);
  } catch {
    _pool = [];
  }

  return _pool;
}

function hashSlug(slug: string): number {
  const h = createHash('sha256').update(slug).digest();
  return h.readUInt32BE(0);
}

export async function artFallbackForSlug(slug: string): Promise<string> {
  const pool = await ensurePool();
  if (!pool.length) return '/images/profile/background.jpg';
  const idx = hashSlug(slug) % pool.length;
  return pool[idx].imageUrl;
}

export async function resolveArtFallbacks(
  slugs: string[],
): Promise<Map<string, string>> {
  await ensurePool();
  const map = new Map<string, string>();
  for (const slug of slugs) {
    map.set(slug, await artFallbackForSlug(slug));
  }
  return map;
}
