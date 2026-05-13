/**
 * ERIBSBETS — User profile dashboard interactions (vanilla JS).
 */
(function () {
  "use strict";

  var BALANCE_HIDDEN_KEY = "eribsbets_profile_balance_hidden";

  function $(id) {
    return document.getElementById(id);
  }

  function formatNaira(amount) {
    var n = typeof amount === "number" && !isNaN(amount) ? amount : 0;
    return (
      "₦" +
      n.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function maskBalance() {
    return "₦ *****";
  }

  function showToast(message, variant) {
    var root = $("profile-toast-root");
    if (!root) return;
    var el = document.createElement("div");
    el.className = "profile-toast " + (variant || "info");
    el.textContent = message;
    root.appendChild(el);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add("show");
      });
    });
    setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () {
        el.remove();
      }, 380);
    }, 2800);
  }

  function getSession() {
    if (
      !window.ERIBSAuthSession ||
      typeof window.ERIBSAuthSession.getSession !== "function"
    ) {
      return null;
    }
    return window.ERIBSAuthSession.getSession();
  }

  function firstName(displayName) {
    if (!displayName || typeof displayName !== "string") return "Player";
    var parts = displayName.trim().split(/\s+/);
    return parts[0] || "Player";
  }

  function readBalanceHidden() {
    try {
      return sessionStorage.getItem(BALANCE_HIDDEN_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function writeBalanceHidden(hidden) {
    try {
      if (hidden) sessionStorage.setItem(BALANCE_HIDDEN_KEY, "1");
      else sessionStorage.removeItem(BALANCE_HIDDEN_KEY);
    } catch (e) {}
  }

  function initTheme() {
    var body = document.body;
    var btn = $("theme-toggle");
    var icon = $("theme-icon");
    try {
      if (localStorage.getItem("theme") === "light") {
        body.classList.add("light-theme");
        if (icon) icon.textContent = "☀️";
      }
    } catch (e) {}
    if (!btn) return;
    btn.addEventListener("click", function () {
      body.classList.toggle("light-theme");
      var isLight = body.classList.contains("light-theme");
      if (icon) icon.textContent = isLight ? "☀️" : "🌙";
      try {
        localStorage.setItem("theme", isLight ? "light" : "dark");
      } catch (e) {}
    });
  }

  function setSidebarOpen(open) {
    var body = document.body;
    var toggle = $("menu-toggle");
    var backdrop = $("sidebar-backdrop");
    if (open) body.classList.add("sidebar-open");
    else body.classList.remove("sidebar-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (backdrop) backdrop.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function initSidebar() {
    var toggle = $("menu-toggle");
    var backdrop = $("sidebar-backdrop");
    var closeBtn = $("sidebar-close-btn");
    if (toggle) {
      toggle.addEventListener("click", function () {
        setSidebarOpen(!document.body.classList.contains("sidebar-open"));
      });
    }
    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setSidebarOpen(false);
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        setSidebarOpen(false);
      });
    }
    window.addEventListener(
      "keydown",
      function (e) {
        if (e.key === "Escape") setSidebarOpen(false);
      },
      false,
    );
    window.addEventListener(
      "resize",
      function () {
        if (window.innerWidth > 960) setSidebarOpen(false);
      },
      false,
    );
  }

  function updateBalanceUI(session, hidden) {
    var amountEl = $("balance-amount");
    var heroStat = $("hero-balance-stat");
    var formatted = formatNaira(session.balance);
    var text = hidden ? maskBalance() : formatted;
    if (amountEl) {
      amountEl.dataset.visible = hidden ? "false" : "true";
      amountEl.classList.add("is-hiding");
      window.setTimeout(function () {
        amountEl.textContent = text;
        amountEl.classList.remove("is-hiding");
      }, 160);
    }
    if (heroStat) {
      heroStat.textContent = hidden ? maskBalance() : formatted;
    }
    var btn = $("balance-visibility-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", hidden ? "true" : "false");
      btn.setAttribute("aria-label", hidden ? "Show balance" : "Hide balance");
      btn.setAttribute("title", hidden ? "Show balance" : "Hide balance");
      var icon = btn.querySelector("i");
      if (icon) {
        icon.className = hidden ? "fas fa-eye-slash" : "fas fa-eye";
      }
    }
  }

  function initBalanceToggle(session) {
    var btn = $("balance-visibility-toggle");
    if (!btn) return;
    var hidden = readBalanceHidden();
    updateBalanceUI(session, hidden);
    btn.addEventListener("click", function () {
      var next = !readBalanceHidden();
      writeBalanceHidden(next);
      updateBalanceUI(session, next);
    });
  }

  function populateUser(session) {
    var displayName = session.displayName || "Princeton Echefu";
    var username = session.username || "—";
    var account = session.accountNumber || "—";

    var elName = $("user-display-name");
    var elUser = $("user-username");
    var elAcct = $("user-account-number");
    var heroName = $("hero-name");
    var heroAcct = $("hero-account-stat");

    if (elName) elName.textContent = displayName;
    if (elUser) elUser.textContent = username;
    if (elAcct) elAcct.textContent = account;
    if (heroName) heroName.textContent = firstName(displayName);
    if (heroAcct) heroAcct.textContent = account;
  }

  function initNavRows() {
    var rows = document.querySelectorAll(".sidebar-nav .nav-row[data-nav]");
    rows.forEach(function (row) {
      row.addEventListener("click", function (e) {
        e.preventDefault();
        rows.forEach(function (r) {
          r.classList.remove("is-active");
          r.removeAttribute("aria-current");
        });
        row.classList.add("is-active");
        row.setAttribute("aria-current", "page");
        showToast(
          "This section will load live data when your API is connected.",
          "info",
        );
      });
    });
  }

  function initLogout() {
    var btn = $("btn-logout");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (window.ERIBSAuthSession && window.ERIBSAuthSession.clearSession) {
        window.ERIBSAuthSession.clearSession();
      }
      try {
        sessionStorage.removeItem(BALANCE_HIDDEN_KEY);
      } catch (e) {}
      window.location.href = "index.html?auth=login";
    });
  }

  function initFunds() {
    var dep = $("btn-deposit");
    var wdr = $("btn-withdraw");
    if (dep) {
      dep.addEventListener("click", function () {
        showToast(
          "Deposit: connect your payment gateway here (placeholder).",
          "success",
        );
      });
    }
    if (wdr) {
      wdr.addEventListener("click", function () {
        showToast(
          "Withdrawal: wire to payout service when backend is ready.",
          "info",
        );
      });
    }
  }

  function boot() {
    var session = getSession();
    if (!session || !String(session.username || "").trim()) {
      window.location.replace("index.html?auth=login");
      return;
    }

    document.body.classList.add("js-boot-done");
    populateUser(session);
    initBalanceToggle(session);
    initTheme();
    initSidebar();
    initNavRows();
    initLogout();
    initFunds();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
