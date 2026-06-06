import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const commonSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  url_slug: z.string().optional(),
  permalink: z.string().optional(),
  date: z.union([z.date(), z.string()]).optional(),
  updated: z.union([z.date(), z.string()]).optional(),
  lang: z.string().optional(),
  lang_path: z.string().optional(),
  translation_key: z.string().optional(),
  description: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.union([z.string(), z.array(z.string())]).optional(),
  alias: z.union([z.string(), z.array(z.string())]).optional(),
  layout: z.string().optional(),
  cover: z.string().optional(),
  thumbnail: z.string().optional(),
  banner: z.string().optional(),
  image: z.string().optional(),
  indexing: z.boolean().optional(),
  comment: z.boolean().optional(),
  is_locale_selector: z.boolean().optional(),
  disable_search: z.boolean().optional(),
}).passthrough();

export const collections = {
  posts: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
    schema: commonSchema,
  }),
  pages: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
    schema: commonSchema,
  }),
};
