/*!
* Start Bootstrap - Business Frontpage v5.0.9 (https://startbootstrap.com/template/business-frontpage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-frontpage/blob/master/LICENSE)
*/
// Baan Perm Sook — site scripts (vanilla JS, no framework)

document.addEventListener('DOMContentLoaded', function () {
  // --- Mobile navbar toggle (Bootstrap JS is not loaded, so wire it up manually) ---
  var toggler = document.querySelector('.navbar-toggler');
  var collapse = document.getElementById('navbarSupportedContent');
  if (toggler && collapse) {
    toggler.addEventListener('click', function () {
      collapse.classList.toggle('show');
    });
    collapse.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        collapse.classList.remove('show');
      });
    });
  }

  // Valid in-page anchor like "#section" (excludes "#", "#!", etc.)
  var isValidHash = function (href) {
    return /^#[A-Za-z][\w-]*$/.test(href);
  };

  // --- Smooth scroll for in-page anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (!isValidHash(id)) return; // ignore "#" and "#!"
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Sticky navbar: add shadow/compact state once the page is scrolled ---
  var navbar = document.querySelector('.navbar.bg-dark');
  if (navbar) {
    var onScroll = function () {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- Scroll-reveal animations (progressive enhancement) ---
  var revealSelector = '.bps-header-center, .bps-problem-item, .bps-highlight-box, ' +
    '.bps-solution-image, .bps-card, .bps-room-card, .bps-obj-item, ' +
    '.bps-testim-card, .bps-gallery-item, .bps-faq-item, .bps-cta-box, .bps-article-card, ' +
    '.bps-story-text, .bps-promo-card, .bps-distance-item';
  var revealEls = document.querySelectorAll(revealSelector);
  if ('IntersectionObserver' in window && revealEls.length) {
    revealEls.forEach(function (el) { el.classList.add('bps-reveal'); });
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('bps-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  // --- Active nav link based on the section in view (homepage only) ---
  var navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link[href^="#"]'));
  var sections = navLinks
    .map(function (link) {
      var href = link.getAttribute('href');
      return isValidHash(href) ? document.querySelector(href) : null;
    })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = '#' + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (sec) { sectionObserver.observe(sec); });
  }

  // --- Lightbox for gallery and room images ---
  var zoomable = document.querySelectorAll('.bps-gallery-item img, .bps-room-img img');
  if (zoomable.length) {
    var lightbox = document.createElement('div');
    lightbox.className = 'bps-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML =
      '<button class="bps-lightbox-close" aria-label="ปิด">&times;</button>' +
      '<img class="bps-lightbox-img" src="" alt="">';
    document.body.appendChild(lightbox);
    var lightboxImg = lightbox.querySelector('.bps-lightbox-img');

    var openLightbox = function (src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    var closeLightbox = function () {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    zoomable.forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        openLightbox(img.currentSrc || img.src, img.alt);
      });
    });
    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }
});
