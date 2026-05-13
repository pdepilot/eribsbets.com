/**
 * ERIBSBETS — client session helpers (ready for future API token wiring).
 * Stores non-sensitive profile fields; never store passwords here.
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "eribsbets_user_session";

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function readPersisted() {
    var fromSession = sessionStorage.getItem(STORAGE_KEY);
    if (fromSession) {
      var a = safeParse(fromSession);
      if (a) return a;
    }
    var fromLocal = localStorage.getItem(STORAGE_KEY);
    if (fromLocal) {
      var b = safeParse(fromLocal);
      if (b) return b;
    }
    return null;
  }

  function generateAccountNumber() {
    var digits = "";
    for (var i = 0; i < 10; i++) {
      digits += String(Math.floor(Math.random() * 10));
    }
    return "ERIBS-" + digits;
  }

  global.ERIBSAuthSession = {
    STORAGE_KEY: STORAGE_KEY,

    getSession: function () {
      return readPersisted();
    },

    /**
     * @param {Object} partial
     * @param {string} [partial.displayName]
     * @param {string} [partial.username]
     * @param {number} [partial.balance]
     * @param {boolean} [partial.rememberMe]
     */
    saveSession: function (partial) {
      var prev = readPersisted() || {};
      var partialSafe = partial || {};
      var session = {
        version: 1,
        displayName:
          partialSafe.displayName != null
            ? partialSafe.displayName
            : prev.displayName || "Princeton Echefu",
        username:
          partialSafe.username != null
            ? partialSafe.username
            : prev.username || "",
        accountNumber: prev.accountNumber || generateAccountNumber(),
        balance:
          typeof partialSafe.balance === "number"
            ? partialSafe.balance
            : typeof prev.balance === "number"
              ? prev.balance
              : 0,
        rememberMe: !!partialSafe.rememberMe,
        loggedInAt: Date.now(),
      };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        if (session.rememberMe) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        /* quota / private mode */
      }
    },

    updateSession: function (patch) {
      var cur = readPersisted();
      if (!cur) return;
      Object.assign(cur, patch, { loggedInAt: Date.now() });
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cur));
        if (cur.rememberMe) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cur));
        }
      } catch (e) {}
    },

    clearSession: function () {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
