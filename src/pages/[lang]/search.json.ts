import { getAllPosts, LOCALES, postCategories, postTags, postUrl, resolveLocale, stripHtml } from '../../lib/content';
import { categoryName } from '../../lib/i18n';

export async function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { lang: locale.lang_path }, props: { locale } }));
}

export async function GET({ props }: any) {
  const { locale } = props;
  const posts = (await getAllPosts()).filter((post) => resolveLocale(post.data).lang === locale.lang);
  return new Response(JSON.stringify({
    lang: locale.lang,
    posts: posts.map((post) => {
      const postLocale = resolveLocale(post.data);
      const content = stripHtml(post.body);
      const tags = postTags(post);
      const categories = postCategories(post).map((category) => categoryName(category, locale));
      const metadata = [
        post.data.title,
        post.data.description,
        post.data.slug,
        post.data.url_slug,
        post.data.translation_key,
        post.data.keywords,
        post.data.alias,
        tags,
        categories,
        postLocale.display_name,
        postLocale.lang,
        postLocale.lang_path,
      ].flat().filter(Boolean).join(' ');
      return {
        title: post.data.title || '',
        url: postUrl(post),
        date: post.data.date ? new Date(post.data.date as any).toISOString().slice(0, 10) : '',
        content,
        tags,
        categories,
        lang: postLocale.lang,
        langPath: postLocale.lang_path,
        langName: postLocale.display_name,
        searchText: `${metadata} ${content}`,
      };
    }),
    meta: { generated: new Date().toISOString(), total: posts.length },
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
