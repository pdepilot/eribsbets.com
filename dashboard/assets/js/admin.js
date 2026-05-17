/**
 * ERIBSBETS Admin Dashboard — frontend-only interactions
 */
(function () {
  "use strict";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function showToast(message, variant) {
    var root = $("#admin-toast-root");
    if (!root) return;
    var el = document.createElement("div");
    el.textContent = message;
    el.className = "admin-toast " + (variant || "");
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
      }, 350);
    }, 3200);
  }

  function animateCounters() {
    $$("[data-count-to]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count-to")) || 0;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var duration = 1400;
      var start = 0;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var p = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = start + (target - start) * eased;
        el.textContent =
          prefix +
          val.toLocaleString("en-NG", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }) +
          suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  function initSidebar() {
    var collapseBtn = $("#sidebar-collapse-btn");
    var menuBtn = $("#mobile-menu-btn");
    var overlay = $("#sidebar-overlay");

    if (collapseBtn) {
      collapseBtn.addEventListener("click", function () {
        document.body.classList.toggle("sidebar-collapsed");
      });
    }
    if (menuBtn) {
      menuBtn.addEventListener("click", function () {
        document.body.classList.toggle("mobile-nav-open");
      });
    }
    if (overlay) {
      overlay.addEventListener("click", function () {
        document.body.classList.remove("mobile-nav-open");
      });
    }
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) {
        document.body.classList.remove("mobile-nav-open");
      }
    });
  }

  function initDropdowns() {
    $$("[data-dropdown]").forEach(function (wrap) {
      var btn = wrap.querySelector("[data-dropdown-trigger]");
      var panel = wrap.querySelector(".admin-dropdown");
      if (!btn || !panel) return;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = panel.classList.contains("is-open");
        $$(".admin-dropdown.is-open").forEach(function (d) {
          d.classList.remove("is-open");
        });
        if (!open) panel.classList.add("is-open");
      });
    });
    document.addEventListener("click", function () {
      $$(".admin-dropdown.is-open").forEach(function (d) {
        d.classList.remove("is-open");
      });
    });
  }

  function initModals() {
    $$("[data-modal-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-modal-open");
        var backdrop = document.getElementById(id);
        if (backdrop) backdrop.classList.add("is-open");
      });
    });
    $$("[data-modal-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var backdrop = btn.closest(".admin-modal-backdrop");
        if (backdrop) backdrop.classList.remove("is-open");
      });
    });
    $$(".admin-modal-backdrop").forEach(function (backdrop) {
      backdrop.addEventListener("click", function (e) {
        if (e.target === backdrop) backdrop.classList.remove("is-open");
      });
    });
  }

  function initTabs() {
    $$("[data-tabs]").forEach(function (root) {
      var tabs = root.querySelectorAll("[data-tab]");
      var panels = root.querySelectorAll("[data-tab-panel]");
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var name = tab.getAttribute("data-tab");
          tabs.forEach(function (t) {
            t.classList.toggle("is-active", t === tab);
          });
          panels.forEach(function (p) {
            p.hidden = p.getAttribute("data-tab-panel") !== name;
          });
        });
      });
    });
  }

  function initTableActions() {
    $$("[data-demo-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-demo-action");
        if (action === "delete") {
          var backdrop = $("#confirm-modal");
          if (backdrop) backdrop.classList.add("is-open");
        } else {
          showToast("Demo: " + (action || "action") + " — connect API later.", "success");
        }
      });
    });
    var confirmBtn = $("#confirm-delete-btn");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", function () {
        $("#confirm-modal")?.classList.remove("is-open");
        showToast("Record removed (frontend demo).", "success");
      });
    }
  }

  function initSearchDemo() {
    var input = $("#global-search");
    if (!input) return;
    var timer;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (input.value.trim().length > 2) {
          showToast('Searching for "' + input.value.trim() + '" (demo)', "");
        }
      }, 500);
    });
  }

  function initSkeletonDemo() {
    var btn = $("#toggle-skeleton-demo");
    if (!btn) return;
    btn.addEventListener("click", function () {
      $$(".admin-skeleton-target").forEach(function (el) {
        el.classList.toggle("is-loading");
      });
      showToast("Skeleton state toggled (demo).", "");
    });
  }

  function initLogout() {
    $$("[data-admin-logout]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        if (
          window.ERIBSAdminAuth &&
          typeof window.ERIBSAdminAuth.logout === "function"
        ) {
          window.ERIBSAdminAuth.logout();
        }
      });
    });
  }

  function boot() {
    initSidebar();
    initDropdowns();
    initModals();
    initTabs();
    initTableActions();
    initSearchDemo();
    initSkeletonDemo();
    initLogout();
    animateCounters();
    document.body.classList.add("admin-ready");
  }

  window.AdminUI = { showToast: showToast };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
