/**
 * ERIBSBETS Admin — real-time live visitors (IP, location, device)
 */
(function () {
  "use strict";

  var panel = document.getElementById("live-presence-panel");
  if (!panel) return;

  var tbody = document.getElementById("live-presence-tbody");
  var countEl = document.getElementById("live-presence-count");
  var emptyEl = document.getElementById("live-presence-empty");
  var updatedEl = document.getElementById("live-presence-updated");
  var searchInput = document.getElementById("live-presence-search");
  var statOnline = document.getElementById("stat-online-now");

  var lastIds = {};
  var allSessions = [];

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function deviceIcon(type) {
    if (type === "mobile") return "fa-mobile-screen";
    if (type === "tablet") return "fa-tablet-screen-button";
    return "fa-desktop";
  }

  function formatLocation(s) {
    var parts = [];
    if (s.city) parts.push(s.city);
    if (s.region && s.region !== s.city) parts.push(s.region);
    if (s.countryName) parts.push(s.countryName);
    else if (s.country) parts.push(s.country);
    return parts.length ? parts.join(", ") : "—";
  }

  function timeAgo(ts) {
    var sec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (sec < 5) return "just now";
    if (sec < 60) return sec + "s ago";
    var min = Math.floor(sec / 60);
    if (min < 60) return min + "m ago";
    return Math.floor(min / 60) + "h ago";
  }

  function matchesSearch(s, q) {
    if (!q) return true;
    q = q.toLowerCase();
    var blob =
      (s.userLabel || "") +
      " " +
      (s.username || "") +
      " " +
      (s.ip || "") +
      " " +
      (s.city || "") +
      " " +
      (s.country || "") +
      " " +
      (s.deviceLabel || "") +
      " " +
      (s.page || "");
    return blob.toLowerCase().indexOf(q) !== -1;
  }

  function render(sessions) {
    allSessions = sessions || [];
    var q = searchInput ? searchInput.value.trim() : "";
    var filtered = allSessions.filter(function (s) {
      return matchesSearch(s, q);
    });

    if (countEl) {
      countEl.textContent = allSessions.length + " online · updating live";
    }
    if (statOnline) {
      statOnline.textContent = String(allSessions.length);
      statOnline.setAttribute("data-count-to", String(allSessions.length));
    }
    if (updatedEl) {
      updatedEl.textContent =
        "Last refresh " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
    }

    if (!tbody) return;

    if (!filtered.length) {
      tbody.innerHTML = "";
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    var rows = filtered.map(function (s) {
      var isNew = !lastIds[s.id];
      lastIds[s.id] = true;
      var loc = formatLocation(s);
      var maps =
        s.lat != null && s.lon != null
          ? ' <a class="admin-presence-map" href="https://www.google.com/maps?q=' +
            encodeURIComponent(s.lat + "," + s.lon) +
            '" target="_blank" rel="noopener" title="Open map"><i class="fa-solid fa-map-location-dot"></i></a>'
          : "";

      var tr = document.createElement("tr");
      tr.className = "admin-presence-row" + (isNew ? " is-new" : "");
      tr.setAttribute("data-session-id", s.id);

      tr.innerHTML =
        '<td><div class="admin-user-cell"><span class="mini-avatar">' +
        escapeHtml((s.userLabel || "?").slice(0, 2).toUpperCase()) +
        '</span><div><strong>' +
        escapeHtml(s.userLabel || "Guest") +
        '</strong><br /><span style="color:var(--admin-text-3);font-size:12px">' +
        escapeHtml(s.username || s.accountNumber || s.id.slice(0, 12)) +
        "</span></div></div></td>" +
        '<td class="admin-ip-cell"><code>' +
        escapeHtml(s.ip || "—") +
        "</code></td>" +
        '<td class="admin-location-cell">' +
        escapeHtml(loc) +
        maps +
        "</td>" +
        '<td><span class="admin-device-pill"><i class="fa-solid ' +
        deviceIcon(s.deviceType) +
        '"></i> ' +
        escapeHtml(s.deviceLabel || s.browser + " · " + s.os) +
        "</span></td>" +
        '<td><span class="admin-badge ' +
        (s.isAdmin ? "info" : "success") +
        '">' +
        escapeHtml(s.page || "—") +
        "</span></td>" +
        '<td><span class="admin-presence-pulse"><i class="fa-solid fa-circle"></i> ' +
        escapeHtml(timeAgo(s.lastSeen || Date.now())) +
        "</span></td>";

      return tr;
    });

    tbody.innerHTML = "";
    rows.forEach(function (row) {
      tbody.appendChild(row);
    });
  }

  function init() {
    var presence = window.ERIBSLivePresence;
    if (!presence) {
      if (emptyEl) {
        emptyEl.hidden = false;
        emptyEl.textContent =
          "Presence tracker not loaded. Ensure js/live-presence.js is included.";
      }
      return;
    }
    presence.start();
    presence.subscribe(render);
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        render(allSessions);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
