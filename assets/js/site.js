(function() {
  "use strict";

  var config = window.WisteriaSiteConfig || {};
  var i18n = window.WisteriaI18n;

  function rootPrefix() {
    return document.body.getAttribute("data-root") || ".";
  }

  function link(path) {
    var prefix = rootPrefix();
    var clean = String(path || "").replace(/^\/+/, "");
    if (!clean) return prefix + "/";
    return prefix + "/" + clean;
  }

  function isExternalHref(href) {
    return /^(https?:|mailto:|tel:|#|javascript:|data:)/i.test(String(href || ""));
  }

  function preserveLocaleInLinks(locale) {
    document.querySelectorAll("a[href]").forEach(function(node) {
      var raw = node.getAttribute("href");
      if (!raw || isExternalHref(raw)) return;

      try {
        var url = new URL(raw, window.location.href);
        url.searchParams.set("lang", locale);
        node.setAttribute("href", url.toString());
      } catch (_) {
        return;
      }
    });
  }

  function headerLinks(dict) {
    return [
      { id: "home", href: link(config.links.home), label: dict.nav.home },
      { id: "products", href: link(config.links.products), label: dict.nav.products },
      { id: "downloads", href: link(config.links.downloads), label: dict.nav.downloads },
      { id: "pricing", href: link(config.links.pricing), label: dict.nav.pricing },
      { id: "support", href: link(config.links.support), label: dict.nav.support },
      { id: "privacy", href: link(config.links.privacy), label: dict.nav.privacy },
      { id: "terms", href: link(config.links.terms), label: dict.nav.terms },
      { id: "refund", href: link(config.links.refund), label: dict.nav.refund }
    ];
  }

  function renderHeader(locale, dict) {
    var page = document.body.getAttribute("data-page");
    var el = document.getElementById("site-header");
    if (!el) return;

    var navItems = headerLinks(dict).map(function(item) {
      var active = item.id === page ? "is-active" : "";
      return '<a class="nav-link ' + active + '" href="' + item.href + '">' + item.label + "</a>";
    }).join("");

    el.innerHTML = [
      '<header class="site-header">',
      '  <div class="shell nav-shell">',
      '    <a class="brand-lockup" href="' + link(config.links.home) + '">',
      '      <span class="brand-kicker">' + config.brand.name + "</span>",
      '      <span class="brand-name">' + config.brand.suiteName + "</span>",
      "    </a>",
      '    <div class="nav-cluster">',
      '      <nav class="site-nav">' + navItems + "</nav>",
      '      <div class="lang-switch" aria-label="' + dict.languageSwitchLabel + '">',
      '        <button class="lang-btn ' + (locale === "en" ? "is-active" : "") + '" data-locale-switch="en">EN</button>',
      '        <button class="lang-btn ' + (locale === "zh" ? "is-active" : "") + '" data-locale-switch="zh">中文</button>',
      "      </div>",
      "    </div>",
      "  </div>",
      "</header>"
    ].join("");
  }

  function renderFooter(dict) {
    var el = document.getElementById("site-footer");
    if (!el) return;

    el.innerHTML = [
      '<footer class="site-footer">',
      '  <div class="shell footer-grid">',
      '    <div>',
      '      <div class="footer-brand">' + config.brand.suiteName + "</div>",
      '      <p class="footer-copy">' + dict.footer.tagline + "</p>",
      "    </div>",
      '    <div class="footer-links">',
      '      <a href="' + link(config.links.products) + '">' + dict.nav.products + "</a>",
      '      <a href="' + link(config.links.downloads) + '">' + dict.nav.downloads + "</a>",
      '      <a href="' + link(config.links.pricing) + '">' + dict.nav.pricing + "</a>",
      '      <a href="' + link(config.links.support) + '">' + dict.nav.support + "</a>",
      '      <a href="' + link(config.links.privacy) + '">' + dict.nav.privacy + "</a>",
      '      <a href="' + link(config.links.terms) + '">' + dict.nav.terms + "</a>",
      '      <a href="' + link(config.links.refund) + '">' + dict.nav.refund + "</a>",
      "    </div>",
      '    <div class="footer-meta">',
      '      <div>' + config.brand.companyName + "</div>",
      '      <div>' + dict.footer.legal + "</div>",
      '      <div>Company No. ' + config.brand.companyNumber + "</div>",
      '      <div>' + dict.footer.contact + ': <a href="mailto:' + config.brand.supportEmail + '">' + config.brand.supportEmail + "</a></div>",
      "    </div>",
      "  </div>",
      "</footer>"
    ].join("");
  }

  function applyConfig() {
    document.querySelectorAll("[data-config-href]").forEach(function(node) {
      var value = i18n.getByPath(config, node.getAttribute("data-config-href"));
      if (value) node.setAttribute("href", value);
    });

    document.querySelectorAll("[data-config-text]").forEach(function(node) {
      var value = i18n.getByPath(config, node.getAttribute("data-config-text"));
      if (value != null) node.textContent = value;
    });
  }

  function initLocaleSwitch() {
    document.querySelectorAll("[data-locale-switch]").forEach(function(node) {
      node.addEventListener("click", function() {
        var next = node.getAttribute("data-locale-switch");
        i18n.setLocale(next);
        var url = new URL(window.location.href);
        url.searchParams.set("lang", next);
        window.location.href = url.toString();
      });
    });
  }

  function initCarousel() {
    var root = document.querySelector("[data-carousel]");
    if (!root) return;

    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel-slide"));
    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    var dots = root.querySelector("[data-carousel-dots]");
    var index = 0;

    function render() {
      slides.forEach(function(slide, idx) {
        slide.classList.toggle("is-active", idx === index);
      });
      if (dots) {
        dots.innerHTML = slides.map(function(_, idx) {
          return '<button class="dot ' + (idx === index ? "is-active" : "") + '" data-dot-index="' + idx + '"></button>';
        }).join("");
        dots.querySelectorAll("[data-dot-index]").forEach(function(btn) {
          btn.addEventListener("click", function() {
            index = Number(btn.getAttribute("data-dot-index")) || 0;
            render();
          });
        });
      }
    }

    if (prev) {
      prev.addEventListener("click", function() {
        index = (index - 1 + slides.length) % slides.length;
        render();
      });
    }
    if (next) {
      next.addEventListener("click", function() {
        index = (index + 1) % slides.length;
        render();
      });
    }

    render();
  }

  function boot() {
    var locale = i18n.getLocale();
    var dict = i18n.translate(locale);
    renderHeader(locale, dict);
    renderFooter(dict);
    applyConfig();
    i18n.translate(locale);
    preserveLocaleInLinks(locale);
    initLocaleSwitch();
    initCarousel();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
