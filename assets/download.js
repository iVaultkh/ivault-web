// Download page: point the installer buttons at the files of the latest
// public release, and show its version. The API is public and unauthenticated
// (60 requests an hour per visitor), so any failure leaves the buttons on the
// release page they already link to.
(function () {
  var store = document.getElementById('store');
  if (store && store.dataset.storeLive !== 'true') {
    var btn = store.querySelector('.dl-store');
    btn.setAttribute('aria-disabled', 'true');
    btn.removeAttribute('href');
  } else if (store) {
    document.getElementById('store-note').hidden = true;
  }

  var status = document.getElementById('dl-status');
  var targets = { x64: document.getElementById('dl-x64'), arm64: document.getElementById('dl-arm64') };

  function mb(bytes) { return (bytes / 1048576).toFixed(0) + ' MB'; }

  fetch('https://api.github.com/repos/iVaultkh/ivault-web/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (r) {
      if (r.status === 404) {
        status.textContent = 'The first public installers are on their way. Until then, get iVault from the Microsoft Store.';
        throw null;
      }
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function (rel) {
      var found = 0;
      Object.keys(targets).forEach(function (arch) {
        var asset = (rel.assets || []).filter(function (a) {
          return new RegExp('_' + arch + '-setup\\.exe$').test(a.name);
        })[0];
        if (!asset || !targets[arch]) return;
        targets[arch].href = asset.browser_download_url;
        targets[arch].insertAdjacentHTML('beforeend', ' <span class="dl-size tabular">' + mb(asset.size) + '</span>');
        found++;
      });
      var ver = (rel.tag_name || '').replace(/^v/, '');
      if (ver) document.getElementById('dl-version').textContent = 'Version ' + ver;
      status.textContent = found
        ? 'iVault ' + ver + ' · released ' + new Date(rel.published_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
        : 'The installers for this release are not up yet. The links open the release page.';
    })
    .catch(function (e) {
      if (e === null) return;
      status.textContent = 'Could not reach GitHub just now. The links open the latest release page.';
    });
})();
