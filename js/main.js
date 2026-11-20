(function () {
  'use strict';

  document.body.classList.remove('no-js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('header.site');

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Header border once the page scrolls
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Smooth scroll for in-page links (also moves focus for keyboard users)
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      var target = id === '#top' ? document.body : document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      var top = id === '#top'
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - (header.offsetHeight - 1);

      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.pushState(null, '', id);

      if (id !== '#top') {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // Scroll-triggered fade-in
  var items = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

  items.forEach(function (el) { io.observe(el); });
})();
