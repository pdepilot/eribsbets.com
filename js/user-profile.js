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

    var elDetailName = $("profile-field-display-name");
    var elDetailUser = $("profile-field-username");
    var elDetailAcct = $("profile-field-account");
    if (elDetailName) elDetailName.textContent = displayName;
    if (elDetailUser) elDetailUser.textContent = username;
    if (elDetailAcct) elDetailAcct.textContent = account;

    var elSince = $("hero-member-since");
    if (elSince && typeof session.loggedInAt === "number" && session.loggedInAt > 0) {
      elSince.textContent = new Date(session.loggedInAt).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } else if (elSince) {
      elSince.textContent = "—";
    }

    var heroUserStat = $("hero-username-stat");
    if (heroUserStat) heroUserStat.textContent = username;

    var rgAcct = $("rg-help-account");
    if (rgAcct) rgAcct.textContent = account;

    var elPwChanged = $("password-last-changed");
    if (elPwChanged) {
      if (typeof session.passwordChangedAt === "number" && session.passwordChangedAt > 0) {
        elPwChanged.textContent = new Date(session.passwordChangedAt).toLocaleDateString(
          "en-NG",
          { month: "short", day: "numeric", year: "numeric" },
        );
      } else {
        elPwChanged.textContent = "Not yet";
      }
    }
  }

  function initNavRows() {
    var rows = document.querySelectorAll(".sidebar-nav .nav-row[data-nav]");
    rows.forEach(function (row) {
      row.addEventListener("click", function (e) {
        var href = row.getAttribute("href");
        if (href && href !== "#" && href.indexOf("#") !== 0) {
          return;
        }
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
    initProfilePageActions();
    initPasswordChange();
    initVoucherRedeem();
    initResponsibleGaming();
    initBetLaunchButtons();
    initBetPlacedWelcome();
  }

  function initBetLaunchButtons() {
    document.querySelectorAll(".bet-launch-btn[data-bet-target]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-bet-target");
        if (!target) return;
        if (window.ERIBSBetReturn && typeof window.ERIBSBetReturn.goToBetting === "function") {
          window.ERIBSBetReturn.goToBetting(target);
        } else {
          window.location.href = target;
        }
      });
    });
  }

  function initBetPlacedWelcome() {
    if (!window.ERIBSBetReturn || !window.ERIBSBetReturn.consumeBetPlacedQuery()) return;
    try {
      var url = new URL(window.location.href);
      url.searchParams.delete("betPlaced");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    } catch (e) {}

    var path = window.location.pathname || "";
    var onDashboard = /user-profile\.html$/i.test(path);
    if (onDashboard) {
      showBetPlacedContinueBanner();
    } else {
      showToast("Bet placed. Welcome back to your profile.", "success");
    }
  }

  function showBetPlacedContinueBanner() {
    var main = $("profile-main");
    if (!main || document.getElementById("profile-bet-return-banner")) return;

    var banner = document.createElement("section");
    banner.id = "profile-bet-return-banner";
    banner.className = "profile-bet-return-banner";
    banner.setAttribute("role", "status");
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML =
      '<motion.div class="profile-bet-return-banner__inner">' +
      '<div class="profile-bet-return-banner__icon" aria-hidden="true"><i class="fas fa-circle-check"></i></div>' +
      '<div class="profile-bet-return-banner__body">' +
      "<h3 class=\"profile-bet-return-banner__title\">Bet placed successfully</h3>" +
      "<p class=\"profile-bet-return-banner__text\">You're back on your dashboard. Continue with deposits, bet history, or place another wager when you're ready.</p>" +
      '<div class="profile-bet-return-banner__actions">' +
      '<a href="my-bets.html" class="btn-glow btn-deposit profile-bet-return-banner__btn">My bets</a>' +
      '<a href="place-bets.html" class="btn-profile-secondary profile-bet-return-banner__btn">Place another bet</a>' +
      "</div>" +
      "</div>" +
      '<button type="button" class="profile-bet-return-banner__close" id="profile-bet-return-banner-close" aria-label="Dismiss">' +
      '<i class="fas fa-times" aria-hidden="true"></i>' +
      "</button>" +
      "</div>";

    banner.innerHTML = banner.innerHTML.replace(/motion\.div/g, "div");

    main.insertBefore(banner, main.firstChild);

    var closeBtn = $("profile-bet-return-banner-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        banner.remove();
      });
    }
  }

  function initPasswordChange() {
    var form = $("form-password-change");
    if (!form) return;

    var session = getSession();
    var username = session && String(session.username || "").trim();
    if (!username) return;

    var Auth = window.ERIBSAuthSession;
    var err = $("pw-change-error");
    var hint = $("password-change-hint");
    var curInput = $("pw-current");
    var newInput = $("pw-new");
    var confInput = $("pw-confirm");
    var submitBtn = $("btn-password-submit");

    var needCurrent = !!(Auth && Auth.hasPasswordCredential(username));

    function syncPasswordFormHints() {
      needCurrent = !!(Auth && Auth.hasPasswordCredential(username));
      if (curInput) {
        curInput.required = !!needCurrent;
      }
      if (hint) {
        hint.textContent = needCurrent
          ? "Enter your current password, then your new password (minimum 6 characters)."
          : "No password stored for this account in this browser yet. Set one below — the current password field is optional.";
      }
    }

    function showPwErr(msg) {
      if (!err) return;
      if (msg) {
        err.textContent = msg;
        err.hidden = false;
      } else {
        err.textContent = "";
        err.hidden = true;
      }
    }

    syncPasswordFormHints();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showPwErr("");
      if (!Auth || typeof Auth.changePassword !== "function") {
        showToast("Password service unavailable.", "info");
        return;
      }
      var oldPw = curInput ? curInput.value : "";
      var nw = newInput ? newInput.value : "";
      var cf = confInput ? confInput.value : "";
      if (needCurrent && !oldPw) {
        showPwErr("Please enter your current password.");
        if (curInput) curInput.focus();
        return;
      }
      if (!nw || String(nw).length < 6) {
        showPwErr("New password must be at least 6 characters.");
        if (newInput) newInput.focus();
        return;
      }
      if (nw !== cf) {
        showPwErr("New password and confirmation do not match.");
        if (confInput) confInput.focus();
        return;
      }
      if (submitBtn) submitBtn.disabled = true;
      Auth.changePassword(username, oldPw, nw).then(function (res) {
        if (submitBtn) submitBtn.disabled = false;
        if (!res || !res.ok) {
          showPwErr((res && res.message) || "Could not update password.");
          return;
        }
        showToast("Password updated successfully.", "success");
        form.reset();
        syncPasswordFormHints();
        populateUser(getSession() || session);
      });
    });
  }

  function initVoucherRedeem() {
    var form = $("form-voucher-redeem");
    if (!form) return;
    var input = $("voucher-code");
    var err = $("voucher-redeem-error");
    function showErr(msg) {
      if (!err) return;
      if (msg) {
        err.textContent = msg;
        err.hidden = false;
      } else {
        err.textContent = "";
        err.hidden = true;
      }
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showErr("");
      var code = input ? String(input.value || "").trim().toUpperCase() : "";
      if (!code || code.length < 4) {
        showErr("Enter a valid promo code (at least 4 characters).");
        if (input) input.focus();
        return;
      }
      showToast(
        "Code \"" + code + "\" will be validated when your promo API is connected.",
        "success",
      );
      form.reset();
    });
  }

  function initResponsibleGaming() {
    var buttons = document.querySelectorAll(".rg-action-btn");
    if (!buttons.length) return;
    var labels = {
      deposit: "Deposit limit setup opens when your compliance API is connected.",
      session: "Session and reality-check settings will load here post-integration.",
      exclude: "Self-exclusion flow will be handled by your responsible-gaming service.",
    };
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-rg") || "";
        showToast(labels[key] || "Responsible gaming tools coming soon.", "info");
      });
    });
  }

  function initProfilePageActions() {
    var save = $("btn-profile-save");
    if (save) {
      save.addEventListener("click", function () {
        showToast(
          "Profile updates will sync when your account API is connected.",
          "success",
        );
      });
    }
    var verify = $("btn-profile-verify");
    if (verify) {
      verify.addEventListener("click", function () {
        showToast(
          "KYC verification flow opens here once document upload is wired.",
          "info",
        );
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
