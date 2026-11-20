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


  // Highlight the nav link of the section currently in view
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav a[href^="#"]'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function spy() {
    var y = window.scrollY + header.offsetHeight + 120, current = 0;
    sections.forEach(function (sec, i) { if (sec && sec.offsetTop <= y) current = i; });
    var atTop = window.scrollY < 40;
    navLinks.forEach(function (a, i) { a.classList.toggle('active', !atTop && i === current || atTop && i === 0); });
  }
  spy();
  window.addEventListener('scroll', spy, { passive: true });

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

  function show(el) {
    el.classList.add('in');
    io.unobserve(el);
  }

  // Reveal a little BEFORE an element reaches the viewport, and also reveal
  // anything the reader has already scrolled past (e.g. after jumping to #contact),
  // so no content is ever left invisible.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting || entry.boundingClientRect.top < 0) show(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px 18% 0px' });

  // Printing or exporting the page: show everything
  window.addEventListener('beforeprint', function () {
    items.forEach(function (el) { el.classList.add('in'); });
  });

  items.forEach(function (el) { io.observe(el); });
})();
