import type { Locale, PostEntry } from './content';

// 话题规范名统一使用中文 key,各语言展示名与 URL slug 在此映射
const TOPIC_NAMES: Record<string, Record<string, string>> = {
  '生活': { 'zh-CN': '生活', 'zh-TW': '生活', en: 'Life', ja: '暮らし' },
  '校园': { 'zh-CN': '校园', 'zh-TW': '校園', en: 'Campus', ja: 'キャンパス' },
  '经济': { 'zh-CN': '经济', 'zh-TW': '經濟', en: 'Economy', ja: '経済' },
  '社会': { 'zh-CN': '社会', 'zh-TW': '社會', en: 'Society', ja: '社会' },
  '技术': { 'zh-CN': '技术', 'zh-TW': '技術', en: 'Tech', ja: '技術' },
  'AI': { 'zh-CN': 'AI', 'zh-TW': 'AI', en: 'AI', ja: 'AI' },
  '二次元': { 'zh-CN': '二次元', 'zh-TW': '二次元', en: 'Anime', ja: '二次元' },
  '随笔': { 'zh-CN': '随笔', 'zh-TW': '隨筆', en: 'Reflections', ja: 'エッセイ' },
};

export const TOPIC_KEYS = Object.keys(TOPIC_NAMES);

const TOPIC_ICONS: Record<string, string> = {
  '生活': 'ph-plant',
  '校园': 'ph-graduation-cap',
  '经济': 'ph-chart-line-up',
  '社会': 'ph-users-three',
  '技术': 'ph-cpu',
  'AI': 'ph-robot',
  '二次元': 'ph-game-controller',
  '随笔': 'ph-feather',
};

function topicRecord(key: string) {
  return TOPIC_NAMES[key] || null;
}

export function topicName(key: string, locale: Locale) {
  return topicRecord(key)?.[locale.lang] || topicRecord(key)?.en || key;
}

export function topicIcon(key: string) {
  return TOPIC_ICONS[key] || 'ph-tag';
}

export function topicSlugForKey(key: string, locale: Locale) {
  const name = topicName(key, locale);
  if (locale.lang === 'en') {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  return name;
}

export function topicKeyFromSlug(slug: string, locale: Locale) {
  for (const key of TOPIC_KEYS) {
    if (topicSlugForKey(key, locale) === slug) return key;
  }
  return null;
}

export function postTopics(post: PostEntry) {
  return Array.isArray(post.data.topics) ? post.data.topics : [];
}

export type TopicSummary = { key: string; count: number };

export function collectTopicSummaries(posts: PostEntry[]): TopicSummary[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const key of postTopics(post)) {
      if (!topicRecord(key)) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

export function postsByTopic(posts: PostEntry[], topicKey: string) {
  return posts.filter((post) => postTopics(post).includes(topicKey));
}
