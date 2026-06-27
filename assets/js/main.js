/* ==========================================================================
   PLATIM — Funciones generales del sitio
   Punto de entrada común. El menú móvil vive en menu.js y la lógica del
   formulario en forms.js. Agrega aquí utilidades globales a futuro.
   ========================================================================== */
(function () {
  // Año dinámico en el footer (si existe un elemento con [data-year]).
  var y = document.querySelectorAll('[data-year]');
  if (y.length) {
    var anio = String(new Date().getFullYear());
    y.forEach(function (el) { el.textContent = anio; });
  }
})();
