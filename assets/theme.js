// Light/dark, like the app: follow the OS until the visitor picks, then
// remember the pick. Storage can be blocked (private windows), so every
// access is guarded and the page still works without it.
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('ivault-theme'); } catch (e) {}
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function apply(dark) { root.classList.toggle('dark', dark); }
  // A page can ask to open light (the privacy policy reads as a document).
  var prefersDark = root.dataset.defaultTheme === 'light' ? false : media.matches;
  apply(saved ? saved === 'dark' : prefersDark);
  media.addEventListener('change', function (e) {
    var pinned = null;
    try { pinned = localStorage.getItem('ivault-theme'); } catch (err) {}
    if (!pinned && root.dataset.defaultTheme !== 'light') apply(e.matches);
  });
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    var dark = !root.classList.contains('dark');
    apply(dark);
    try { localStorage.setItem('ivault-theme', dark ? 'dark' : 'light'); } catch (err) {}
  });

  // Highlight the index entry for the section being read.
  document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('.policy .toc a');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var byId = {};
    links.forEach(function (a) { byId[a.hash.slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = byId[en.target.id]; if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  });
})();
