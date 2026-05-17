/**
 * ERIBSBETS — last-known IP, location, and device per registered account (demo/localStorage).
 * Updated when users browse with js/live-presence.js while signed in.
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "eribsbets_registered_user_telemetry_v1";
  var EVT = "eribs-registered-telemetry-update";

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function normalizeUser(username) {
    if (!username || typeof username !== "string") return "";
    return username.trim().toLowerCase();
  }

  function readStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var data = safeParse(raw);
      if (!data || typeof data !== "object") return { version: 1, users: {} };
      if (!data.users || typeof data.users !== "object") data.users = {};
      return data;
    } catch (e) {
      return { version: 1, users: {} };
    }
  }

  function writeStore(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      global.dispatchEvent(new CustomEvent(EVT, { detail: { users: data.users } }));
    } catch (e) {}
  }

  function formatLocation(geo) {
    if (!geo) return "";
    var parts = [];
    if (geo.city) parts.push(geo.city);
    if (geo.region && geo.region !== geo.city) parts.push(geo.region);
    if (geo.countryName) parts.push(geo.countryName);
    else if (geo.country) parts.push(geo.country);
    return parts.join(", ");
  }

  global.ERIBSRegisteredUserTelemetry = {
    STORAGE_KEY: STORAGE_KEY,

    readRaw: function () {
      return readStore().users;
    },

    ensureAccount: function (partial) {
      var u = normalizeUser(partial && partial.username);
      if (!u) return;
      var store = readStore();
      var now = Date.now();
      var prev = store.users[u] || {};
      store.users[u] = Object.assign({}, prev, {
        username: partial.username.trim(),
        displayName:
          partial.displayName != null && partial.displayName !== ""
            ? partial.displayName
            : prev.displayName || partial.username.trim(),
        phone: partial.phone != null ? partial.phone : prev.phone || "",
        registeredAt: prev.registeredAt || now,
      });
      writeStore(store);
    },

    /**
     * @param {Object} o
     * @param {string} o.username
     * @param {string} [o.displayName]
     * @param {string} [o.accountNumber]
     * @param {Object} [o.geo] ipwho/ipapi shape
     * @param {Object} [o.device] parseDevice shape
     * @param {string} [o.page]
     */
    recordSessionSnapshot: function (o) {
      if (!o || !normalizeUser(o.username)) return;
      var store = readStore();
      var key = normalizeUser(o.username);
      var now = Date.now();
      var prev = store.users[key] || {};
      var geo = o.geo || {};

      store.users[key] = Object.assign({}, prev, {
        username: o.username.trim(),
        displayName:
          o.displayName != null && o.displayName !== ""
            ? o.displayName
            : prev.displayName || o.username.trim(),
        accountNumber:
          o.accountNumber != null ? o.accountNumber : prev.accountNumber || "",
        ip: geo.ip || prev.ip || "—",
        city: geo.city != null && geo.city !== "" ? geo.city : prev.city || "",
        region:
          geo.region != null && geo.region !== ""
            ? geo.region
            : prev.region || "",
        country:
          geo.country != null && geo.country !== ""
            ? geo.country
            : prev.country || "",
        countryName:
          geo.countryName != null && geo.countryName !== ""
            ? geo.countryName
            : prev.countryName || "",
        lat: geo.lat != null ? geo.lat : prev.lat,
        lon: geo.lon != null ? geo.lon : prev.lon,
        deviceType: (o.device && o.device.type) || prev.deviceType || "",
        os: (o.device && o.device.os) || prev.os || "",
        browser: (o.device && o.device.browser) || prev.browser || "",
        deviceLabel:
          (o.device && o.device.label) || prev.deviceLabel || "",
        page: o.page || prev.page || "",
        lastSeen: now,
      });

      store.users[key].locationLabel =
        formatLocation({
          city: store.users[key].city,
          region: store.users[key].region,
          country: store.users[key].country,
          countryName: store.users[key].countryName,
        }) ||
        prev.locationLabel ||
        "";

      if (typeof o.balance === "number") {
        store.users[key].balance = o.balance;
      } else if (typeof prev.balance === "number") {
        store.users[key].balance = prev.balance;
      }

      writeStore(store);
    },

    listSorted: function () {
      var users = readStore().users;
      return Object.keys(users)
        .map(function (k) {
          return users[k];
        })
        .sort(function (a, b) {
          return (b.lastSeen || 0) - (a.lastSeen || 0);
        });
    },

    subscribe: function (fn) {
      if (typeof fn !== "function") return function () {};
      var handler = function () {
        fn(global.ERIBSRegisteredUserTelemetry.listSorted());
      };
      global.addEventListener(EVT, handler);
      global.addEventListener("storage", function (e) {
        if (e.key === STORAGE_KEY) handler();
      });
      var poll = setInterval(handler, 4000);
      handler();
      return function () {
        global.removeEventListener(EVT, handler);
        clearInterval(poll);
      };
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
