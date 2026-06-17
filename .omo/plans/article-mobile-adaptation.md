# Fix Article Reading Page Mobile Adaptation

## TL;DR

> **Quick Summary**: Add mobile-only CSS overrides in `src/styles/global.css` to eliminate horizontal overflow on the Astro article reading page, while keeping the desktop layout unchanged. Verify with a new Playwright spec that asserts zero horizontal scroll at 320/375/414/720/1024 px and a desktop pixel-parity screenshot diff.
>
> **Deliverables**:
> - Updated `src/styles/global.css` with scoped mobile overrides for the article page.
> - New `tests/article-mobile.spec.ts` Playwright spec for overflow + visual regression.
> - Desktop baseline + post-change screenshots proving no desktop shift.
> - Green `npm run check` and `npm run build`.
>
> **Estimated Effort**: Short
> **Parallel Execution**: YES — 3 implementation waves + final review wave
> **Critical Path**: Task 1 → Tasks 2–6 → Tasks 7–8 → F1–F4 → user okay

---

## Context

### Original Request
User reported that the article reading page does not adapt well to mobile screens and asked to fix it.

### Interview Summary
- **Most urgent symptom**: horizontal scroll / overflow.
- **Minimum viewport**: 320 px.
- **Desktop constraint**: keep desktop layout pixel-for-pixel unchanged; mobile-only overrides only.
- **TOC on mobile**: keep existing inline stacking at ≤ 1024 px.
- **Code blocks**: keep horizontal scroll; add width containment for the dynamically inserted `.code-block` wrapper and `.code-copy` button.
- **Design reference**: none; match existing style.
- **Dark mode**: not separately targeted.

### Research Findings
- **Framework**: Astro 6.x static site (`package.json` scripts use `astro`).
- **Styling**: custom CSS in `src/styles/global.css`; MDUI loaded globally; no Tailwind.
- **Article route**: `src/pages/[lang]/[year]/[month]/[day]/[slug]/index.astro`.
- **Layout**: `src/layouts/BaseLayout.astro` already has correct viewport meta tag.
- **Dynamic JS**: `public/scripts/site.js` wraps `.article-prose pre` into `.code-block` with `.code-copy` button; no styles exist for those classes.
- **Build gates**: `npm run check` and `npm run build`.
- **QA tooling**: Playwright is installed (`@playwright/test`) and `playwright.config.ts` points to `./tests`, but no `tests/` directory exists.

### Root Causes Identified
1. `.article-appbar-rail` has no mobile wrapping/width rule, unlike the homepage rail.
2. `.article-hero-card` has fixed `padding: 38px` with no mobile override.
3. `.article-prose` lacks responsive handling for tables, iframes, and long inline code/URLs.
4. `.code-block` / `.code-copy` are unstyled and may push past the viewport.
5. `.post-comments` has fixed padding and no constraints for Twikoo-injected markup.

### Metis Review
**Identified gaps** (addressed):
- Test strategy was undecided → resolved to tests-after with Playwright.
- Open questions about viewport range, design reference, dark mode → resolved with defaults.
- Scope still referenced Tailwind and was marked tentative → finalized and corrected.
- Missing guardrails around mobile-only overrides and desktop immutability → added.

---

## Work Objectives

### Core Objective
Eliminate horizontal overflow on the article reading page at viewports from 320 px up to the desktop breakpoint, without changing the desktop layout.

### Concrete Deliverables
- Updated `src/styles/global.css` with article-page mobile overrides.
- New `tests/article-mobile.spec.ts` Playwright spec.
- Desktop baseline and post-change screenshots stored in `.omo/evidence/`.

### Definition of Done
- [ ] `npx playwright test` passes with zero failures.
- [ ] `npm run check` exits 0.
- [ ] `npm run build` exits 0.
- [ ] Desktop screenshot diff shows no change in the article area.

### Must Have
- Mobile-only overrides scoped to article page classes.
- No horizontal scroll at 320, 375, 414, and 720 px on a content-rich article.
- Code blocks remain horizontally scrollable and fully within the viewport.
- Tables and iframes in `.article-prose` do not overflow the page.
- Desktop article page visually unchanged.

