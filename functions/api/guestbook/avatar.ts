import { generateIdenticonSvg } from '../../_lib/guestbook';

const parseSize = (value: string | null) => {
  if (!value) {
    return 96;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return 96;
  }

  return Math.min(160, Math.max(48, parsed));
};

export const onRequestGet = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const rawSeed = url.searchParams.get('seed') ?? 'guestbook';
  const seed = rawSeed.slice(0, 128);
  const size = parseSize(url.searchParams.get('size'));
  const svg = generateIdenticonSvg(seed, size);

  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable',
      'content-security-policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
    },
  });
};
