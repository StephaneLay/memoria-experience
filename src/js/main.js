(function () {
  var toggle = document.querySelector('.site-header__toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
    });
  }

  var year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
