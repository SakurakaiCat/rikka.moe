import { getPostsByLocale, LOCALES, postCategories, postTags, postUrl, stripHtml } from '../../lib/content';

export async function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { lang: locale.lang_path }, props: { locale } }));
}

export async function GET({ props }: any) {
  const { locale } = props;
  const posts = await getPostsByLocale(locale);
  return new Response(JSON.stringify({
    lang: locale.lang,
    posts: posts.map((post) => ({
      title: post.data.title || '',
      url: postUrl(post),
      date: post.data.date ? new Date(post.data.date as any).toISOString().slice(0, 10) : '',
      content: stripHtml(post.body),
      tags: postTags(post),
      categories: postCategories(post),
    })),
    meta: { generated: new Date().toISOString(), total: posts.length },
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
