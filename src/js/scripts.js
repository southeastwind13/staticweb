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

  // --- Booking/inquiry form via FormSubmit AJAX ---
  // (fetch always sends Origin, so it works despite Azure's Referrer-Policy)
  var bookingForm = document.querySelector('.bps-booking-form');
  if (bookingForm) {
    var showFormMsg = function (msg, ok) {
      var el = bookingForm.querySelector('.bps-form-result');
      if (!el) {
        el = document.createElement('p');
        el.className = 'bps-form-result';
        bookingForm.appendChild(el);
      }
      el.textContent = msg;
      el.style.color = ok ? '#2ecc71' : '#c0392b';
    };
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var action = bookingForm.getAttribute('action') || '';
      var ajaxUrl = action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      var btn = bookingForm.querySelector('.bps-form-submit');
      var prev = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'กำลังส่ง…'; }

      var payload = {};
      new FormData(bookingForm).forEach(function (val, key) {
        if (key !== '_honey' && key !== '_next') payload[key] = val;
      });

      fetch(ajaxUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (res) {
          if (res && (res.success === 'true' || res.success === true)) {
            window.location.href = '/thanks.html';
          } else {
            showFormMsg(
              (res && res.message) || 'ส่งไม่สำเร็จ กรุณาลองใหม่ หรือทักไลน์ @Baanpermsook',
              false
            );
            if (btn) { btn.disabled = false; btn.textContent = prev; }
          }
        })
        .catch(function () {
          showFormMsg('เกิดข้อผิดพลาดในการส่ง กรุณาทักไลน์ @Baanpermsook', false);
          if (btn) { btn.disabled = false; btn.textContent = prev; }
        });
    });
  }

  // ---------------------------------------------------------------------------
  // Analytics: GA4 events + (optional) Google Ads conversions
  // ---------------------------------------------------------------------------
  // GA4 (G-CG82G9GPN5) and GTM (GTM-PLKLTZT) are loaded in the <head> of every
  // page. Everything below adds the *lead* signals GA4 cannot measure on its own.
  //
  // TO SWITCH ON GOOGLE ADS CONVERSIONS: fill in the ids below, taken from
  // Google Ads → Goals → Conversions → (each action) → "Tag setup" →
  // "Install the tag yourself". `id` is the AW-xxxxxxxxx number (same for every
  // action); each `label` is the string after the slash in send_to.
  // While `id` is empty nothing extra is sent — the GA4 events still fire.
  // Full walkthrough: docs/google-analytics-setup.md
  // The GA4 measurement id must be passed explicitly on every event.
  // WHY: gtm.js loads before gtag.js and shares the same dataLayer, so the GTM
  // container owns the default gtag destination. An event sent without
  // `send_to` lands in GTM-PLKLTZT (where no trigger matches it) and never
  // reaches GA4 — verified in the browser: without send_to no /g/collect
  // request is made at all, with it the hit goes out. This is why
  // line_click / booking_form_submit showed 0 in GA4 and Google Ads.
  var GA4_ID = 'G-CG82G9GPN5';

  var ADS = {
    id: '',                 // e.g. 'AW-123456789'
    labels: {
      booking_form_submit: '',   // conversion "Submit lead form" (primary)
      line_click: '',            // conversion "LINE click"
      phone_click: ''            // conversion "Phone call click"
    }
  };

  if (ADS.id && typeof gtag === 'function') {
    // gtag.js is already on the page; this just adds the Ads destination.
    gtag('config', ADS.id);
  }

  var pageMeta = function () {
    return {
      page_path: location.pathname,
      page_lang: /^\/en\//.test(location.pathname) ? 'en' : 'th'
    };
  };

  // Send one event to GA4, GTM's dataLayer, and Google Ads (when configured).
  var track = function (name, params) {
    var data = Object.assign(pageMeta(), params || {});
    try { if (typeof gtag === 'function') gtag('event', name, Object.assign({ send_to: GA4_ID }, data)); } catch (e) {}
    try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, data)); } catch (e) {}

    var label = ADS.labels[name];
    if (ADS.id && label) {
      try { if (typeof gtag === 'function') gtag('event', 'conversion', { send_to: ADS.id + '/' + label }); } catch (e) {}
    }
  };

  var linkText = function (a) {
    return (a.textContent || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  };

  // Delegated so it also covers links added after load (lightbox, etc.)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';

    // Booking intent — tapping through to LINE
    if (href.indexOf('line.me') > -1) {
      track('line_click', { link_text: linkText(a), link_url: a.href });

    // Booking intent — tapping the phone number
    } else if (/^tel:/i.test(href)) {
      track('phone_click', { link_text: linkText(a), phone_number: href.replace(/^tel:/i, '') });

    // "Where is it?" — the single biggest signal in the Ads account (1,936/mo)
    } else if (/maps\.app\.goo\.gl|google\.[^/]+\/maps/.test(href)) {
      track('map_click', { link_text: linkText(a), link_url: a.href });

    // Social / review platforms
    } else if (href.indexOf('facebook.com') > -1) {
      track('social_click', { platform: 'facebook', link_url: a.href });
    } else if (href.indexOf('agoda.com') > -1 || href.indexOf('booking.com') > -1) {
      track('ota_click', { platform: href.indexOf('agoda.com') > -1 ? 'agoda' : 'booking.com', link_url: a.href });
    }
  }, true);

  // Funnel step: someone actually started filling the booking form.
  // Fires at most once per page view, so form_start → booking_form_submit
  // gives a real completion rate.
  if (bookingForm) {
    var formStarted = false;
    bookingForm.addEventListener('input', function () {
      if (formStarted) return;
      formStarted = true;
      track('form_start', { form_source: (bookingForm.querySelector('input[name="ที่มา"], input[name="Source"]') || {}).value || '' });
    });
  }

  // Completed booking request (fires once, on the thank-you page — covers both
  // the AJAX redirect and the no-JS FormSubmit fallback). This is the GA4 key
  // event to import into Google Ads as the primary conversion.
  if (/\/thanks\.html$/.test(location.pathname)) {
    track('booking_form_submit', {});
  }
});