### Must NOT Have (Guardrails)
- No changes to `AppBar.astro`, `Sidebar.astro`, `Footer.astro`, or `site.js` except CSS hooks if unavoidable.
- No modifications to desktop rules for the article page.
- No new frameworks, utility classes, or global grid refactors.
- No mobile TOC drawer, font-size feature, or comments redesign.
- No changes to other routes (home, books, gallery, archive, about, guestbook).

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: YES — Playwright installed, config at `playwright.config.ts`.
- **Automated tests**: YES (tests-after).
- **Framework**: Playwright.
- **Agent-Executed QA**: ALWAYS — every task includes concrete QA scenarios.

### QA Policy
- **Frontend/Browser**: Use Playwright to resize viewport, open article pages, and assert `scrollWidth === innerWidth`.
- **Build**: Run `npm run check` and `npm run build` after implementation changes.
- **Visual regression**: Capture desktop screenshots before and after; diff must show zero article-area change.
- Evidence saved to `.omo/evidence/`.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — unblock QA):
└── Task 1: Create Playwright baseline test + capture desktop reference screenshot

Wave 2 (CSS fixes — all independent, can run in parallel):
├── Task 2: Mobile override for article appbar rail / capsules
├── Task 3: Mobile override for article hero card padding + heading
├── Task 4: Mobile override for prose content overflow (tables, iframes, inline code)
├── Task 5: Style code-block wrapper and copy button for mobile containment
└── Task 6: Mobile override for post-comments padding + Twikoo containment

Wave 3 (Verification):
├── Task 7: Playwright mobile overflow assertions across viewports
└── Task 8: Build/typecheck + desktop visual diff + scope audit

Wave FINAL (After all tasks):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA across mobile viewports (unspecified-high + playwright skill)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → Tasks 2–6 → Tasks 7–8 → F1–F4 → user okay
```

### Dependency Matrix
- **Task 1**: None → blocks Task 7, Task 8 (baseline screenshot).
- **Tasks 2–6**: None (target different selectors in same file; can run in parallel) → block Task 7, Task 8.
- **Task 7**: Depends on Tasks 1, 2–6.
- **Task 8**: Depends on Tasks 1, 2–6.
- **F1–F4**: Depend on Tasks 1–8.

---

## TODOs

- [x] 1. Create Playwright baseline test and capture desktop reference

  **What to do**:
  - Create `tests/article-mobile.spec.ts` (the `tests/` directory does not exist yet).
  - Update `playwright.config.ts` to add `baseURL: 'http://localhost:4321'` and a `webServer` entry that runs `npm run preview` (reuse existing server locally, start fresh in CI):
    ```ts
    export default defineConfig({
      testDir: './tests',
      fullyParallel: true,
      forbidOnly: !!process.env.CI,
      retries: process.env.CI ? 2 : 0,
      workers: process.env.CI ? 1 : undefined,
      reporter: 'list',
      use: {
        baseURL: 'http://localhost:4321',
        trace: 'on-first-retry',
      },
      webServer: {
        command: 'npm run preview',
        url: 'http://localhost:4321/',
        reuseExistingServer: !process.env.CI,
      },
    });
    ```
  - Configure the spec to open a real built article route. Use `/en/2026/05/17/the-complete-giffgaff-uk-sim-card-guide/` (`src/content/posts/articles/en--giffgaff-uk-sim-guide.md`) — this article contains Markdown tables and long English prose, making it ideal for overflow QA.
  - Add a test that captures a full-page desktop screenshot (viewport 1440×900) of the article page and saves it to `.omo/evidence/article-desktop-baseline.png`.

  **Must NOT do**:
  - Do not change other Playwright settings (parallelism, retries, workers).
  - Do not add assertions yet that depend on CSS fixes.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright-pro`]
    - `playwright-pro`: needed for viewport sizing, screenshot capture, and test file hygiene.

  **Parallelization**:
  - **Can Run In Parallel**: NO (foundation).
  - **Blocks**: Tasks 7, 8, F3.
  - **Blocked By**: None.

  **References**:
  - `playwright.config.ts:4` — `testDir: './tests'`.
  - `src/content/posts/articles/en--giffgaff-uk-sim-guide.md` — representative article with image and AI summary block.
  - External: `https://playwright.dev/docs/screenshots` — full-page screenshot API.

  **Acceptance Criteria**:
  - [ ] `tests/article-mobile.spec.ts` exists and runs.
  - [ ] `npx playwright test` produces `.omo/evidence/article-desktop-baseline.png`.

  **QA Scenarios**:
  ```
  Scenario: Baseline desktop screenshot captured
    Tool: Bash
    Preconditions: npm dependencies installed (`npm ci` or existing node_modules).
    Steps:
      1. npm run build
      2. npx playwright test tests/article-mobile.spec.ts
    Expected Result:
      - Exit code 0.
      - File `.omo/evidence/article-desktop-baseline.png` exists and is > 0 bytes.
    Failure Indicators:
      - Test fails because tests/ directory is missing or Playwright cannot find config.
      - Screenshot file missing.
    Evidence: .omo/evidence/article-desktop-baseline.png
  ```

  **Evidence to Capture**:
  - `.omo/evidence/article-desktop-baseline.png`

  **Commit**: YES
  - Message: `test(article): add mobile baseline and visual regression spec`
  - Files: `tests/article-mobile.spec.ts`, `playwright.config.ts`

