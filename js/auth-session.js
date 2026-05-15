/**
 * ERIBSBETS — client session helpers (ready for future API token wiring).
 * Session JSON never stores plaintext passwords. For demo/offline UX only,
 * a salted SHA-256 hash is kept in localStorage per username; replace with
 * server-side auth before production.
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "eribsbets_user_session";
  var PW_PREFIX = "eribsbets_pw_v1_";

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

  function normalizeUserKey(username) {
    if (!username || typeof username !== "string") return "";
    return username.trim().toLowerCase();
  }

  function credentialStorageKey(username) {
    return PW_PREFIX + encodeURIComponent(normalizeUserKey(username));
  }

  function bytesToHex(buffer) {
    var bytes = new Uint8Array(buffer);
    var hex = "";
    for (var i = 0; i < bytes.length; i++) {
      hex += ("0" + bytes[i].toString(16)).slice(-2);
    }
    return hex;
  }

  function randomSaltHex() {
    var bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    var hex = "";
    for (var i = 0; i < bytes.length; i++) {
      hex += ("0" + bytes[i].toString(16)).slice(-2);
    }
    return hex;
  }

  function subtleAvailable() {
    try {
      return (
        typeof crypto !== "undefined" &&
        crypto.subtle &&
        typeof crypto.getRandomValues === "function"
      );
    } catch (e) {
      return false;
    }
  }

  function hashPasswordWithSalt(plain, saltHex) {
    var enc = new TextEncoder();
    var payload = saltHex + "\n" + (plain || "");
    return crypto.subtle.digest("SHA-256", enc.encode(payload)).then(bytesToHex);
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
      if (typeof prev.passwordChangedAt === "number") {
        session.passwordChangedAt = prev.passwordChangedAt;
      }
      if (typeof partialSafe.passwordChangedAt === "number") {
        session.passwordChangedAt = partialSafe.passwordChangedAt;
      }
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

    hasPasswordCredential: function (username) {
      if (!normalizeUserKey(username)) return false;
      try {
        var raw = localStorage.getItem(credentialStorageKey(username));
        if (!raw) return false;
        var rec = safeParse(raw);
        return !!(rec && rec.v === 1 && rec.salt && rec.hash);
      } catch (e) {
        return false;
      }
    },

    setPasswordForUser: function (username, plain) {
      if (!normalizeUserKey(username) || !plain) {
        return Promise.resolve(false);
      }
      if (!subtleAvailable()) {
        return Promise.resolve(false);
      }
      var saltHex = randomSaltHex();
      return hashPasswordWithSalt(plain, saltHex).then(function (hashHex) {
        var rec = { v: 1, salt: saltHex, hash: hashHex };
        try {
          localStorage.setItem(
            credentialStorageKey(username),
            JSON.stringify(rec),
          );
        } catch (e) {
          return false;
        }
        return true;
      });
    },

    verifyPassword: function (username, plain) {
      if (!this.hasPasswordCredential(username)) {
        return Promise.resolve(true);
      }
      if (!subtleAvailable()) {
        return Promise.resolve(false);
      }
      var raw;
      try {
        raw = localStorage.getItem(credentialStorageKey(username));
      } catch (e) {
        return Promise.resolve(false);
      }
      var rec = safeParse(raw);
      if (!rec || !rec.salt || !rec.hash) {
        return Promise.resolve(false);
      }
      return hashPasswordWithSalt(plain, rec.salt).then(function (h) {
        return h === rec.hash;
      });
    },

    /**
     * @returns {Promise<{ ok: boolean, message?: string }>}
     */
    changePassword: function (username, oldPlain, newPlain) {
      var self = this;
      if (!normalizeUserKey(username)) {
        return Promise.resolve({ ok: false, message: "Not signed in." });
      }
      if (!newPlain || String(newPlain).length < 6) {
        return Promise.resolve({
          ok: false,
          message: "New password must be at least 6 characters.",
        });
      }
      if (!subtleAvailable()) {
        return Promise.resolve({
          ok: false,
          message:
            "Password updates need Web Crypto (use HTTPS or http://localhost).",
        });
      }
      function applyNew() {
        return self.setPasswordForUser(username, newPlain).then(function (setOk) {
          if (!setOk) {
            return { ok: false, message: "Could not save the new password." };
          }
          self.updateSession({ passwordChangedAt: Date.now() });
          return { ok: true };
        });
      }
      if (!self.hasPasswordCredential(username)) {
        return applyNew();
      }
      return self.verifyPassword(username, oldPlain).then(function (ok) {
        if (!ok) {
          return { ok: false, message: "Current password is incorrect." };
        }
        return applyNew();
      });
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
