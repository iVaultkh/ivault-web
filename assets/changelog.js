// Release notes from changelog/releases.json, the one list the site and the
// public GitHub releases share. The Changelog page shows every version;
// the Download page shows what is new in the latest.
(function () {
  var all = document.getElementById('releases');
  var latest = document.getElementById('whats-new');
  if (!all && !latest) return;
  var src = (document.currentScript && document.currentScript.dataset.src) || 'releases.json';

  var ICON = {
    features: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18"/></svg>',
    fixes: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    notes: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>'
  };
  var TITLE = { features: 'New', fixes: 'Fixed', notes: 'Good to know' };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function date(d) { return new Date(d + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }); }
  function list(r, key) {
    if (!r[key] || !r[key].length) return '';
    return '<h3>' + ICON[key] + TITLE[key] + '</h3><ul>' +
      r[key].map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }

  fetch(src).then(function (r) { return r.json(); }).then(function (rels) {
    if (all) {
      all.innerHTML = rels.map(function (r, i) {
        return '<section class="release" id="v' + esc(r.version) + '" aria-labelledby="t' + i + '">' +
          '<div class="release-head"><h2 id="t' + i + '">' + esc(r.version) + '</h2>' +
          (i === 0 ? '<span class="badge is-ready">Latest</span>' : '') +
          '<time datetime="' + esc(r.date) + '">' + date(r.date) + '</time></div>' +
          '<p>' + esc(r.summary) + '</p>' + list(r, 'features') + list(r, 'fixes') + list(r, 'notes') +
          '</section>';
      }).join('');
      var toc = document.getElementById('versions');
      if (toc) toc.innerHTML = rels.map(function (r) {
        return '<li><a href="#v' + esc(r.version) + '">' + esc(r.version) + '</a></li>';
      }).join('');
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
    }
    if (latest && rels[0]) {
      var r = rels[0];
      latest.innerHTML = '<h2 id="new">What\'s new in ' + esc(r.version) + '</h2>' +
        '<p class="meta">' + date(r.date) + ' · ' + esc(r.summary) + '</p>' +
        list(r, 'features') + list(r, 'fixes') +
        '<p><a href="../changelog/#v' + esc(r.version) + '">Full notes for ' + esc(r.version) + ' and earlier versions</a></p>';
      latest.hidden = false;
    }
  }).catch(function () {
    if (all) all.innerHTML = '<p>The release notes could not be loaded. They are also on <a href="https://github.com/iVaultkh/ivault-web/releases">GitHub Releases</a>.</p>';
  });
})();
