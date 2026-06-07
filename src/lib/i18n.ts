import { createRequire } from 'node:module';
import { categorySlug, resolveLocale, type Locale } from './content';

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
  ui: {
    menu: { 'zh-CN': '打开菜单', 'zh-TW': '打開選單', en: 'Open menu', ja: 'メニューを開く' },
    closeMenu: { 'zh-CN': '关闭菜单', 'zh-TW': '關閉選單', en: 'Close menu', ja: 'メニューを閉じる' },
    navigation: { 'zh-CN': '站点导航', 'zh-TW': '站點導覽', en: 'Navigation', ja: 'ナビゲーション' },
    search: { 'zh-CN': '搜索', 'zh-TW': '搜尋', en: 'Search', ja: '検索' },
    searchBlog: { 'zh-CN': '搜索博客', 'zh-TW': '搜尋部落格', en: 'Search blog', ja: 'ブログを検索' },
    searchPlaceholder: { 'zh-CN': '搜索文章…', 'zh-TW': '搜尋文章…', en: 'Search posts…', ja: '記事を検索…' },
    searchEmpty: { 'zh-CN': '没有找到相关文章', 'zh-TW': '沒有找到相關文章', en: 'No matching posts found', ja: '該当する記事はありません' },
    switchLanguage: { 'zh-CN': '切换语言', 'zh-TW': '切換語言', en: 'Switch language', ja: '言語を切り替える' },
    settings: { 'zh-CN': '设置', 'zh-TW': '設定', en: 'Settings', ja: '設定' },
    closeSearch: { 'zh-CN': '关闭搜索', 'zh-TW': '關閉搜尋', en: 'Close search', ja: '検索を閉じる' },
    colorScheme: { 'zh-CN': '配色方案', 'zh-TW': '配色方案', en: 'Color scheme', ja: '配色' },
    fontSize: { 'zh-CN': '字体大小', 'zh-TW': '字體大小', en: 'Font size', ja: '文字サイズ' },
    fontSmall: { 'zh-CN': '小', 'zh-TW': '小', en: 'Small', ja: '小' },
    fontMedium: { 'zh-CN': '中', 'zh-TW': '中', en: 'Medium', ja: '中' },
    fontLarge: { 'zh-CN': '大', 'zh-TW': '大', en: 'Large', ja: '大' },
    tableOfContents: { 'zh-CN': '目录', 'zh-TW': '目錄', en: 'Table of Contents', ja: '目次' },
    copy: { 'zh-CN': '复制', 'zh-TW': '複製', en: 'Copy', ja: 'コピー' },
    copied: { 'zh-CN': '已复制', 'zh-TW': '已複製', en: 'Copied', ja: 'コピー済み' },
    migration: { 'zh-CN': '本博客已换新颜，迁移到 Astro 框架！', 'zh-TW': '本部落格已換新顏，遷移到 Astro 框架！', en: 'This blog has a new look and now runs on Astro!', ja: 'このブログは新しい姿になり、Astro に移行しました！' },
    personal: { 'zh-CN': '个人', 'zh-TW': '個人', en: 'Personal', ja: 'Personal' },
  },
  footer: {
    siteVisitors: { 'zh-CN': '站点总访客数：', 'zh-TW': '站點總訪客數：', en: 'Total visitors: ', ja: '合計訪問者数：' },
    siteViews: { 'zh-CN': '站点总访问量：', 'zh-TW': '站點總瀏覽量：', en: 'Total page views: ', ja: '合計ページビュー：' },
    icp: { 'zh-CN': '萌ICP备20260097号', 'zh-TW': '萌 ICP 備 20260097 號', en: 'Moe ICP No. 20260097', ja: '萌 ICP 備 20260097 号' },
    poweredByPrefix: { 'zh-CN': '本站由', 'zh-TW': '本站由', en: 'Powered by', ja: 'このサイトは' },
    poweredBySuffix: { 'zh-CN': ' Cloudflare CDN 驱动', 'zh-TW': ' Cloudflare CDN 驅動', en: ' Cloudflare CDN', ja: ' Cloudflare CDN で配信されています' },
  },
  ai: {
    summaryTitle: { 'zh-CN': 'AI总结', 'zh-TW': 'AI 總結', en: 'AI summary', ja: 'AI 要約' },
    summaryFooterPrefix: { 'zh-CN': '由', 'zh-TW': '由', en: 'Summary powered by', ja: '要約生成：' },
    summaryFooterSuffix: { 'zh-CN': 'DeepSeek V4 Pro 驱动总结', 'zh-TW': 'DeepSeek V4 Pro 驅動總結', en: 'DeepSeek V4 Pro', ja: 'DeepSeek V4 Pro' },
  },
  guestbook: {
    loading: { 'zh-CN': '正在加载留言…', 'zh-TW': '正在載入留言…', en: 'Loading messages…', ja: 'メッセージを読み込み中…' },
    empty: { 'zh-CN': '还没有留言。', 'zh-TW': '還沒有留言。', en: 'No messages yet.', ja: 'まだメッセージはありません。' },
    loadMore: { 'zh-CN': '加载更多', 'zh-TW': '載入更多', en: 'Load more', ja: 'もっと読み込む' },
    nickname: { 'zh-CN': '昵称', 'zh-TW': '暱稱', en: 'Name', ja: '名前' },
    email: { 'zh-CN': '邮箱（可选，仅用于头像）', 'zh-TW': 'Email（可選，僅用於頭像）', en: 'Email (optional, for avatar only)', ja: 'メール（任意、アバター用）' },
    message: { 'zh-CN': '留言内容', 'zh-TW': '留言內容', en: 'Message', ja: 'メッセージ' },
    submit: { 'zh-CN': '提交留言', 'zh-TW': '送出留言', en: 'Submit message', ja: '送信' },
    submitting: { 'zh-CN': '正在提交…', 'zh-TW': '正在送出…', en: 'Submitting…', ja: '送信中…' },
    success: { 'zh-CN': '留言已发布。', 'zh-TW': '留言已發布。', en: 'Your message has been posted.', ja: 'メッセージを投稿しました。' },
    errorInvalid: { 'zh-CN': '请检查昵称、邮箱或留言长度。', 'zh-TW': '請檢查暱稱、Email 或留言長度。', en: 'Please check your name, email, or message length.', ja: '名前、メール、本文の長さを確認してください。' },
    errorDuplicate: { 'zh-CN': '这条留言已经提交过了。', 'zh-TW': '這則留言已經送出過了。', en: 'This message has already been submitted.', ja: 'このメッセージはすでに送信されています。' },
    errorBlocked: { 'zh-CN': '留言未通过安全检查。', 'zh-TW': '留言未通過安全檢查。', en: 'The message did not pass the safety check.', ja: 'メッセージは安全確認を通過できませんでした。' },
    errorRateLimited: { 'zh-CN': '提交太频繁，请稍后再试。', 'zh-TW': '送出太頻繁，請稍後再試。', en: 'Too many submissions. Please try again later.', ja: '投稿が多すぎます。後でもう一度お試しください。' },
    errorServer: { 'zh-CN': '服务暂时不可用，请稍后再试。', 'zh-TW': '服務暫時不可用，請稍後再試。', en: 'The service is temporarily unavailable. Please try again later.', ja: 'サービスを一時的に利用できません。後でもう一度お試しください。' },
  },
};

