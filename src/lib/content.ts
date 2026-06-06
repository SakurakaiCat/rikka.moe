import { getCollection, type CollectionEntry } from 'astro:content';
import localeMap from '../data/locales.json';

export type Locale = {
  lang: string;
  lang_path: string;
  display_name: string;
  html_lang: string;
  og_locale: string;
  home_subtitle: string;
  home_description: string;
  archive_description: string;
  browser_lang_patterns?: string[];
};

export const LOCALES = Object.values(localeMap) as Locale[];
export const DEFAULT_LOCALE = (localeMap as Record<string, Locale>).en;

export type PostEntry = CollectionEntry<'posts'>;
export type PageEntry = CollectionEntry<'pages'>;

export function stripIndexHtml(routePath: string) {
  return String(routePath || '').replace(/index\.html$/i, '');
}

export function normalizeRoutePath(routePath: string) {
  let normalized = stripIndexHtml(routePath).trim();
  if (!normalized) return '/';
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;
  normalized = normalized.replace(/\/{2,}/g, '/');
  if (normalized !== '/' && !normalized.endsWith('/')) normalized += '/';
  return normalized;
}

export function toAbsoluteUrl(site: string, path: string) {
  return new URL(normalizeRoutePath(path), site).toString();
}

export function homePath(locale: Locale) {
  return normalizeRoutePath(locale.lang_path);
}

export function archivePath(locale: Locale) {
  return normalizeRoutePath(`${locale.lang_path}/archives`);
}

export function aboutPath(locale: Locale) {
  return normalizeRoutePath(`${locale.lang_path}/about`);
}

export function getLocaleByPath(langPath?: string) {
  return LOCALES.find((locale) => locale.lang_path === langPath) || null;
}

export function getLocaleByLang(lang?: string) {
  return LOCALES.find((locale) => locale.lang === lang) || null;
}

export function resolveLocale(input?: { lang?: string; lang_path?: string; id?: string }) {
  return getLocaleByLang(input?.lang) || getLocaleByPath(input?.lang_path) || getLocaleByPath(input?.id?.split('/')[0]) || DEFAULT_LOCALE;
}

export function asDate(value: unknown) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function dateParts(value: unknown) {
  const date = asDate(value) || new Date();
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return { date, year, month, day };
}

export function postUrl(post: PostEntry) {
  if (post.data.permalink) return normalizeRoutePath(post.data.permalink);
  const locale = resolveLocale(post.data);
  const { year, month, day } = dateParts(post.data.date);
  const slug = post.data.url_slug || post.data.slug || post.id.replace(/\.mdx?$/, '').split('/').pop() || post.id.replace(/\.mdx?$/, '');
  return normalizeRoutePath(`${locale.lang_path}/${year}/${month}/${day}/${slug}`);
}

export function pageUrl(page: PageEntry) {
  if (page.data.permalink) return normalizeRoutePath(page.data.permalink);
  if (page.data.is_locale_selector || page.id === 'root/index.md') return '/';
  const id = page.id.replace(/\.mdx?$/, '').replace(/\/index$/, '');
  return normalizeRoutePath(id);
}

export function categorySlug(category: string) {
  return category.trim().toLowerCase().replace(/\s+/g, '-');
}

export function postCategories(post: PostEntry) {
  return Array.isArray(post.data.categories) ? post.data.categories : [];
}

export function postTags(post: PostEntry) {
  return Array.isArray(post.data.tags) ? post.data.tags : [];
}

export async function getAllPosts() {
  const posts = await getCollection('posts', (entry) => entry.data.indexing !== false);
  return posts.sort((a, b) => (asDate(b.data.date)?.getTime() || 0) - (asDate(a.data.date)?.getTime() || 0));
}

export async function getPostsByLocale(locale: Locale) {
  const posts = await getAllPosts();
  return posts.filter((post) => resolveLocale(post.data).lang === locale.lang);
}

export function adjacentPosts(posts: PostEntry[], current: PostEntry) {
  const index = posts.findIndex((post) => post.id === current.id);
  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export function languageOptions(_currentPath: string, currentLocale: Locale, translationKey?: string, entries: Array<PostEntry | PageEntry> = []) {
  const siblings = translationKey ? entries.filter((entry) => entry.data.translation_key === translationKey) : [];
  return LOCALES.map((locale) => {
    const sibling = siblings.find((entry) => resolveLocale(entry.data).lang === locale.lang);
    const relativeUrl = sibling ? (sibling.collection === 'posts' ? postUrl(sibling as PostEntry) : pageUrl(sibling as PageEntry)) : homePath(locale);
    return { ...locale, relativeUrl, absoluteUrl: toAbsoluteUrl('https://rikka.moe', relativeUrl), isCurrent: locale.lang === currentLocale.lang };
  });
}

export function stripHtml(value = '') {
  return String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function excerptFromBody(body = '', length = 180) {
  return stripHtml(body.replace(/^---[\s\S]*?---/, '')).slice(0, length);
}
