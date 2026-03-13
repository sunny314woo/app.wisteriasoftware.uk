(function() {
  "use strict";

  function getByPath(obj, path) {
    return String(path || "")
      .split(".")
      .reduce(function(acc, part) {
        return acc && typeof acc === "object" ? acc[part] : undefined;
      }, obj);
  }

  function getUrlLocale() {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get("lang");
    } catch (_) {
      return "";
    }
  }

  function getStoredLocale() {
    try {
      return window.localStorage.getItem("wisteria-locale") || "";
    } catch (_) {
      return "";
    }
  }

  function setStoredLocale(locale) {
    try {
      window.localStorage.setItem("wisteria-locale", locale);
    } catch (_) {
      return;
    }
  }

  function getLocale() {
    var requested = getUrlLocale() || getStoredLocale() || "en";
    return requested === "zh" ? "zh" : "en";
  }

  function getDictionary(locale) {
    var locales = window.WisteriaLocales || {};
    return locales[locale] || locales.en || {};
  }

  function translate(locale) {
    var dict = getDictionary(locale);
    var fallback = getDictionary("en");

    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-i18n]").forEach(function(node) {
      var key = node.getAttribute("data-i18n");
      var value = getByPath(dict, key);
      if (value == null) value = getByPath(fallback, key);
      if (value != null) node.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function(node) {
      var key = node.getAttribute("data-i18n-html");
      var value = getByPath(dict, key);
      if (value == null) value = getByPath(fallback, key);
      if (value != null) node.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function(node) {
      var key = node.getAttribute("data-i18n-placeholder");
      var value = getByPath(dict, key);
      if (value == null) value = getByPath(fallback, key);
      if (value != null) node.setAttribute("placeholder", value);
    });

    var titleKey = document.body.getAttribute("data-title-key");
    var descKey = document.body.getAttribute("data-description-key");
    var titleValue = titleKey ? getByPath(dict, titleKey) || getByPath(fallback, titleKey) : "";
    var descValue = descKey ? getByPath(dict, descKey) || getByPath(fallback, descKey) : "";

    if (titleValue) document.title = titleValue;
    if (descValue) {
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", descValue);
    }

    return dict;
  }

  window.WisteriaI18n = {
    getByPath: getByPath,
    getLocale: getLocale,
    setLocale: setStoredLocale,
    getDictionary: getDictionary,
    translate: translate
  };
})();
