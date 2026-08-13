(function() {
  var TWIKOO_CDN = 'https://cdn.jsdelivr.net/npm/twikoo@1.7.13/dist/twikoo.all.min.js';
  var TWIKOO_ENV_ID = 'https://comment.rikka.moe';
  var PAGE_VIEWS_API = '/api/page-views';

  function loadStats() {
    var containers = document.querySelectorAll('[data-post-url]');
    if (!containers.length) return;

    var urlSet = new Set();
    var urls = [];
    containers.forEach(function(el) {
      var url = el.getAttribute('data-post-url');
      if (url && !urlSet.has(url)) {
        urlSet.add(url);
        urls.push(url);
      }
    });
    if (!urls.length) return;

    fetchViews(urls);
    fetchComments(urls);
  }

  function fetchViews(urls) {
    fetch(PAGE_VIEWS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: urls })
    })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (!data || !data.views) return;
        updateViews(data.views);
      })
      .catch(function(err) { console.error('[post-stats] views fetch failed:', err); });
  }

  function updateViews(views) {
    document.querySelectorAll('[data-post-url]').forEach(function(el) {
      var url = el.getAttribute('data-post-url');
      var viewEl = el.querySelector('[data-stats-views]');
      if (viewEl && views[url] !== undefined) {
        viewEl.textContent = views[url].toLocaleString();
      }
    });
  }

  function fetchComments(urls) {
    function callGetCommentsCount() {
      if (!window.twikoo || !window.twikoo.getCommentsCount) return;
      window.twikoo.getCommentsCount({
        envId: TWIKOO_ENV_ID,
        urls: urls,
        includeReply: false
      })
        .then(function(res) {
          if (!Array.isArray(res)) return;
          var commentMap = {};
          res.forEach(function(item) {
            commentMap[item.url] = item.count;
          });
          updateComments(commentMap);
        })
        .catch(function(err) { console.error('[post-stats] comments fetch failed:', err); });
    }

    if (window.twikoo && window.twikoo.getCommentsCount) {
      callGetCommentsCount();
      return;
    }

    var existing = document.querySelector('script[data-akari-twikoo="true"]');
    if (existing) {
      if (window.twikoo) callGetCommentsCount();
      else existing.addEventListener('load', callGetCommentsCount, { once: true });
      return;
    }

    var script = document.createElement('script');
    script.src = TWIKOO_CDN;
    script.async = true;
    script.dataset.akariTwikoo = 'true';
    script.addEventListener('load', callGetCommentsCount, { once: true });
    script.addEventListener('error', function() {
      console.error('[post-stats] twikoo SDK load failed');
    });
    document.head.appendChild(script);
  }

  function updateComments(commentMap) {
    document.querySelectorAll('[data-post-url]').forEach(function(el) {
      var url = el.getAttribute('data-post-url');
      var commentEl = el.querySelector('[data-stats-comments]');
      if (commentEl && commentMap[url] !== undefined) {
        commentEl.textContent = commentMap[url].toLocaleString();
      }
    });
  }

  // astro:page-load fires on both initial load and view transitions (ClientRouter enabled).
  // Using it as the sole trigger avoids duplicate API calls on first page load.
  document.addEventListener('astro:page-load', loadStats);
})();
