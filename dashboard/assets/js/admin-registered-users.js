/**
 * ERIBSBETS Admin — table rows for registered users + telemetry from localStorage
 */
(function () {
  "use strict";

  var tbody = document.getElementById("registered-users-tbody");
  var emptyNote = document.getElementById("registered-users-empty");
  var subtitle = document.getElementById("registered-users-meta");

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function fmtSeen(ts) {
    if (!ts) return "—";
    try {
      return new Date(ts).toLocaleString();
    } catch (e) {
      return "—";
    }
  }

  function deviceDisplay(row) {
    if (row.deviceLabel) return row.deviceLabel;
    var parts = [];
    if (row.deviceType) parts.push(row.deviceType);
    if (row.browser) parts.push(row.browser);
    if (row.os) parts.push(row.os);
    return parts.length ? parts.join(" · ") : "—";
  }

  function initials(name, fallback) {
    var n = (name || "").trim();
    if (!n) return (fallback || "?").slice(0, 2).toUpperCase();
    var bits = n.split(/\s+/);
    if (bits.length >= 2)
      return (bits[0][0] + bits[1][0]).toUpperCase();
    return n.slice(0, 2).toUpperCase();
  }

  function render(locals, Tel) {
    if (!Tel || typeof Tel.listSorted !== "function") return;
    var list = Tel.listSorted();
    var filtered =
      locals && locals.toolbarSearch && locals.toolbarSearch.trim()
        ? list.filter(function (u) {
            var blob =
              (u.displayName || "") +
              " " +
              (u.username || "") +
              " " +
              (u.ip || "") +
              " " +
              (u.locationLabel || "") +
              " " +
              deviceDisplay(u);
            return blob.toLowerCase().indexOf(locals.toolbarSearch.toLowerCase()) !== -1;
          })
        : list;

    if (subtitle) {
      subtitle.textContent =
        list.length +
        " account(s) on this browser · last login/geo/device refreshes every ~8s while they browse.";
    }

    if (!tbody) return;

    if (!filtered.length) {
      tbody.innerHTML = "";
      if (emptyNote) emptyNote.hidden = false;
      return;
    }
    if (emptyNote) emptyNote.hidden = true;

    var rows = filtered.map(function (u) {
      var loc = u.locationLabel || "—";
      var maps =
        u.lat != null && u.lon != null
          ? ' <a class="admin-presence-map" href="https://www.google.com/maps?q=' +
            encodeURIComponent(u.lat + "," + u.lon) +
            '" target="_blank" rel="noopener" title="Map"><i class="fa-solid fa-map-location-dot"></i></a>'
          : "";
      return (
        "<tr data-real-account=\"1\">" +
        '<td><div class="admin-user-cell"><span class="mini-avatar">' +
        escapeHtml(initials(u.displayName, u.username)) +
        '</span><div><strong>' +
        escapeHtml(u.displayName || "Account") +
        '</strong><br /><span style="color:var(--admin-text-3);font-size:12px">' +
        escapeHtml(u.accountNumber || "") +
        "</span></div></div></td>" +
        '<td><span style="font-size:13px">' +
        escapeHtml(u.username || "—") +
        "</span></td>" +
        '<td class="admin-ip-cell"><code>' +
        escapeHtml(u.ip || "—") +
        "</code></td>" +
        '<td class="admin-location-cell">' +
        escapeHtml(loc) +
        maps +
        "</td>" +
        '<td><span class="admin-device-pill">' +
        escapeHtml(deviceDisplay(u)) +
        "</span></td>" +
        "<td>" +
        escapeHtml(fmtSeen(u.lastSeen)) +
        "</td>" +
        '<td style="color:var(--admin-text-3)">' +
        (typeof u.balance === "number"
          ? "₦" + u.balance.toLocaleString()
          : "—") +
        "</td>" +
        '<td><span class="admin-badge success">Active</span></td>' +
        '<td style="color:var(--admin-text-3)">' +
        escapeHtml(u.registeredAt ? fmtSeen(u.registeredAt).split(",")[0] : "—") +
        "</td>" +
        '<td><button type="button" class="admin-btn admin-btn-ghost" disabled title="Wire backend APIs">' +
        "Edit</button></td>" +
        "</tr>"
      );
    });

    tbody.innerHTML = rows.join("");
  }

  function init() {
    if (!tbody && !subtitle && !emptyNote) return;

    var Tel = window.ERIBSRegisteredUserTelemetry;
    var locals = {
      toolbarSearch: "",
    };

    function toolbarListeners() {
      var inp = document.getElementById("registered-users-toolbar-search");
      if (!inp) return;
      inp.addEventListener("input", function () {
        locals.toolbarSearch = inp.value;
        render(locals, Tel);
      });
    }

    toolbarListeners();

    if (!Tel) {
      if (emptyNote) {
        emptyNote.hidden = false;
        emptyNote.textContent =
          "Telemetry script missing — ensure ../js/registered-user-telemetry.js loads.";
      }
      return;
    }

    Tel.subscribe(function () {
      render(locals, Tel);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
