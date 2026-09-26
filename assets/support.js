// Help page: filter answers as you type, open the answer a link points to,
// and give every answer a "Copy link" button for pasting into replies.
(function () {
  var input = document.getElementById('help-q');
  var count = document.getElementById('help-count');
  var empty = document.getElementById('help-empty');
  var items = Array.prototype.slice.call(document.querySelectorAll('.help details'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('.help .prose > section'));
  var texts = items.map(function (d) { return d.textContent.toLowerCase().replace(/\s+/g, ' '); });
  var wasOpen = null;

  function filter() {
    var q = input.value.trim().toLowerCase();
    var terms = q.split(/\s+/).filter(Boolean);
    if (terms.length && !wasOpen) wasOpen = items.map(function (d) { return d.open; });
    var shown = 0;
    items.forEach(function (d, i) {
      var hit = terms.every(function (t) { return texts[i].indexOf(t) !== -1; });
      d.hidden = !hit;
      if (terms.length) d.open = hit;
      if (hit) shown++;
    });
    sections.forEach(function (s) {
      var has = s.querySelector('details');
      s.hidden = terms.length > 0 && !!has && !s.querySelector('details:not([hidden])');
    });
    if (!terms.length && wasOpen) {
      items.forEach(function (d, i) { d.open = wasOpen[i]; });
      wasOpen = null;
    }
    empty.hidden = !(terms.length && shown === 0);
    empty.querySelector('span').textContent = input.value.trim();
    count.textContent = terms.length ? shown + (shown === 1 ? ' answer' : ' answers') : '';
  }
  input.addEventListener('input', filter);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { input.value = ''; filter(); }
  });
  document.addEventListener('keydown', function (e) {
    var typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); input.focus(); }
  });

  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (el && el.tagName === 'DETAILS') {
      el.open = true;
      el.scrollIntoView({ block: 'start' });
    }
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();

  items.forEach(function (d) {
    var panel = d.querySelector('.panel');
    if (!panel || !d.id) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost btn-sm copy-link';
    btn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg><span>Copy link</span>';
    btn.addEventListener('click', function () {
      var url = location.origin + location.pathname + '#' + d.id;
      var label = btn.querySelector('span');
      function done(text) { label.textContent = text; setTimeout(function () { label.textContent = 'Copy link'; }, 1600); }
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { done('Link copied'); }, function () { done('Copy failed'); });
      else done('Copy failed');
      history.replaceState(null, '', '#' + d.id);
    });
    panel.appendChild(btn);
  });
})();