export function label(group: keyof typeof t, key: string, locale: Locale) {
  const table = (t[group] as Record<string, Record<string, string>>)[key];
  return table?.[locale.lang] || table?.en || key;
}

const categoryAliases: Record<string, string[]> = {
  articles: ['长文', '長文', 'Essays', 'Essay', 'Articles', '記事'],
  thoughts: ['随想', '隨想', 'Thoughts', 'Thought', 'つぶやき', '断章'],
  gallery: ['相册', '相冊', 'Gallery', 'ギャラリー'],
};

export function categoryKeyFromName(category?: string) {
  const normalized = String(category || '').trim().toLowerCase();
  if (!normalized) return null;

  for (const [key, aliases] of Object.entries(categoryAliases)) {
    if (aliases.some((alias) => alias.toLowerCase() === normalized)) {
      return key;
    }
  }

  return null;
}

export function categoryName(category: string, locale: Locale) {
  const key = categoryKeyFromName(category);
  return key ? label('category', key, locale) : category;
}

const categorySlugByLocale: Record<string, Record<string, string>> = {
  articles: { 'zh-CN': '长文', 'zh-TW': '長文', en: 'essays', ja: 'articles' },
  thoughts: { 'zh-CN': '随想', 'zh-TW': '隨想', en: 'thoughts', ja: 'thoughts' },
  gallery: { 'zh-CN': '相册', 'zh-TW': '相冊', en: 'gallery', ja: 'gallery' },
};

export function categorySlugForKey(key: string, locale: Locale) {
  return categorySlugByLocale[key]?.[locale.lang] || categorySlugByLocale[key]?.en || categorySlug(key);
}

export function categorySlugForLocale(category: string, locale: Locale) {
  const key = categoryKeyFromName(category);
  return key ? categorySlugForKey(key, locale) : categorySlug(category);
}

export function twikooLang(locale: Locale) {
  if (locale.lang === 'en') return 'en';
  if (locale.lang === 'ja') return 'ja';
  if (locale.lang === 'zh-TW') return 'zh-TW';
  return 'zh-CN';
}

export function localeFromParams(params: { lang?: string }) {
  return resolveLocale({ lang_path: params.lang });
}
