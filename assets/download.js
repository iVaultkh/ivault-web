// One-click download. Every `a[data-download]` becomes a direct link to the
// right Windows installer from this repo's latest public release: x64 or
// Arm64, picked from the browser. Anything that cannot be decided (not
// Windows, no release yet, GitHub unreachable) leaves the link where it
// already points -- the Download page, or the release page -- so a click
// always lands somewhere useful.
(function () {
  var API = 'https://api.github.com/repos/iVaultkh/ivault-web/releases/latest';
  var ua = navigator.userAgent;
  var isWindows = /Windows NT/.test(ua) || (navigator.userAgentData && navigator.userAgentData.platform === 'Windows');

  // Chromium browsers (Edge, Chrome) can say whether Windows runs on Arm;
  // everything else is taken to be x64, which is what almost every PC is.
  function archOf() {
    var uad = navigator.userAgentData;
    if (!uad || !uad.getHighEntropyValues) return Promise.resolve('x64');
    return uad.getHighEntropyValues(['architecture'])
      .then(function (v) { return v.architecture === 'arm' ? 'arm64' : 'x64'; })
      .catch(function () { return 'x64'; });
  }

  function mb(bytes) { return Math.round(bytes / 1048576) + ' MB'; }
  function installer(rel, arch) {
    return (rel.assets || []).filter(function (a) {
      return new RegExp('_' + arch + '-setup\\.exe$').test(a.name);
    })[0];
  }
  function releaseDate(rel) {
    return new Date(rel.published_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Download page only: the Store button waits for the listing to go live.
  var store = document.getElementById('store');
  if (store && store.dataset.storeLive !== 'true') {
    var sb = store.querySelector('.dl-store');
    sb.setAttribute('aria-disabled', 'true');
    sb.removeAttribute('href');
  } else if (store) {
    document.getElementById('store-note').hidden = true;
  }

  var status = document.getElementById('dl-status');
  function say(text) { if (status) status.textContent = text; }

  var release = fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (r) {
      if (r.status === 404) { say('The first public installer is on its way. Until then, get iVault from the Microsoft Store.'); return null; }
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });

  Promise.all([release, archOf()]).then(function (res) {
    var rel = res[0], arch = res[1];
    if (!rel) return;
    var ver = (rel.tag_name || '').replace(/^v/, '');
    var mine = installer(rel, arch);

    // The one-click buttons: only on Windows, where the file will run.
    if (isWindows && mine) {
      document.querySelectorAll('a[data-download]').forEach(function (a) {
        a.href = mine.browser_download_url;
        var label = a.querySelector('.dl-label');
        if (label) label.textContent = 'Download for Windows' + (arch === 'arm64' ? ' (Arm64)' : '');
        var meta = a.querySelector('.dl-meta');
        if (meta) meta.textContent = ver + ' · ' + mb(mine.size);
      });
    }

    // The Download page's explicit per-architecture links.
    ['x64', 'arm64'].forEach(function (a) {
      var el = document.getElementById('dl-' + a), file = installer(rel, a);
      if (el && file) {
        el.href = file.browser_download_url;
        el.textContent = 'Windows ' + (a === 'x64' ? 'x64' : 'Arm64') + ' · ' + mb(file.size);
      }
    });
    var v = document.getElementById('dl-version');
    if (v && ver) v.textContent = 'Version ' + ver;
    if (!mine) say('The installers for iVault ' + ver + ' are not up yet. The button opens the release page.');
    else if (!isWindows) say('iVault ' + ver + ' is for Windows. Download it on your PC, or use the links below.');
    else say('iVault ' + ver + ' · released ' + releaseDate(rel) + ' · ' + (arch === 'arm64' ? 'Arm64 detected' : 'for 64-bit Windows (x64)'));
  }).catch(function () {
    say('Could not reach GitHub just now. The button opens the latest release page.');
  });
})();
