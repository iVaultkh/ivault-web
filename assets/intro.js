// Brand intro, after wuxia-web's BrandIntro: the vault ring draws on like a
// dial, the inner ring settles, the play button pops in, a violet glow
// blooms and the wordmark rises; then the whole card fades away.
//
// Loaded in <head> without defer so it can hide the page before first paint.
// It plays once per browser session, is skipped by a click or any key, is
// cut to a short still for reduced motion, and can never strand the page:
// a failsafe removes the cover even if the rest of this file fails.
(function () {
  var root = document.documentElement;
  var seen = false;
  try { seen = sessionStorage.getItem('ivault-intro') === '1'; } catch (e) {}
  if (seen) return;
  try { sessionStorage.setItem('ivault-intro', '1'); } catch (e) {}

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('intro-on');
  var failsafe = setTimeout(function () { root.classList.remove('intro-on'); }, 4000);

  var MARK =
    '<svg viewBox="0 0 512 512" aria-hidden="true">' +
    '<circle class="ring" cx="256" cy="256" r="158" pathLength="100"/>' +
    '<circle class="inner" cx="256" cy="256" r="112"/>' +
    '<path class="play" d="M222 190 L222 322 L336 256 Z"/>' +
    '</svg>';

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.createElement('div');
    el.className = 'brand-intro' + (reduce ? ' reduce' : '');
    el.setAttribute('role', 'presentation');
    el.innerHTML = '<div class="stage"><div class="glow"></div>' + MARK + '<div class="word">iVault</div></div>';
    document.body.appendChild(el);

    var gone = false;
    function finish() {
      if (gone) return;
      gone = true;
      clearTimeout(failsafe);
      el.classList.add('leaving');
      root.classList.remove('intro-on');
      setTimeout(function () { el.remove(); }, 320);
      document.removeEventListener('keydown', finish);
    }
    el.addEventListener('click', finish);
    document.addEventListener('keydown', finish);
    setTimeout(finish, reduce ? 500 : 1700);
  });
})();
