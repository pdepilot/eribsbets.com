/**
 * ERIBSBETS — return to profile after placing a bet from the account area.
 */
(function (global) {
  "use strict";

  var RETURN_KEY = "eribsbets_return_after_bet";
  var PENDING_KEY = "eribsbets_bet_placed_pending_return";
  var DEFAULT_RETURN = "user-profile.html";

  function safeGet(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSet(key, val) {
    try {
      if (val == null) sessionStorage.removeItem(key);
      else sessionStorage.setItem(key, val);
    } catch (e) {}
  }

  function getReturnUrl() {
    return safeGet(RETURN_KEY) || "";
  }

  function setReturnUrl(url) {
    safeSet(RETURN_KEY, url || DEFAULT_RETURN);
  }

  function clearReturnUrl() {
    safeSet(RETURN_KEY, null);
    safeSet(PENDING_KEY, null);
  }

  function hasReturnFlow() {
    return !!getReturnUrl();
  }

  function markBetPlacedForReturn() {
    if (!hasReturnFlow()) return;
    safeSet(PENDING_KEY, "1");
    enhanceBetModalButton();
  }

  function enhanceBetModalButton() {
    if (!hasReturnFlow()) return;
    var btn = document.getElementById("close-bet-modal-btn");
    if (btn) btn.textContent = "Continue to profile";
  }

  function redirectToProfileIfPending() {
    if (safeGet(PENDING_KEY) !== "1" || !hasReturnFlow()) return false;
    var base = getReturnUrl();
    clearReturnUrl();
    var dest =
      base.indexOf("?") >= 0 ? base + "&betPlaced=1" : base + "?betPlaced=1";
    global.location.href = dest;
    return true;
  }

  function goToBetting(targetUrl, returnUrl) {
    setReturnUrl(returnUrl || DEFAULT_RETURN);
    global.location.href = targetUrl;
  }

  function consumeBetPlacedQuery() {
    try {
      var p = new URLSearchParams(global.location.search);
      return p.get("betPlaced") === "1";
    } catch (e) {
      return false;
    }
  }

  function initFromQuery() {
    try {
      var p = new URLSearchParams(global.location.search);
      if (p.get("fromProfile") === "1") setReturnUrl(DEFAULT_RETURN);
    } catch (e) {}
  }

  function wireBetModalClose() {
    var btn = document.getElementById("close-bet-modal-btn");
    if (!btn || btn.dataset.eribsReturnWired) return;
    btn.dataset.eribsReturnWired = "1";
    btn.addEventListener("click", function () {
      window.setTimeout(function () {
        redirectToProfileIfPending();
      }, 80);
    });
  }

  global.ERIBSBetReturn = {
    RETURN_KEY: RETURN_KEY,
    DEFAULT_RETURN: DEFAULT_RETURN,
    getReturnUrl: getReturnUrl,
    setReturnUrl: setReturnUrl,
    clearReturnUrl: clearReturnUrl,
    hasReturnFlow: hasReturnFlow,
    goToBetting: goToBetting,
    markBetPlacedForReturn: markBetPlacedForReturn,
    redirectToProfileIfPending: redirectToProfileIfPending,
    enhanceBetModalButton: enhanceBetModalButton,
    consumeBetPlacedQuery: consumeBetPlacedQuery,
    initFromQuery: initFromQuery,
    wireBetModalClose: wireBetModalClose,
  };

  initFromQuery();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      enhanceBetModalButton();
      wireBetModalClose();
    });
  } else {
    enhanceBetModalButton();
    wireBetModalClose();
  }
})(typeof window !== "undefined" ? window : globalThis);
