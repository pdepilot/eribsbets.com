/**
 * ERIBSBETS — live visitor presence (IP, geo, device).
 * Stores active sessions in localStorage; admin dashboard reads + polls.
 * Production: replace with server-side session tracking + WebSocket.
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "eribsbets_live_presence_v1";
  var SID_KEY = "eribsbets_presence_sid";
  var HEARTBEAT_MS = 8000;
  var STALE_MS = 40000;
  var IP_CACHE_KEY = "eribsbets_presence_geo_cache";
  var IP_CACHE_TTL = 15 * 60 * 1000;

  var heartbeatTimer = null;
  var started = false;

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function getSessionId() {
    try {
      var sid = sessionStorage.getItem(SID_KEY);
      if (!sid) {
        sid =
          "s_" +
          Date.now().toString(36) +
          "_" +
          Math.random().toString(36).slice(2, 10);
        sessionStorage.setItem(SID_KEY, sid);
      }
      return sid;
    } catch (e) {
      return "s_" + Date.now();
    }
  }

  function readStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var data = safeParse(raw);
      if (!data || typeof data !== "object") return { sessions: {} };
      if (!data.sessions || typeof data.sessions !== "object") {
        data.sessions = {};
      }
      return data;
    } catch (e) {
      return { sessions: {} };
    }
  }

  function writeStore(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      global.dispatchEvent(
        new CustomEvent("eribs-presence-update", { detail: { sessions: data.sessions } })
      );
    } catch (e) {
      /* quota */
    }
  }

  function pruneStale(sessions) {
    var now = Date.now();
    var out = {};
    Object.keys(sessions).forEach(function (id) {
      var s = sessions[id];
      if (s && now - (s.lastSeen || 0) < STALE_MS) {
        out[id] = s;
      }
    });
    return out;
  }

  function parseDevice(ua) {
    ua = ua || "";
    var mobile =
      /Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    var os = "Unknown OS";
    if (/Windows NT 10/i.test(ua)) os = "Windows 10/11";
    else if (/Windows/i.test(ua)) os = "Windows";
    else if (/Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) os = "macOS";
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/Linux/i.test(ua)) os = "Linux";

    var browser = "Browser";
    if (/Edg\//i.test(ua)) browser = "Edge";
    else if (/Chrome\//i.test(ua) && !/Edg/i.test(ua)) browser = "Chrome";
    else if (/Firefox\//i.test(ua)) browser = "Firefox";
    else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";

    var type = mobile ? "mobile" : "desktop";
    if (/iPad|Tablet/i.test(ua)) type = "tablet";

    return {
      type: type,
      os: os,
      browser: browser,
      label: type.charAt(0).toUpperCase() + type.slice(1) + " · " + browser + " · " + os,
    };
  }

  function getUserLabel() {
    var auth = global.ERIBSAuthSession;
    if (auth && typeof auth.getSession === "function") {
      var sess = auth.getSession();
      if (sess) {
        return {
          label: sess.displayName || sess.username || "Signed-in user",
          username: sess.username || "",
          accountNumber: sess.accountNumber || "",
        };
      }
    }
    return { label: "Guest", username: "", accountNumber: "" };
  }

  function readGeoCache() {
    try {
      var raw = sessionStorage.getItem(IP_CACHE_KEY);
      var c = safeParse(raw);
      if (c && c.fetchedAt && Date.now() - c.fetchedAt < IP_CACHE_TTL) {
        return c.geo;
      }
    } catch (e) {}
    return null;
  }

  function writeGeoCache(geo) {
    try {
      sessionStorage.setItem(
        IP_CACHE_KEY,
        JSON.stringify({ fetchedAt: Date.now(), geo: geo })
      );
    } catch (e) {}
  }

  function fetchGeo() {
    var cached = readGeoCache();
    if (cached) return Promise.resolve(cached);

    function fromIpwho(data) {
      if (!data || data.success === false) return null;
      return {
        ip: data.ip || "",
        city: data.city || "",
        region: data.region || "",
        country: data.country_code || data.country || "",
        countryName: data.country || "",
        lat: data.latitude,
        lon: data.longitude,
        isp: data.connection && data.connection.isp ? data.connection.isp : "",
        timezone: data.timezone && data.timezone.id ? data.timezone.id : "",
      };
    }

    function fromIpapi(data) {
      if (!data || data.error) return null;
      return {
        ip: data.ip || "",
        city: data.city || "",
        region: data.region || "",
        country: data.country_code || data.country || "",
        countryName: data.country_name || "",
        lat: data.latitude,
        lon: data.longitude,
        isp: data.org || "",
        timezone: data.timezone || "",
      };
    }

    return fetch("https://ipwho.is/", { cache: "no-store" })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        var geo = fromIpwho(data);
        if (geo && geo.ip) {
          writeGeoCache(geo);
          return geo;
        }
        throw new Error("ipwho failed");
      })
      .catch(function () {
        return fetch("https://ipapi.co/json/", { cache: "no-store" })
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            var geo = fromIpapi(data);
            if (geo && geo.ip) {
              writeGeoCache(geo);
              return geo;
            }
            return {
              ip: "—",
              city: "",
              region: "",
              country: "",
              countryName: "",
              lat: null,
              lon: null,
              isp: "",
              timezone: "",
            };
          });
      })
      .catch(function () {
        return {
          ip: "Unavailable",
          city: "",
          region: "",
          country: "",
          countryName: "",
          lat: null,
          lon: null,
          isp: "",
          timezone: "",
        };
      });
  }

  function isAdminContext() {
    return (
      (document.body && document.body.classList.contains("admin-app")) ||
      /\/dashboard\//i.test(location.pathname)
    );
  }

  function currentPageLabel() {
    var path = location.pathname || "";
    var file = path.split("/").pop() || "index.html";
    if (isAdminContext()) return "Admin · " + file;
    return file.replace(".html", "") || "home";
  }

  function upsertHeartbeat(geo) {
    var store = readStore();
    store.sessions = pruneStale(store.sessions);
    var sid = getSessionId();
    var user = getUserLabel();
    var dev = parseDevice(navigator.userAgent || "");
    var now = Date.now();
    var prev = store.sessions[sid] || {};

    store.sessions[sid] = {
      id: sid,
      userLabel: user.label,
      username: user.username,
      accountNumber: user.accountNumber,
      ip: (geo && geo.ip) || prev.ip || "—",
      city: (geo && geo.city) || prev.city || "",
      region: (geo && geo.region) || prev.region || "",
      country: (geo && geo.country) || prev.country || "",
      countryName: (geo && geo.countryName) || prev.countryName || "",
      lat: geo && geo.lat != null ? geo.lat : prev.lat,
      lon: geo && geo.lon != null ? geo.lon : prev.lon,
      isp: (geo && geo.isp) || prev.isp || "",
      timezone: (geo && geo.timezone) || prev.timezone || "",
      deviceType: dev.type,
      os: dev.os,
      browser: dev.browser,
      deviceLabel: dev.label,
      page: currentPageLabel(),
      userAgent: navigator.userAgent || "",
      isAdmin: isAdminContext(),
      firstSeen: prev.firstSeen || now,
      lastSeen: now,
    };

    writeStore(store);

    if (user.username && global.ERIBSRegisteredUserTelemetry) {
      var sess =
        global.ERIBSAuthSession &&
        typeof global.ERIBSAuthSession.getSession === "function"
          ? global.ERIBSAuthSession.getSession()
          : null;
      global.ERIBSRegisteredUserTelemetry.recordSessionSnapshot({
        username: user.username,
        displayName:
          sess && sess.displayName
            ? sess.displayName
            : user.label !== "Guest"
              ? user.label
              : "",
        accountNumber: user.accountNumber,
        balance:
          sess && typeof sess.balance === "number" ? sess.balance : undefined,
        geo: geo,
        device: dev,
        page: currentPageLabel(),
      });
    }

    return store.sessions[sid];
  }

  function tick() {
    return fetchGeo().then(function (geo) {
      return upsertHeartbeat(geo);
    });
  }

  function onUnload() {
    try {
      var store = readStore();
      var sid = getSessionId();
      if (store.sessions[sid]) {
        delete store.sessions[sid];
        writeStore(store);
      }
    } catch (e) {}
  }

  var api = {
    STORAGE_KEY: STORAGE_KEY,
    STALE_MS: STALE_MS,

    start: function () {
      if (started) return api;
      started = true;
      tick();
      heartbeatTimer = setInterval(tick, HEARTBEAT_MS);
      document.addEventListener("visibilitychange", function () {
        if (!document.hidden) tick();
      });
      global.addEventListener("pagehide", onUnload);
      global.addEventListener("beforeunload", onUnload);
      return api;
    },

    stop: function () {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      heartbeatTimer = null;
      started = false;
      onUnload();
    },

    getActiveSessions: function () {
      var store = readStore();
      var pruned = pruneStale(store.sessions);
      return Object.keys(pruned)
        .map(function (k) {
          return pruned[k];
        })
        .sort(function (a, b) {
          return (b.lastSeen || 0) - (a.lastSeen || 0);
        });
    },

    subscribe: function (callback) {
      if (typeof callback !== "function") return function () {};
      var handler = function () {
        callback(api.getActiveSessions());
      };
      global.addEventListener("eribs-presence-update", handler);
      global.addEventListener("storage", function (e) {
        if (e.key === STORAGE_KEY) handler();
      });
      var poll = setInterval(handler, 3000);
      handler();
      return function () {
        global.removeEventListener("eribs-presence-update", handler);
        clearInterval(poll);
      };
    },
  };

  global.ERIBSLivePresence = api;

  if (!document.body || !document.body.hasAttribute("data-no-presence")) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        api.start();
      });
    } else {
      api.start();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
