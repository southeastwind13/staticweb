/*!
* Start Bootstrap - Business Frontpage v5.0.9 (https://startbootstrap.com/template/business-frontpage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-frontpage/blob/master/LICENSE)
*/
// Baan Perm Sook — site scripts (vanilla JS, no framework)

document.addEventListener('DOMContentLoaded', function () {
  // Mobile navbar toggle (Bootstrap JS is not loaded, so wire it up manually)
  var toggler = document.querySelector('.navbar-toggler');
  var collapse = document.getElementById('navbarSupportedContent');
  if (toggler && collapse) {
    toggler.addEventListener('click', function () {
      collapse.classList.toggle('show');
    });
    // Close the menu after tapping a link (mobile)
    collapse.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        collapse.classList.remove('show');
      });
    });
  }

  // Smooth scroll for in-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id.length < 2) return; // ignore "#" and "#!"
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