- [x] 2. Mobile override for article appbar rail / capsules

  **What to do**:
  - In `src/styles/global.css`, inside the existing `@media (max-width: 720px)` block (after line 1670), add overrides for `.article-appbar-rail` and `.article-capsule`.
  - Force the rail to wrap and constrain trailing capsule width:
    ```css
    @media (max-width: 720px) {
      .article-appbar-rail {
        flex-wrap: wrap;
        gap: 8px;
      }
      .article-capsule--trailing {
        flex: 1 1 100%;
        min-width: 0;
      }
      .article-capsule--trailing a,
      .article-capsule--trailing span {
        min-width: 0;
        overflow-wrap: break-word;
      }
    }
    ```
  - Preserve existing `.article-capsule--trailing { flex-wrap: wrap; }` (line ~967).

  **Must NOT do**:
  - Do not change desktop `.article-appbar-rail` rules outside the media query.
  - Do not alter the homepage `.akari-appbar-rail`.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-engineering`]
    - `frontend-ui-engineering`: covers responsive CSS and mobile-first overrides.

  **Parallelization**:
  - **Can Run In Parallel**: YES — with Tasks 3–6.
  - **Blocks**: Tasks 7, 8.
  - **Blocked By**: None.

  **References**:
  - `src/styles/global.css:947-969` — `.article-appbar-rail`, `.article-capsule`, `.article-capsule--trailing`.
  - `src/pages/[lang]/[year]/[month]/[day]/[slug]/index.astro:36-43` — markup that populates the rail.

  **Acceptance Criteria**:
  - [ ] CSS compiles and `npm run build` exits 0.
  - [ ] `.article-appbar-rail` no longer forces horizontal overflow at 375 px on an article with multiple categories.

  **QA Scenarios**:
  ```
  Scenario: Article rail wraps on narrow viewport
    Tool: Playwright
    Preconditions: Site built (`npm run build`).
    Steps:
      1. page.setViewportSize({ width: 375, height: 812 })
      2. page.goto('/en/2026/05/17/the-complete-giffgaff-uk-sim-card-guide/')
      3. page.waitForLoadState('networkidle')
      4. const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      5. expect(overflow).toBe(0)
    Expected Result: overflow is 0 (no horizontal scroll) even when rail has several category links.
    Failure Indicators: overflow > 0.
    Evidence: .omo/evidence/task-2-rail-375px.png

  Scenario: Leading back capsule stays visible
    Tool: Playwright
    Preconditions: Same as above.
    Steps:
      1. page.setViewportSize({ width: 320, height: 812 })
      2. page.goto('/en/2026/05/17/the-complete-giffgaff-uk-sim-card-guide/')
      3. const backLink = page.locator('.article-capsule--lead')
      4. await expect(backLink).toBeVisible()
    Expected Result: back-to-archive capsule is fully visible.
    Failure Indicators: capsule clipped or off-screen.
    Evidence: .omo/evidence/task-2-rail-320px.png
  ```

  **Evidence to Capture**:
  - `.omo/evidence/task-2-rail-375px.png`
  - `.omo/evidence/task-2-rail-320px.png`

  **Commit**: NO (group with Tasks 2–6)

- [x] 3. Mobile override for article hero card padding and heading

  **What to do**:
  - In `src/styles/global.css`, inside `@media (max-width: 720px)`, add:
    ```css
    @media (max-width: 720px) {
      .article-hero-card {
        padding: clamp(20px, 5vw, 32px);
      }
      .article-hero-card h1 {
        font-size: clamp(1.6rem, 7vw, 2.25rem);
      }
      .article-hero-card p {
        font-size: clamp(0.95rem, 4vw, 1.1rem);
      }
    }
    ```
  - These values are intentionally smaller than the desktop `clamp(2rem, 5vw, 3.5rem)`; the desktop rule at line 975 must remain untouched.

  **Must NOT do**:
  - Do not change the existing `.article-hero-card h1` desktop rule.
  - Do not alter `.article-hero-cover` desktop behavior.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-engineering`]

  **Parallelization**:
  - **Can Run In Parallel**: YES — with Tasks 2, 4–6.
  - **Blocks**: Tasks 7, 8.
  - **Blocked By**: None.

  **References**:
  - `src/styles/global.css:971-984` — `.article-hero-card`, `.article-hero-card h1`.
  - `src/pages/[lang]/[year]/[month]/[day]/[slug]/index.astro:44-49` — hero card markup.

  **Acceptance Criteria**:
  - [ ] Hero card text fits within viewport at 320 px without overflow.
  - [ ] Desktop screenshot diff unchanged.

  **QA Scenarios**:
  ```
  Scenario: Hero card fits at 320 px
    Tool: Playwright
    Preconditions: Site built.
    Steps:
      1. page.setViewportSize({ width: 320, height: 812 })
      2. page.goto('/en/2026/05/17/the-complete-giffgaff-uk-sim-card-guide/')
      3. page.waitForLoadState('networkidle')
      4. const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      5. expect(overflow).toBe(0)
    Expected Result: no horizontal overflow attributable to hero card.
    Failure Indicators: overflow > 0.
    Evidence: .omo/evidence/task-3-hero-320px.png
  ```

  **Evidence to Capture**:
  - `.omo/evidence/task-3-hero-320px.png`

  **Commit**: NO (group with Tasks 2–6)

