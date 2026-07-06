function siteCopy(key, fallback) {
  return (window.__AKARI_SITE_COPY__ && window.__AKARI_SITE_COPY__[key]) || fallback;
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

function setSearchOpen(open) {
  const modal = document.getElementById('akari-search-modal');
  if (!modal) return;
  modal.style.display = open ? 'flex' : 'none';
  modal.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (open) {
    const input = modal.querySelector('.akari-search-modal__input');
    input?.focus();
  }
}

function setSettingsOpen(open) {
  const popover = document.getElementById('akari-settings-popover');
  if (!popover) return;
  popover.style.display = open ? 'block' : 'none';
  popover.setAttribute('aria-hidden', open ? 'false' : 'true');
}

function setLangPopoverOpen(open) {
  const popover = document.getElementById('akari-lang-popover');
  const trigger = document.querySelector('.appbar-lang-trigger');
  if (!popover) return;
  popover.style.display = open ? 'block' : 'none';
  popover.setAttribute('aria-hidden', open ? 'false' : 'true');
  trigger?.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function normalizeSearchText(value) {
  return String(value || '').normalize('NFKC').toLowerCase();
}

function getSearchLangPath() {
  const config = window.__AKARI_LOCALE_ROUTING__;
  const localePaths = Array.isArray(config?.locales) ? config.locales.map((locale) => locale.key) : ['zh-cn', 'zh-tw', 'en', 'ja'];
  const pathLang = window.location.pathname.split('/').filter(Boolean)[0];
  if (localePaths.includes(pathLang)) return pathLang;
  const lang = (document.documentElement.lang || 'en').toLowerCase();
  if (localePaths.includes(lang)) return lang;
  if (lang.startsWith('ja')) return 'ja';
  return 'en';
}

let searchData = [];
let searchLoaded = false;

async function loadSearchData() {
  if (searchLoaded) return;
  try {
    const res = await fetch(`/${getSearchLangPath()}/search.json`);
    if (res.ok) {
      const data = await res.json();
      searchData = data.posts || [];
      searchLoaded = true;
    }
  } catch {}
}

function renderSearchResults(query) {
  const resultsEl = document.querySelector('.akari-search-modal__results');
  if (!resultsEl) return;
  if (!query.trim()) {
    resultsEl.innerHTML = '';
    return;
  }
  const q = normalizeSearchText(query);
  const matches = searchData.filter((post) => normalizeSearchText(post.searchText).includes(q)).slice(0, 10);

  if (!matches.length) {
    resultsEl.innerHTML = '<div class="akari-search-modal__empty">' + escapeHtml(siteCopy('searchEmpty', 'No matching posts found')) + '</div>';
    return;
  }

  resultsEl.innerHTML = matches.map((post) =>
    `<a class="akari-search-modal__result" href="${post.url}">
      <h4>${escapeHtml(post.title)}</h4>
      <time>${escapeHtml([post.date, post.langName].filter(Boolean).join(' · '))}</time>
      <p>${escapeHtml(post.content?.slice(0, 120) || '')}...</p>
    </a>`
  ).join('');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);
}

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

  if (target.closest('.appbar-search-trigger')) {
    setSearchOpen(true);
    loadSearchData();
    return;
  }

  if (target.closest('.akari-search-modal__close') || target.closest('.akari-search-modal__backdrop')) {
    setSearchOpen(false);
    return;
  }

  if (target.closest('.appbar-lang-trigger')) {
    const popover = document.getElementById('akari-lang-popover');
    if (popover) {
      const hidden = popover.getAttribute('aria-hidden') !== 'false';
      setLangPopoverOpen(hidden);
    }
    return;
  }

  if (target.closest('.appbar-settings-trigger')) {
    const popover = document.getElementById('akari-settings-popover');
    if (popover) {
      const hidden = popover.getAttribute('aria-hidden') !== 'false';
      setSettingsOpen(hidden);
    }
    return;
  }

  const clickedLangBtn = target.closest('.appbar-lang-trigger');
  const clickedSettingsBtn = target.closest('.appbar-settings-trigger');
  if (!target.closest('#akari-lang-popover') && !clickedLangBtn) setLangPopoverOpen(false);
  if (!target.closest('#akari-settings-popover') && !clickedSettingsBtn) setSettingsOpen(false);
});

