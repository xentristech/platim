/* ==========================================================================
   PLATIM — Menú móvil
   Abre/cierra la navegación móvil y la cierra al hacer clic en un enlace.
   ========================================================================== */
(function () {
  var btn = document.getElementById('menuToggle');
  var nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    var open = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', String(!open));
    btn.setAttribute('aria-expanded', String(!open));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      nav.setAttribute('data-open', 'false');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