- [x] 4. Mobile override for prose content overflow (tables, iframes, inline code, URLs)

  **What to do**:
  - In `src/styles/global.css`, inside `@media (max-width: 720px)`, add responsive containment for `.article-prose` content:
    ```css
    @media (max-width: 720px) {
      .article-prose img,
      .article-prose video,
      .article-prose iframe,
      .article-prose embed,
      .article-prose object {
        max-width: 100%;
        height: auto;
      }
      .article-prose iframe {
        display: block;
      }
      .article-prose table {
        display: block;
        max-width: 100%;
        overflow-x: auto;
        border-collapse: collapse;
      }
      .article-prose code {
        word-break: break-word;
        overflow-wrap: break-word;
      }
    }
    ```
  - Ensure the existing `.article-prose { overflow-wrap: break-word; }` at line 1022 remains.

  **Must NOT do**:
  - Do not change desktop `.article-prose` rules.
  - Do not alter how `<pre>` scrolls (only add containment via Task 5).

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-engineering`]

  **Parallelization**:
  - **Can Run In Parallel**: YES — with Tasks 2, 3, 5, 6.
  - **Blocks**: Tasks 7, 8.
  - **Blocked By**: None.

  **References**:
  - `src/styles/global.css:1017-1042` — `.article-prose`, `.article-prose pre`, `.article-prose code`.
  - `src/styles/global.css:132-135` — global `img { max-width: 100%; height: auto; }`.

  **Acceptance Criteria**:
  - [ ] Tables, images, and inline code within `.article-prose` do not cause horizontal page scroll at 375 px.
  - [ ] `<pre>` blocks remain internally scrollable.

  **QA Scenarios**:
  ```
  Scenario: Markdown tables do not overflow at 375 px
    Tool: Playwright
    Preconditions: Site built; target article contains Markdown tables.
    Steps:
      1. page.setViewportSize({ width: 375, height: 812 })
      2. page.goto('/en/2026/05/17/the-complete-giffgaff-uk-sim-card-guide/')
      3. page.waitForLoadState('networkidle')
      4. const table = page.locator('.article-prose table').first()
      5. await expect(table).toBeVisible()
      6. const tableBox = await table.boundingBox()
      7. const viewportWidth = await page.evaluate(() => window.innerWidth)
      8. expect(tableBox.x + tableBox.width).toBeLessThanOrEqual(viewportWidth + 0.5)
      9. const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      10. expect(overflow).toBe(0)
    Expected Result: first table is fully inside viewport and page has no horizontal overflow.
    Failure Indicators: tableBox.x + tableBox.width > viewportWidth or overflow > 0.
    Evidence: .omo/evidence/task-4-table-375px.png
  ```

  **Evidence to Capture**:
  - `.omo/evidence/task-4-table-375px.png`

  **Commit**: NO (group with Tasks 2–6)

- [x] 5. Style `.code-block` wrapper and `.code-copy` button for mobile containment

  **What to do**:
  - In `src/styles/global.css`, add CSS rules for the JS-generated `.code-block` wrapper and `.code-copy` button (both classes are unstyled currently):
    ```css
    .code-block {
      position: relative;
      max-width: 100%;
    }
    .code-copy {
      position: absolute;
      top: 8px;
      right: 8px;
      min-width: 44px;
      min-height: 44px;
      padding: 6px 10px;
      border: 1px solid var(--akari-glass-border);
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--akari-text);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 2;
    }
    @media (max-width: 720px) {
      .code-copy {
        top: 6px;
        right: 6px;
        min-width: 40px;
        min-height: 40px;
        font-size: 0.7rem;
      }
    }
    ```
  - Do not change `public/scripts/site.js`.

  **Must NOT do**:
  - Do not alter the JS that creates the wrapper/button.
  - Do not make the copy button overlap the first line of code text on narrow screens without adding enough padding to `pre`.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-engineering`]

  **Parallelization**:
  - **Can Run In Parallel**: YES — with Tasks 2–4, 6.
  - **Blocks**: Tasks 7, 8.
  - **Blocked By**: None.

  **References**:
  - `public/scripts/site.js:172-190` — JS that wraps `.article-prose pre` into `.code-block` and appends `.code-copy` button.
  - `src/styles/global.css:1031-1036` — existing `.article-prose pre` styling.

  **Acceptance Criteria**:
  - [ ] `.code-block` wrapper does not exceed `.article-prose` width at 375 px.
  - [ ] `.code-copy` button is at least 40×40 px on mobile.
  - [ ] `<pre>` content remains horizontally scrollable inside the wrapper.

  **QA Scenarios**:
  ```
  Scenario: Synthetic code block wrapper does not overflow at 375 px
    Tool: Playwright
    Preconditions: No production article currently contains fenced code blocks (verified). Site built.
    Steps:
      1. page.setViewportSize({ width: 375, height: 812 })
      2. page.goto('/en/2026/05/17/the-complete-giffgaff-uk-sim-card-guide/')
      3. page.waitForLoadState('networkidle')
      4. Inject a synthetic .code-block wrapper into .article-prose via page.evaluate:
         const prose = document.querySelector('.article-prose');
         const wrapper = document.createElement('div');
         wrapper.className = 'code-block';
         const pre = document.createElement('pre');
         pre.textContent = 'const veryLongIdentifierNameThatExceedsViewportWidth = "this is a deliberately long line to force horizontal scroll if containment fails";\n'.repeat(5);
         const btn = document.createElement('button');
         btn.type = 'button';
         btn.className = 'code-copy';
         btn.textContent = 'Copy';
         wrapper.appendChild(btn);
         wrapper.appendChild(pre);
         prose.appendChild(wrapper);
      5. Scroll the synthetic wrapper into view.
      6. const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      7. expect(overflow).toBe(0)
      8. const box = await page.locator('.code-copy').last().boundingBox()
      9. expect(box.width).toBeGreaterThanOrEqual(40)
      10. expect(box.height).toBeGreaterThanOrEqual(40)
    Expected Result: injected wrapper does not cause page-level overflow and copy button is at least 40×40 px.
    Failure Indicators: overflow > 0 or button touch target < 40 px.
    Evidence: .omo/evidence/task-5-codeblock-375px.png, .omo/evidence/task-5-copybutton-box.json
  ```

  **Evidence to Capture**:
  - `.omo/evidence/task-5-codeblock-375px.png`
  - `.omo/evidence/task-5-copybutton-box.json`

  **Commit**: NO (group with Tasks 2–6)

