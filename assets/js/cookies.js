/* =====================================================================
   PLATIM — Banner de consentimiento de cookies
   - Autocontenido (inyecta sus propios estilos y HTML).
   - Guarda la decisión en localStorage: una vez elegida, NO se vuelve a pedir.
   - Incluye Google Consent Mode v2 (por defecto denegado hasta aceptar) y
     un evento 'platim:consent' para conectar Meta Pixel u otros a futuro.
   ===================================================================== */
(function () {
  'use strict';

  var KEY = 'platim_cookie_consent';        // 'accepted' | 'rejected'
  var DATE_KEY = 'platim_cookie_consent_date';
  var POLICY_URL = '/politica-privacidad';

  /* --- Estado por defecto para Google Consent Mode (v2): todo denegado --- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });

  /* --- Si el usuario ya decidió, aplicamos y salimos (no mostramos nada) --- */
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'accepted' || saved === 'rejected') {
    applyConsent(saved);
    return;
  }

  /* --- Estilos del banner (colores de marca PLATIM) --- */
  var css =
    '.platim-cookies{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;' +
      'background:#13243a;color:#EAF0F6;box-shadow:0 -8px 30px rgba(0,0,0,.35);' +
      'border-top:3px solid #6BAA1F;padding:18px 20px;' +
      'transform:translateY(110%);transition:transform .4s ease;font-family:inherit;}' +
    '.platim-cookies.is-visible{transform:translateY(0);}' +
    '.platim-cookies.is-hidden{transform:translateY(110%);}' +
    '.platim-cookies__inner{max-width:1120px;margin:0 auto;display:flex;gap:18px;' +
      'align-items:center;justify-content:space-between;flex-wrap:wrap;}' +
    '.platim-cookies__text{flex:1 1 420px;font-size:.9rem;line-height:1.5;margin:0;}' +
    '.platim-cookies__text a{color:#9BD34B;text-decoration:underline;font-weight:600;}' +
    '.platim-cookies__actions{display:flex;gap:10px;flex:0 0 auto;flex-wrap:wrap;}' +
    '.platim-cookies__btn{cursor:pointer;border-radius:8px;padding:11px 22px;' +
      'font-size:.9rem;font-weight:700;border:2px solid transparent;font-family:inherit;' +
      'transition:opacity .2s ease,background .2s ease;}' +
    '.platim-cookies__btn--accept{background:#6BAA1F;color:#0D1B2A;}' +
    '.platim-cookies__btn--accept:hover{opacity:.9;}' +
    '.platim-cookies__btn--reject{background:transparent;color:#EAF0F6;border-color:rgba(234,240,246,.4);}' +
    '.platim-cookies__btn--reject:hover{background:rgba(234,240,246,.1);}' +
    '@media (max-width:640px){' +
      '.platim-cookies__inner{flex-direction:column;align-items:stretch;}' +
      '.platim-cookies__actions{justify-content:stretch;}' +
      '.platim-cookies__btn{flex:1 1 auto;}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* --- Banner --- */
  var banner = document.createElement('div');
  banner.className = 'platim-cookies';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Aviso de cookies y privacidad');
  banner.innerHTML =
    '<div class="platim-cookies__inner">' +
      '<p class="platim-cookies__text">🍪 Usamos cookies propias y de terceros (Google, Meta y otros) para ' +
        'analizar el tráfico, medir campañas y mejorar tu experiencia. El contenido del sitio también puede ser ' +
        'indexado o procesado por buscadores e inteligencia artificial (p. ej. OpenAI). ' +
        'Consulta nuestra <a href="' + POLICY_URL + '">Política de privacidad</a>.</p>' +
      '<div class="platim-cookies__actions">' +
        '<button type="button" class="platim-cookies__btn platim-cookies__btn--reject" data-reject>Rechazar</button>' +
        '<button type="button" class="platim-cookies__btn platim-cookies__btn--accept" data-accept>Aceptar</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(banner);
  // Mostrar con animación en el siguiente frame
  requestAnimationFrame(function () { banner.classList.add('is-visible'); });

  banner.querySelector('[data-accept]').addEventListener('click', function () { decide('accepted'); });
  banner.querySelector('[data-reject]').addEventListener('click', function () { decide('rejected'); });

  /* --- Guarda la decisión y cierra --- */
  function decide(value) {
    try {
      localStorage.setItem(KEY, value);
      localStorage.setItem(DATE_KEY, new Date().toISOString());
    } catch (e) {}
    banner.classList.remove('is-visible');
    banner.classList.add('is-hidden');
    setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 450);
    applyConsent(value);
  }

  /* --- Aplica el consentimiento a las herramientas de terceros --- */
  function applyConsent(value) {
    var granted = value === 'accepted' ? 'granted' : 'denied';
    // Google Consent Mode
    gtag('consent', 'update', {
      ad_storage: granted,
      analytics_storage: granted,
      ad_user_data: granted,
      ad_personalization: granted
    });
    // Evento para conectar Meta Pixel u otros scripts cuando se agreguen
    try {
      window.dispatchEvent(new CustomEvent('platim:consent', { detail: { consent: value } }));
    } catch (e) {}
  }
})();
