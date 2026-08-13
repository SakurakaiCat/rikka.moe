# Post Stats Display System Design

**Date**: 2026-08-13
**Status**: Approved
**Scope**: Add view count and comment count display for Essays (长文) and Thoughts (随想) posts on cards and detail pages.

## [S1] Problem

The website currently tracks page views in a D1 database (`visit_logs` table) and uses Twikoo for comments, but these stats are not surfaced per-post. Users want to see how many people viewed and commented on each essay/thought post, both on listing cards and on the detail page below the title.

## [S2] Solution Overview

Add a client-side stats display system that:
1. Queries the existing D1 `visit_logs` table for per-path view counts via a new `/api/page-views` endpoint.
2. Calls `twikoo.getCommentsCount()` client-side for per-path comment counts.
3. Renders stats (eye icon + view count, chat icon + comment count) on post cards and detail pages.
4. Only displays for posts in the Essays (长文) and Thoughts (随想) categories — not Gallery.

## [S3] API Endpoint: `/api/page-views`

**File**: `functions/api/page-views.ts`

- **Method**: POST
- **Input**: `{ "paths": ["/en/2024/01/01/my-post/", ...] }` (JSON body)
- **D1 Query**:
  ```sql
  SELECT path, COUNT(*) as views
  FROM visit_logs
  WHERE counted_as_pageview = 1 AND path IN (?, ?, ...)
  GROUP BY path
  ```
- **Output**: `{ "views": { "/en/.../my-post/": 123, ... } }`
- **CORS**: Reuse `optionsResponse()` for OPTIONS handler.
- **Error handling**: Return `{ "views": {} }` for empty paths array. Return partial results if some paths have no records.
- **Reuse**: Import `jsonResponse`, `optionsResponse`, and D1 interface types from `functions/_lib/analytics.ts`.

## [S4] Client-Side Script: `post-stats.js`

**File**: `public/assets/js/post-stats.js`

**Behavior**:
1. On `DOMContentLoaded` and `astro:page-load`, find all `[data-post-url]` elements.
2. Collect unique URLs from `data-post-url` attributes.
3. If no URLs found, return early.
4. POST URLs to `/api/page-views` → get view counts map.
5. Load Twikoo SDK if `window.twikoo` is not available (reuse existing CDN loading pattern from `Comments.astro`).
6. Call `twikoo.getCommentsCount({ envId, urls, includeReply: false })` → get comment counts.
7. For each `[data-post-url]` element, update child `[data-stats-views]` and `[data-stats-comments]` text content with the corresponding counts.

**Twikoo constants**:
- CDN: `https://cdn.jsdelivr.net/npm/twikoo@1.7.13/dist/twikoo.all.min.js`
- Env ID: `https://comment.rikka.moe`
- Script marker: `data-akari-twikoo="true"` (same as existing pattern)

**View transition support**: Listen for `astro:page-load` event to re-run on Astro view transitions.

## [S5] UI Changes

### [S5.1] PostCard.astro (archives/category pages)

Add stats display after the description, only for Essays/Thoughts categories:

```astro
---
import { categoryKeyFromName } from '../lib/i18n';
// ... existing code ...
const categoryKeys = postCategories(post).map(categoryKeyFromName).filter(Boolean);
const showStats = categoryKeys.some(key => key === 'articles' || key === 'thoughts');
const url = postUrl(post);
---
<!-- After description -->
{showStats && (
  <div class="post-stats" data-post-url={url}>
    <span class="post-stats__item"><i class="ph ph-eye"></i><span data-stats-views>0</span></span>
    <span class="post-stats__item"><i class="ph ph-chat-circle"></i><span data-stats-comments>0</span></span>
  </div>
)}
```

### [S5.2] HomePage.astro (home page article/thought sections)

Add stats to article glass cards (after description) and thought timeline items (after description). Both sections already filter by category, so all posts in these sections get stats.

### [S5.3] Post Detail Page (`[lang]/[year]/[month]/[day]/[slug]/index.astro`)

Add stats below the description in the `article-hero-card` section, only for Essays/Thoughts:

```astro
---
import { categoryKeyFromName } from '../../../../../../lib/i18n';
// ... existing code ...
const categoryKeys = postCategories(post).map(categoryKeyFromName).filter(Boolean);
const showStats = categoryKeys.some(key => key === 'articles' || key === 'thoughts');
---
<!-- Inside article-hero-card, after description -->
{showStats && (
  <div class="post-stats" data-post-url={currentUrl}>
    <span class="post-stats__item"><i class="ph ph-eye"></i><span data-stats-views>0</span></span>
    <span class="post-stats__item"><i class="ph ph-chat-circle"></i><span data-stats-comments>0</span></span>
  </div>
)}
```

## [S6] i18n Labels

Add to `src/lib/i18n.ts` in the `post` group:

```typescript
views: { 'zh-CN': '浏览量', 'zh-TW': '瀏覽量', en: 'Views', ja: '閲覧数' },
comments: { 'zh-CN': '评论数', 'zh-TW': '評論數', en: 'Comments', ja: 'コメント数' },
```

Used for `aria-label` attributes on stats elements for accessibility.

## [S7] Styling

Add to `src/styles/global.css`:

```css
.post-stats {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 0.5rem;
}

.post-stats__item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.post-stats__item i {
  font-size: 1em;
  line-height: 1;
}
```

Adapt spacing for detail page context (`.article-hero-card .post-stats`) if needed.

## [S8] Script Loading

Add to `src/components/Footer.astro` (alongside existing `analytics.js`):

```html
<script is:inline src="/assets/js/post-stats.js" defer></script>
```

## [S9] Path Matching

- `postUrl(post)` returns normalized paths with trailing slashes (via `normalizeRoutePath`).
- `normalizeTrackedPath` in `analytics.ts` also normalizes to trailing slashes.
- The `visit_logs.path` column stores these normalized paths.
- Therefore, `postUrl()` output matches `visit_logs.path` values — no additional normalization needed.

## [S10] Files to Create/Modify

**Create**:
- `functions/api/page-views.ts` — new API endpoint
- `public/assets/js/post-stats.js` — client-side stats script

**Modify**:
- `src/components/PostCard.astro` — add stats display
- `src/components/HomePage.astro` — add stats to article/thought cards
- `src/pages/[lang]/[year]/[month]/[day]/[slug]/index.astro` — add stats to detail page
- `src/lib/i18n.ts` — add views/comments labels
- `src/styles/global.css` — add post-stats styles
- `src/components/Footer.astro` — add post-stats.js script tag