- [x] 6. Mobile override for post-comments padding and Twikoo containment

  **What to do**:
  - In `src/styles/global.css`, inside `@media (max-width: 720px)`, add:
    ```css
    @media (max-width: 720px) {
      .post-comments {
        padding: 18px;
      }
      .post-comments .twikoo,
      .post-comments .tk-comments,
      .post-comments .tk-comments-container,
      .post-comments .tk-main {
        max-width: 100%;
        min-width: 0;
      }
      .post-comments img,
      .post-comments iframe,
      .post-comments video {
        max-width: 100%;
        height: auto;
      }
    }
    ```
  - This constrains Twikoo-injected markup without restyling Twikoo internals.

  **Must NOT do**:
  - Do not redesign Twikoo (avatars, buttons, emoji picker).
  - Do not change `.post-comments` desktop padding outside the media query.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-engineering`]

  **Parallelization**:
  - **Can Run In Parallel**: YES — with Tasks 2–5.
  - **Blocks**: Tasks 7, 8.
  - **Blocked By**: None.

  **References**:
  - `src/styles/global.css:1100-1106` — `.post-comments` base padding.
  - `src/components/Comments.astro` — verify how Twikoo is embedded.

  **Acceptance Criteria**:
  - [ ] `.post-comments` has reduced padding on mobile.
  - [ ] Comments section does not produce page-level horizontal scroll at 375 px.

  **QA Scenarios**:
  ```
  Scenario: Comments section does not overflow at 375 px
    Tool: Playwright
    Preconditions: Site built; comments enabled for the article (default unless `comment: false`).
    Steps:
      1. page.setViewportSize({ width: 375, height: 812 })
      2. page.goto('/en/2026/05/17/the-complete-giffgaff-uk-sim-card-guide/')
      3. page.waitForLoadState('networkidle')
      4. const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      5. expect(overflow).toBe(0)
    Expected Result: no page-level horizontal scroll.
    Evidence: .omo/evidence/task-6-comments-375px.png
  ```

  **Evidence to Capture**:
  - `.omo/evidence/task-6-comments-375px.png`

  **Commit**: NO (group with Tasks 2–6)

- [x] 7. Playwright mobile overflow assertions across viewports

  **What to do**:
  - Extend `tests/article-mobile.spec.ts` with a parameterized test that opens the article page at widths `[320, 375, 414, 720, 1024]` and asserts:
    ```ts
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow).toBe(0);
    ```
  - Capture a screenshot at each viewport under `.omo/evidence/task-7-overflow-{width}px.png`.

  **Must NOT do**:
  - Do not assert against live third-party content (e.g. Twikoo availability) as a hard failure.
  - Do not add viewports wider than 1024 px to the overflow assertion set (desktop parity is handled by Task 8).

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright-pro`, `frontend-ui-engineering`]
    - `playwright-pro`: writing stable viewport-parameterized tests.
    - `frontend-ui-engineering`: validating that overflow assertions are meaningful.

  **Parallelization**:
  - **Can Run In Parallel**: YES — with Task 8 (both depend on Tasks 1–6).
  - **Blocks**: F1–F4.
  - **Blocked By**: Tasks 1, 2–6.

  **References**:
  - `tests/article-mobile.spec.ts` (created in Task 1).
  - `playwright.config.ts` — testDir and workers config.
  - External: `https://playwright.dev/docs/browsers` — for viewport sizing.

  **Acceptance Criteria**:
  - [ ] `npx playwright test` passes with all overflow assertions.

  **QA Scenarios**:
  ```
  Scenario: No horizontal overflow across mobile viewports
    Tool: Bash (npx playwright test)
    Preconditions: Tasks 1–6 complete and site builds.
    Steps:
      1. npm run build
      2. npx playwright test tests/article-mobile.spec.ts
    Expected Result:
      - Exit code 0.
      - All parameterized overflow assertions pass.
    Failure Indicators:
      - Any assertion `scrollWidth - innerWidth > 0`.
    Evidence: .omo/evidence/task-7-overflow-320px.png, task-7-overflow-375px.png, task-7-overflow-414px.png, task-7-overflow-720px.png, task-7-overflow-1024px.png
  ```

  **Evidence to Capture**:
  - `.omo/evidence/task-7-overflow-{width}px.png` for width in `[320, 375, 414, 720, 1024]`.

  **Commit**: YES
  - Message: `test(article): add mobile overflow assertions`
  - Files: `tests/article-mobile.spec.ts`

