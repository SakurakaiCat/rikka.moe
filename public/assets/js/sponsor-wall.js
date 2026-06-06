(function () {
  'use strict';

  var DEFAULT_API = '/api/sponsors';
  var FALLBACK_API = 'https://rikka.moe/api/sponsors';
  var DEFAULT_VISIBLE = 60;
  var DEFAULT_AVATAR =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">' +
      '<rect width="96" height="96" fill="%23eaeaea"/>' +
      '<circle cx="48" cy="38" r="18" fill="%23bdbdbd"/>' +
      '<path d="M16 88c4-18 18-26 32-26s28 8 32 26z" fill="%23bdbdbd"/>' +
      '</svg>'
    );

  function escapeAttr(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');
  }

  function escapeText(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function setStatus(root, message) {
    var el = root.querySelector('[data-sponsor-status]');
    if (!el) return;
    if (!message) {
      el.hidden = true;
      el.textContent = '';
      return;
    }
    el.hidden = false;
    el.textContent = message;
  }

  function buildItem(sponsor, fallbackName) {
    var rawName = sponsor && sponsor.name ? sponsor.name : '';
    var displayName = rawName || fallbackName;
    var avatar = sponsor && sponsor.avatar ? sponsor.avatar : DEFAULT_AVATAR;
    return (
      '<li class="akari-sponsor-wall__item">' +
        '<span class="akari-sponsor-wall__cell" title="' + escapeAttr(displayName) + '">' +
          '<img class="akari-sponsor-wall__avatar" loading="lazy" decoding="async" ' +
          'src="' + escapeAttr(avatar) + '" alt="" referrerpolicy="no-referrer" ' +
          'onerror="this.onerror=null;this.src=\'' + DEFAULT_AVATAR + '\'">' +
          '<span class="akari-sponsor-wall__name">' + escapeText(displayName) + '</span>' +
        '</span>' +
      '</li>'
    );
  }

  function applyVisibility(state) {
    var root = state.root;
    var list = state.list;
    var sponsors = state.sponsors;
    var fallbackName = state.fallbackName;
    var limit = state.expanded ? sponsors.length : Math.min(DEFAULT_VISIBLE, sponsors.length);

    var html = '';
    for (var i = 0; i < limit; i++) {
      html += buildItem(sponsors[i], fallbackName);
    }
    list.innerHTML = html;
    list.hidden = false;

    var toggleBtn = state.toggleBtn;
    if (!toggleBtn) return;

    if (sponsors.length <= DEFAULT_VISIBLE) {
      toggleBtn.hidden = true;
      return;
    }
    toggleBtn.hidden = false;
    var labelExpand = root.getAttribute('data-sponsor-toggle-expand') || 'Show all';
    var labelCollapse = root.getAttribute('data-sponsor-toggle-collapse') || 'Show less';
    if (state.expanded) {
      toggleBtn.textContent = labelCollapse;
      toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      toggleBtn.textContent = labelExpand.replace('{count}', String(sponsors.length));
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  function render(root, sponsors) {
    var list = root.querySelector('[data-sponsor-list]');
    if (!list) return;

    if (!sponsors || sponsors.length === 0) {
      list.hidden = true;
      setStatus(root, root.getAttribute('data-sponsor-empty') || '');
      return;
    }

    var fallbackName = root.getAttribute('data-sponsor-fallback-name') || 'Anonymous';
    var toggleBtn = root.querySelector('[data-sponsor-toggle]');

    var state = {
      root: root,
      list: list,
      sponsors: sponsors,
      fallbackName: fallbackName,
      toggleBtn: toggleBtn,
      expanded: false,
    };

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        state.expanded = !state.expanded;
        applyVisibility(state);
        if (!state.expanded) {
          var top = root.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    }

    var header = root.querySelector('.akari-sponsor-wall__intro');
    var countLabel = root.getAttribute('data-sponsor-count-label') || '';
    if (header && countLabel) {
      var existing = header.getAttribute('data-original-text');
      if (!existing) {
        header.setAttribute('data-original-text', header.textContent || '');
      }
      var base = header.getAttribute('data-original-text') || header.textContent || '';
      header.textContent = base + '  ·  ' + sponsors.length + ' ' + countLabel;
    }

    applyVisibility(state);
    setStatus(root, '');
  }

  function fetchJson(url) {
    return fetch(url, { credentials: 'omit', cache: 'default' }).then(function (resp) {
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return resp.json();
    });
  }

  function load(root) {
    var primary = root.getAttribute('data-sponsor-api') || DEFAULT_API;
    var fallback = root.getAttribute('data-sponsor-api-fallback') || FALLBACK_API;
    var promise = fetchJson(primary).catch(function (err) {
      if (primary === fallback) throw err;
      return fetchJson(fallback);
    });

    promise
      .then(function (data) {
        var sponsors = (data && data.sponsors) || [];
        render(root, sponsors);
      })
      .catch(function () {
        setStatus(root, root.getAttribute('data-sponsor-error') || 'Failed to load sponsors.');
        var list = root.querySelector('[data-sponsor-list]');
        if (list) list.hidden = true;
        var toggleBtn = root.querySelector('[data-sponsor-toggle]');
        if (toggleBtn) toggleBtn.hidden = true;
      });
  }

  function init() {
    var roots = document.querySelectorAll('.akari-sponsor-wall');
    Array.prototype.forEach.call(roots, load);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
