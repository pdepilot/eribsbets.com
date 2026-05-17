/**
 * ERIBSBETS Admin — session gate + demo login (replace with API auth for production).
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "eribsbets_admin_session_v1";
  var LOGIN_FILE = "admin-login.html";

  function onLoginPage() {
    var path = global.location.pathname || "";
    return /admin-login\.html$/i.test(path);
  }

  function parseSession() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      return o && o.ok === true ? o : null;
    } catch (e) {
      return null;
    }
  }

  function normalizeEmail(s) {
    return String(s || "")
      .trim()
      .toLowerCase();
  }

  global.ERIBSAdminAuth = {
    STORAGE_KEY: STORAGE_KEY,

    isAuthenticated: function () {
      return parseSession() !== null;
    },

    /**
     * Demo credentials — change before shipping anything real.
     */
    login: function (email, password) {
      var em = normalizeEmail(email);
      var pw = String(password || "");
      if (em === "admin@eribsbets.demo" && pw === "Admin123!") {
        try {
          sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              ok: true,
              email: em,
              at: Date.now(),
            }),
          );
        } catch (e) {}
        return true;
      }
      return false;
    },

    logout: function () {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      global.location.href = LOGIN_FILE;
    },

    guard: function () {
      if (onLoginPage()) return;
      if (!global.ERIBSAdminAuth.isAuthenticated()) {
        global.location.replace(LOGIN_FILE);
      }
    },
  };

  global.ERIBSAdminAuth.guard();
})(typeof window !== "undefined" ? window : globalThis);