document.addEventListener('input', (event) => {
  const target = event.target;
  if (target.classList.contains('akari-search-modal__input')) {
    renderSearchResults(target.value);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setDrawerOpen(false);
    setSearchOpen(false);
    setSettingsOpen(false);
    setLangPopoverOpen(false);
  }
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
  button.textContent = siteCopy('copy', 'Copy');
  button.className = 'code-copy';
  pre.parentNode?.insertBefore(wrapper, pre);
  wrapper.appendChild(button);
  wrapper.appendChild(pre);
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.textContent || '');
      button.textContent = siteCopy('copied', 'Copied');
      setTimeout(() => button.textContent = siteCopy('copy', 'Copy'), 1200);
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

// Color palette
document.querySelectorAll('.akari-settings-palette__item').forEach((btn) => {
  btn.addEventListener('click', () => {
    const color = btn.getAttribute('data-color');
    if (color) {
      document.documentElement.style.setProperty('--akari-accent', color);
      try { localStorage.setItem('akari-accent-color', color); } catch {}
    }
  });
});

// Font size
document.querySelectorAll('.akari-settings-font-size__btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const size = btn.getAttribute('data-size');
    document.querySelectorAll('.akari-settings-font-size__btn').forEach((b) => b.classList.remove('akari-settings-font-size__btn--active'));
    btn.classList.add('akari-settings-font-size__btn--active');
    let fontSize = '16px';
    if (size === 'small') fontSize = '14px';
    if (size === 'large') fontSize = '18px';
    document.documentElement.style.fontSize = fontSize;
    try { localStorage.setItem('akari-font-size', size); } catch {}
  });
});

// Theme switcher (auto / dark / parchment)
function applyAkariTheme(theme) {
  var root = document.documentElement;
  if (theme === 'auto') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
  var light = (theme === 'parchment') || (theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
  root.classList.remove('mdui-theme-light', 'mdui-theme-dark');
  root.classList.add(light ? 'mdui-theme-light' : 'mdui-theme-dark');
}

document.querySelectorAll('.akari-settings-theme__btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    var theme = btn.getAttribute('data-theme') || 'auto';
    document.querySelectorAll('.akari-settings-theme__btn').forEach((b) => b.classList.remove('akari-settings-theme__btn--active'));
    btn.classList.add('akari-settings-theme__btn--active');
    applyAkariTheme(theme);
    try { localStorage.setItem('akari-theme', theme); } catch {}
  });
});

// Restore theme preference on page-load
document.addEventListener('astro:page-load', function() {
  try {
    var saved = localStorage.getItem('akari-theme');
    var theme = (saved === 'parchment' || saved === 'dark' || saved === 'auto') ? saved : 'auto';
    document.querySelectorAll('.akari-settings-theme__btn').forEach((b) => {
      b.classList.toggle('akari-settings-theme__btn--active', b.getAttribute('data-theme') === theme);
    });
  } catch {}

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.akari-hero-media').forEach((v) => {
      v.pause();
      v.removeAttribute('autoplay');
    });
  }
});

if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video.akari-hero-media').forEach(function(v) {
    v.pause();
    v.removeAttribute('autoplay');
  });
}

// Restore preferences
try {
  const savedColor = localStorage.getItem('akari-accent-color');
  if (savedColor) document.documentElement.style.setProperty('--akari-accent', savedColor);
  const savedSize = localStorage.getItem('akari-font-size');
  if (savedSize) {
    let fontSize = '16px';
    if (savedSize === 'small') fontSize = '14px';
    if (savedSize === 'large') fontSize = '18px';
    document.documentElement.style.fontSize = fontSize;
    document.querySelectorAll('.akari-settings-font-size__btn').forEach((b) => {
      b.classList.toggle('akari-settings-font-size__btn--active', b.getAttribute('data-size') === savedSize);
    });
  }
} catch {}
