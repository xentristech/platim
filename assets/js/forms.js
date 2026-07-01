/* ==========================================================================
   PLATIM — Formulario de cotización
   Valida el formulario y abre WhatsApp con el resumen de la solicitud.
   Solo actúa en páginas que contienen el formulario (#quoteForm).
   ========================================================================== */
(function () {
  var form = document.getElementById('quoteForm');
  var card = document.getElementById('formCard');
  if (!form || !card) return;

  var WHATSAPP = '573023660481';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var lineas = [];
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === 'submit' || !el.value || !el.value.trim()) return;
      var etq = el.id ? form.querySelector('label[for="' + el.id + '"]') : null;
      var nombre = etq ? etq.textContent.trim() : el.name;
      lineas.push('• ' + nombre + ': ' + el.value.trim());
    });

    var texto = 'Hola PLATIM, quiero solicitar una cotización:\n\n' + lineas.join('\n');
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank');
    card.classList.add('is-sent');
    form.reset();
  });
})();
