const themeKey = 'materialis-theme';

function setTheme(theme) {
  document.documentElement.classList.toggle('mdui-theme-light', theme === 'light');
  document.documentElement.classList.toggle('mdui-theme-dark', theme !== 'light');
  document.body.classList.toggle('mdui-theme-light', theme === 'light');
  document.body.classList.toggle('mdui-theme-dark', theme !== 'light');
  try { localStorage.setItem(themeKey, theme); } catch {}
}

function setDrawerOpen(open) {
  const drawer = document.getElementById('akari-sidebar');
  const backdrop = document.querySelector('.akari-drawer-backdrop');
  const trigger = document.querySelector('.appbar-menu-button');
  if (!drawer || !backdrop) return;
  drawer.classList.toggle('akari-sidebar--open', open);
  drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  backdrop.hidden = !open;
  document.body.classList.toggle('akari-drawer-open', open);
  trigger?.setAttribute('aria-expanded', open ? 'true' : 'false');
}

try { setTheme(localStorage.getItem(themeKey) || 'dark'); } catch {}

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  if (target.closest('.appbar-menu-button')) {
    const drawer = document.getElementById('akari-sidebar');
    setDrawerOpen(!(drawer && drawer.classList.contains('akari-sidebar--open')));
    return;
  }

  if (target.closest('[data-akari-drawer-close]') || target.closest('.akari-sidebar__nav a')) {
    setDrawerOpen(false);
    return;
  }

  const langTrigger = target.closest('.appbar-lang-trigger');
  const popover = document.getElementById('akari-lang-popover');
  if (langTrigger && popover) {
    const hidden = popover.getAttribute('aria-hidden') !== 'false';
    popover.style.display = 'block';
    popover.setAttribute('aria-hidden', hidden ? 'false' : 'true');
    return;
  }
  if (popover && !target.closest('#akari-lang-popover')) popover.setAttribute('aria-hidden', 'true');

  if (target.closest('.appbar-theme-trigger')) {
    const isLight = document.documentElement.classList.contains('mdui-theme-light');
    setTheme(isLight ? 'dark' : 'light');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setDrawerOpen(false);
});

document.querySelectorAll('[data-locale-preference]').forEach((node) => node.addEventListener('click', () => {
  try { localStorage.setItem('akari_locale_preference', node.getAttribute('data-locale-preference') || ''); } catch {}
}));

document.querySelectorAll('.article-prose pre').forEach((pre) => {
  if (pre.closest('.code-block')) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'code-block';
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Copy';
  button.className = 'code-copy';
  pre.parentNode?.insertBefore(wrapper, pre);
  wrapper.appendChild(button);
  wrapper.appendChild(pre);
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.textContent || '');
      button.textContent = 'Copied';
      setTimeout(() => button.textContent = 'Copy', 1200);
    } catch {}
  });
});

const toc = document.getElementById('desktop-toc-body');
if (toc) {
  const headings = [...document.querySelectorAll('.article-prose h2,.article-prose h3')];
  toc.innerHTML = headings.map((heading, index) => {
    if (!heading.id) heading.id = `h-${index}`;
    return `<a class="toc-link" href="#${heading.id}">${heading.textContent}</a>`;
  }).join('');
}
