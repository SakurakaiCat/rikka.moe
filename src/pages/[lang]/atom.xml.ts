import { getPostsByLocale, LOCALES, postCategories, postUrl, stripHtml, toAbsoluteUrl } from '../../lib/content';
import { categoryName } from '../../lib/i18n';

function escapeXml(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { lang: locale.lang_path }, props: { locale } }));
}

export async function GET({ props }: any) {
  const { locale } = props;
  const posts = (await getPostsByLocale(locale)).slice(0, 25);
  const updated = posts[0]?.data.updated || posts[0]?.data.date || new Date();
  const entries = posts.map((post) => {
    const url = toAbsoluteUrl('https://rikka.moe', postUrl(post));
    const published = post.data.date ? new Date(post.data.date as any).toISOString() : new Date().toISOString();
    const modified = post.data.updated ? new Date(post.data.updated as any).toISOString() : published;
    const categories = postCategories(post).map((category) => `    <category term="${escapeXml(categoryName(category, locale))}"/>`).join('\n');
    return `<entry>
    <title>${escapeXml(post.data.title || '')}</title>
    <link href="${escapeXml(url)}" rel="alternate" type="text/html" hreflang="${escapeXml(locale.html_lang)}"/>
    <id>${escapeXml(url)}</id>
    <published>${published}</published>
    <updated>${modified}</updated>
    <summary>${escapeXml(post.data.description || stripHtml(post.body).slice(0, 300))}</summary>
${categories}
  </entry>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Akari - ${escapeXml(locale.display_name)}</title>
  <link href="${escapeXml(toAbsoluteUrl('https://rikka.moe', `/${locale.lang_path}/`))}" rel="alternate" type="text/html" hreflang="${escapeXml(locale.html_lang)}"/>
  <link href="${escapeXml(toAbsoluteUrl('https://rikka.moe', `/${locale.lang_path}/atom.xml`))}" rel="self" type="application/atom+xml"/>
  <id>${escapeXml(toAbsoluteUrl('https://rikka.moe', `/${locale.lang_path}/`))}</id>
  <updated>${new Date(updated as any).toISOString()}</updated>
  <author><name>Akari / 篠崎香澄</name></author>
  <subtitle>${escapeXml(locale.home_subtitle)}</subtitle>
  ${entries}
</feed>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
}