- [x] 8. Build, typecheck, and desktop visual parity

  **What to do**:
  - Run `npm run check` and `npm run build`. Both must exit 0.
  - Run the Playwright baseline test from Task 1 again to capture a new desktop screenshot at 1440×900.
  - Compare the new screenshot to `article-desktop-baseline.png` using an image diff (pixelmatch or Playwright's built-in `toMatchSnapshot` if configured). The article area must show zero change; permissible differences are the read-progress bar width (it depends on scroll state).
  - Save the new screenshot and diff to `.omo/evidence/`.

  **Must NOT do**:
  - Do not alter CSS to fix a failing build if the failure is unrelated to this change.
  - Do not accept a desktop layout shift unless the plan's "keep desktop unchanged" decision is explicitly overridden by the user.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`code-review-and-quality`, `playwright-pro`]
    - `code-review-and-quality`: running check/build and interpreting failure causes.
    - `playwright-pro`: screenshot capture and diff.

  **Parallelization**:
  - **Can Run In Parallel**: YES — with Task 7.
  - **Blocks**: F1–F4.
  - **Blocked By**: Tasks 1, 2–6.

  **References**:
  - `package.json:10-13` — scripts `check`, `build`.
  - `.github/workflows/ci.yml:44-48` — CI build gate.

  **Acceptance Criteria**:
  - [ ] `npm run check` exits 0.
  - [ ] `npm run build` exits 0.
  - [ ] Desktop screenshot diff shows zero article-area change.

  **QA Scenarios**:
  ```
  Scenario: Build and typecheck pass
    Tool: Bash
    Preconditions: All CSS and test edits applied.
    Steps:
      1. npm run check
      2. npm run build
    Expected Result: both exit 0.
    Evidence: .omo/evidence/task-8-build.log

  Scenario: Desktop parity preserved
    Tool: Bash / Playwright
    Preconditions: Baseline screenshot exists from Task 1.
    Steps:
      1. npx playwright test tests/article-mobile.spec.ts
      2. pixelmatch .omo/evidence/article-desktop-baseline.png .omo/evidence/article-desktop-after.png
    Expected Result:
      - New screenshot exists.
      - Pixel diff in article area is 0 (or within tooling noise).
    Failure Indicators:
      - Diff shows changes to hero card, prose padding, navigation, etc. on desktop.
    Evidence: .omo/evidence/task-8-desktop-diff.png
  ```

  **Evidence to Capture**:
  - `.omo/evidence/task-8-build.log`
  - `.omo/evidence/article-desktop-after.png`
  - `.omo/evidence/task-8-desktop-diff.png`

  **Commit**: NO (evidence only)

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in `.omo/evidence/`. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `npm run check` and `npm run build`. Review `src/styles/global.css` and `tests/article-mobile.spec.ts` for: `!important` abuse, magic numbers without comment, overly broad selectors, dead CSS. Flag any change that leaks outside article-page scope.
  Output: `Build [PASS/FAIL] | Lint/Typecheck [PASS/FAIL] | QA [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute every QA scenario from Tasks 1–8. Capture mobile screenshots at 320/375/414/720 px and a desktop screenshot at 1440 px. Verify no horizontal scroll and that the code-copy button is reachable. Save to `.omo/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Mobile viewports [N/N] | Desktop parity [PASS/FAIL] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything planned was built, nothing beyond scope was built. Check "Must NOT do" compliance. Detect cross-task contamination and unaccounted file changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Task 1**: `test(article): add mobile baseline and visual regression spec` — `tests/article-mobile.spec.ts`, `playwright.config.ts` if needed.
- **Tasks 2–6** can be grouped or committed individually per CSS concern. Suggested group commit: `fix(styles): mobile overrides for article reading page` — `src/styles/global.css`.
- **Task 7**: `test(article): add mobile overflow assertions` — `tests/article-mobile.spec.ts`.
- **Task 8**: NO commit (evidence-only verification step).

---

## Success Criteria

### Verification Commands
```bash
npm run check
npm run build
npx playwright test
```

### Final Checklist
- [ ] All "Must Have" present.
- [ ] All "Must NOT Have" absent.
- [ ] `scrollWidth - innerWidth === 0` at 320, 375, 414, 720 px on article page.
- [ ] Desktop article page screenshot unchanged.
- [ ] `npm run check` and `npm run build` pass.
