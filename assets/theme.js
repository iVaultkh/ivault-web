// Light/dark, like the app: follow the OS until the visitor picks, then
// remember the pick. Storage can be blocked (private windows), so every
// access is guarded and the page still works without it.
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('ivault-theme'); } catch (e) {}
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function apply(dark) { root.classList.toggle('dark', dark); }
  apply(saved ? saved === 'dark' : media.matches);
  media.addEventListener('change', function (e) {
    var pinned = null;
    try { pinned = localStorage.getItem('ivault-theme'); } catch (err) {}
    if (!pinned) apply(e.matches);
  });
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    var dark = !root.classList.contains('dark');
    apply(dark);
    try { localStorage.setItem('ivault-theme', dark ? 'dark' : 'light'); } catch (err) {}
  });
})();
