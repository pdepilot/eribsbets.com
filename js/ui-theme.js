(function () {
  "use strict";

  var STORAGE_KEY = "eribs-ui-theme";
  var DEFAULT = "neon-green";
  var VALID = {
    "neon-green": true,
    "electric-blue": true,
    "dark-gold": true,
    "crimson-red": true,
    "midnight-purple": true,
    "ice-white-glass": true,
    "cyber-black": true,
    "stadium-night": true,
  };

  function sanitize(id) {
    return id && VALID[id] ? id : DEFAULT;
  }

  function applyTheme(id) {
    var v = sanitize(id);
    document.documentElement.setAttribute("data-ui-theme", v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch (e) {}
    try {
      document.dispatchEvent(
        new CustomEvent("eribs-ui-theme-changed", { detail: { theme: v } }),
      );
    } catch (e2) {}
    return v;
  }

  function readStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  applyTheme(readStored() || DEFAULT);

  window.addEventListener("storage", function (e) {
    if (e.key !== STORAGE_KEY || e.newValue == null) return;
    var v = sanitize(e.newValue);
    document.documentElement.setAttribute("data-ui-theme", v);
    try {
      document.dispatchEvent(
        new CustomEvent("eribs-ui-theme-changed", { detail: { theme: v } }),
      );
    } catch (err) {}
  });

  window.ERIBS_UI_THEME = {
    apply: applyTheme,
    get: function () {
      return (
        document.documentElement.getAttribute("data-ui-theme") || DEFAULT
      );
    },
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT: DEFAULT,
  };
})();
