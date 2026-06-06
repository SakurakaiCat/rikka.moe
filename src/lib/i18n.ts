import { createRequire } from 'node:module';
import { resolveLocale, type Locale } from './content';

const require = createRequire(import.meta.url);
const { getHomepageModel: getModel } = require(`${process.cwd()}/src/data/homepage.cjs`);

export function getHomepageModel(locale: Locale) {
  return getModel({ lang: locale.lang, lang_path: locale.lang_path });
}

export const t = {
  common: {
    home: { 'zh-CN': '首页', 'zh-TW': '首頁', en: 'Home', ja: 'ホーム' },
    archive: { 'zh-CN': '文章归档', 'zh-TW': '文章歸檔', en: 'Archive', ja: 'アーカイブ' },
    categories: { 'zh-CN': '文章分类', 'zh-TW': '文章分類', en: 'Categories', ja: 'カテゴリー' },
    about: { 'zh-CN': '关于', 'zh-TW': '關於', en: 'About', ja: 'About' },
    guestbook: { 'zh-CN': '留言板', 'zh-TW': '留言板', en: 'Guestbook', ja: 'ゲストブック' },
    books: { 'zh-CN': '书籍', 'zh-TW': '書籍', en: 'Books', ja: 'Books' },
    projects: { 'zh-CN': '项目', 'zh-TW': '專案', en: 'Projects', ja: 'Projects' },
  },
  category: {
    articles: { 'zh-CN': '长文', 'zh-TW': '長文', en: 'Essays', ja: '記事' },
    thoughts: { 'zh-CN': '随想', 'zh-TW': '隨想', en: 'Thoughts', ja: '断章' },
    gallery: { 'zh-CN': '相册', 'zh-TW': '相冊', en: 'Gallery', ja: 'ギャラリー' },
  },
  post: {
    prev: { 'zh-CN': '上一篇', 'zh-TW': '上一篇', en: 'Previous', ja: '前の記事' },
    next: { 'zh-CN': '下一篇', 'zh-TW': '下一篇', en: 'Next', ja: '次の記事' },
    none: { 'zh-CN': '没有了', 'zh-TW': '沒有了', en: 'None', ja: 'なし' },
    comment: { 'zh-CN': '评论', 'zh-TW': '評論', en: 'Comments', ja: 'コメント' },
  },
};

export function label(group: keyof typeof t, key: string, locale: Locale) {
  const table = (t[group] as Record<string, Record<string, string>>)[key];
  return table?.[locale.lang] || table?.en || key;
}

export function localeFromParams(params: { lang?: string }) {
  return resolveLocale({ lang_path: params.lang });
}
