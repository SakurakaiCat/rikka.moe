import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const ARTICLE_PATH = '/en/2026/05/17/the-complete-giffgaff-uk-sim-card-guide/';
const ARTICLES_URL = '/en/2026/05/17/the-complete-giffgaff-uk-sim-card-guide/';
const BASELINE_PNG = '.omo/evidence/article-desktop-baseline.png';

test.describe('Article reading page - desktop baseline', () => {
  test('captures full-page desktop screenshot of the giffgaff guide article', async ({ page }) => {
    await mkdir(dirname(BASELINE_PNG), { recursive: true });

    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto(ARTICLE_PATH, { waitUntil: 'networkidle' });

    await page.screenshot({
      path: BASELINE_PNG,
      fullPage: true,
    });
  });
});

test.describe('Article reading page - mobile overflow assertions', () => {
  const MOBILE_VIEWPORTS = [320, 375, 414, 720, 1024];

  for (const width of MOBILE_VIEWPORTS) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 });
      await page.goto(ARTICLES_URL, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow).toBe(0);
      await page.screenshot({
        path: `.omo/evidence/task-7-overflow-${width}px.png`,
        fullPage: true,
      });
    });
  }

  test('synthetic code-block wrapper does not overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(ARTICLES_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const prose = document.querySelector('.article-prose');
      if (!prose) return;
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
    });
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow).toBe(0);
    const box = await page.locator('.code-copy').last().boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(40);
    expect(box!.height).toBeGreaterThanOrEqual(40);
  });
});
