(function () {
  const HISTORY_KEY = "eribsbets_history";
  const state = { selections: {}, stake: 100 };

  const themeBtn = document.getElementById("theme-btn");
  const megaBtn = document.getElementById("mega-menu-btn");
  const megaMenu = document.getElementById("mega-menu");
  const toast = document.getElementById("cat-toast");

  if (themeBtn) {
    const stored = localStorage.getItem("eribs-theme");
    if (stored === "light") {
      document.body.classList.add("light-theme");
      themeBtn.textContent = "☀️";
    }

    themeBtn.addEventListener("click", () => {
      const light = document.body.classList.toggle("light-theme");
      themeBtn.textContent = light ? "☀️" : "🌙";
      localStorage.setItem("eribs-theme", light ? "light" : "dark");
    });
  }

  if (megaBtn && megaMenu) {
    megaBtn.addEventListener("click", () => {
      const open = megaMenu.classList.toggle("open");
      megaBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", (event) => {
      if (!megaMenu.classList.contains("open")) return;
      if (megaBtn.contains(event.target) || megaMenu.contains(event.target)) return;
      megaMenu.classList.remove("open");
      megaBtn.setAttribute("aria-expanded", "false");
    });
  }

  document.querySelectorAll(".cat-chip-row").forEach((row) => {
    row.addEventListener("click", (event) => {
      const chip = event.target.closest(".cat-chip");
      if (!chip) return;
      row.querySelectorAll(".cat-chip").forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function slugify(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveHistory(entry) {
    const history = getHistory();
    history.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  }

  function formatMoney(value) {
    return `₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function calcTotals() {
    const selections = Object.values(state.selections);
    const totalOdds = selections.reduce((acc, item) => acc * item.price, selections.length ? 1 : 0);
    return { totalOdds, potential: totalOdds * state.stake, count: selections.length };
  }

  function updateCalculations() {
    const { totalOdds, potential } = calcTotals();
    const stakeDisplay = document.getElementById("stake-display");
    const totalOddsEl = document.getElementById("total-odds");
    const potentialEl = document.getElementById("potential-return");
    const stakeInput = document.getElementById("stake-input");
    const stakeSlider = document.getElementById("stake-slider");

    if (stakeDisplay) stakeDisplay.textContent = formatMoney(state.stake);
    if (totalOddsEl) totalOddsEl.textContent = totalOdds.toFixed(2);
    if (potentialEl) potentialEl.textContent = formatMoney(potential);
    if (stakeInput && document.activeElement !== stakeInput) stakeInput.value = String(state.stake);
    if (stakeSlider && document.activeElement !== stakeSlider) stakeSlider.value = String(state.stake);
  }

  function buildBetItems() {
    return Object.values(state.selections)
      .map(
        (item) => `
      <div class="bs-item">
        <div class="bs-item-hdr">
          <span class="bs-match">${item.matchName}</span>
          <button class="bs-remove" type="button" data-id="${item.id}" aria-label="Remove ${item.outcome}">×</button>
        </div>
        <div>
          <span class="bs-pick">${item.outcome}</span>
          <span class="bs-price">@ ${item.price.toFixed(2)}</span>
        </div>
      </div>`
      )
      .join("");
  }

  function updateBetslip() {
    const { count } = calcTotals();
    const hasItems = count > 0;
    const body = document.getElementById("bs-body");
    const footer = document.getElementById("bs-footer");
    const badge = document.getElementById("desktop-badge");

    if (badge) {
      badge.textContent = String(count);
      badge.classList.toggle("zero", count === 0);
    }

    if (body) {
      body.innerHTML = hasItems
        ? buildBetItems()
        : '<div class="empty-state"><div class="empty-icon">📋</div><p>Your betslip is empty</p><p class="hint">Select odds to add them here.</p></div>';
      body.querySelectorAll(".bs-remove").forEach((button) => {
        button.addEventListener("click", () => {
          delete state.selections[button.dataset.id];
          syncOddButtons();
          updateBetslip();
        });
      });
    }

    if (footer) footer.style.display = hasItems ? "block" : "none";
    updateCalculations();
  }

  function readOddButton(button) {
    const fixture = button.closest(".cat-fixture");
    const teams = fixture
      ? Array.from(fixture.querySelectorAll(".cat-teams span")).map((node) => node.textContent.trim())
      : [];
    const league = fixture?.querySelector(".cat-league-pill")?.textContent.trim() || "Market";
    const outcome = button.dataset.outcome || button.querySelector("small")?.textContent.trim() || "Pick";
    const price = parseFloat(button.dataset.price || button.textContent.replace(/[^\d.]/g, ""));
    const matchName = button.dataset.matchName || (teams.length >= 2 ? `${teams[0]} vs ${teams[1]}` : league);
    const id = button.dataset.matchId || slugify(`${league}-${matchName}`);

    return { id, matchName, outcome, price, league };
  }

  function syncOddButtons() {
    document.querySelectorAll(".cat-odd").forEach((button) => {
      const selection = readOddButton(button);
      const active = state.selections[selection.id];
      button.classList.toggle("selected", Boolean(active && active.outcome === selection.outcome));
    });
  }

  function handleOddClick(button) {
    const selection = readOddButton(button);
    if (!Number.isFinite(selection.price) || selection.price <= 1) return;

    const fixture = button.closest(".cat-fixture");
    const rowButtons = fixture ? fixture.querySelectorAll(".cat-odd") : [button];

    if (state.selections[selection.id]?.outcome === selection.outcome) {
      delete state.selections[selection.id];
      showToast(`Removed ${selection.matchName} — ${selection.outcome}`);
    } else {
      delete state.selections[selection.id];
      state.selections[selection.id] = selection;
      showToast(`Added ${selection.matchName} — ${selection.outcome} @ ${selection.price.toFixed(2)}`);
    }

    rowButtons.forEach((item) => item.classList.remove("selected"));
    syncOddButtons();
    updateBetslip();
  }

  function renderHistory() {
    const list = document.getElementById("history-list");
    if (!list) return;

    const history = getHistory();
    if (!history.length) {
      list.innerHTML =
        '<div class="empty-state"><div class="empty-icon">🗂️</div><p>No bets placed yet</p><p class="hint">Your recent slips will appear here.</p></div>';
      return;
    }

    list.innerHTML = history
      .map((entry) => {
        const picks = entry.selections
          .map(
            (pick) =>
              `<div class="history-sel"><span>${pick.matchName}</span><strong>${pick.outcome} @ ${Number(pick.price).toFixed(2)}</strong></div>`
          )
          .join("");
        const code = entry.bookingCode
          ? `<div class="history-code">Code: <strong>${entry.bookingCode}</strong></div>`
          : "";
        return `
      <div class="history-entry">
        <div class="history-entry-hdr">
          <span>${entry.date}</span>
          <span class="history-status">Placed</span>
        </div>
        ${picks}
        <div class="history-footer">
          <span>Stake ${formatMoney(entry.stake)}</span>
          <span class="history-return">${formatMoney(entry.totalOdds * entry.stake)}</span>
        </div>
        ${code}
      </div>`;
      })
      .join("");
  }

  function initTabs() {
    document.querySelectorAll(".bs-tab[data-tab]").forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;
        document.querySelectorAll(".bs-tab[data-tab]").forEach((item) => item.classList.remove("active"));
        tab.classList.add("active");
        const betslipPanel = document.getElementById("panel-betslip");
        const historyPanel = document.getElementById("panel-history");
        if (betslipPanel) betslipPanel.style.display = target === "betslip" ? "block" : "none";
        if (historyPanel) historyPanel.style.display = target === "history" ? "block" : "none";
        if (target === "history") renderHistory();
      });
    });
  }

  function openModal(id) {
    document.getElementById(id)?.classList.add("open");
  }

  function closeModal(id) {
    document.getElementById(id)?.classList.remove("open");
  }

  function showBetReceipt(selections, totalOdds, bookingCode) {
    const potential = totalOdds * state.stake;
    const details = document.getElementById("bet-details-content");
    const codeEl = document.getElementById("booking-code-val");

    if (codeEl) codeEl.textContent = bookingCode;
    if (details) {
      details.innerHTML = `
        ${selections
          .map(
            (item) =>
              `<div class="detail-line"><span>${item.matchName}</span><span>${item.outcome} @ <strong>${item.price.toFixed(2)}</strong></span></div>`
          )
          .join("")}
        <div class="detail-line" style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
          <span>Stake</span><span><strong>${formatMoney(state.stake)}</strong></span>
        </div>
        <div class="detail-line"><span>Total Odds</span><span><strong>${totalOdds.toFixed(2)}</strong></span></div>
        <div class="detail-line"><span>Potential Return</span><span style="color:var(--accent)"><strong>${formatMoney(potential)}</strong></span></div>`;
    }

    openModal("bet-modal");
  }

  function initReceiptModal() {
    document.getElementById("close-bet-modal-btn")?.addEventListener("click", () => closeModal("bet-modal"));
    document.getElementById("bet-modal")?.addEventListener("click", (event) => {
      if (event.target.id === "bet-modal") closeModal("bet-modal");
    });
    document.getElementById("copy-code-btn")?.addEventListener("click", () => {
      const code = document.getElementById("booking-code-val")?.textContent?.trim();
      if (!code) return;
      navigator.clipboard
        .writeText(code)
        .then(() => showToast(`Copied: ${code}`))
        .catch(() => showToast("Could not copy booking code."));
    });
  }

  function initStakeControls() {
    const stakeInput = document.getElementById("stake-input");
    const stakeSlider = document.getElementById("stake-slider");

    document.querySelectorAll(".preset-btn[data-stake]").forEach((button) => {
      button.addEventListener("click", () => {
        state.stake = Number(button.dataset.stake) || 100;
        updateCalculations();
      });
    });

    stakeInput?.addEventListener("input", () => {
      const value = Number(stakeInput.value);
      state.stake = Number.isFinite(value) && value >= 100 ? value : 100;
      updateCalculations();
    });

    stakeSlider?.addEventListener("input", () => {
      state.stake = Number(stakeSlider.value) || 100;
      updateCalculations();
    });
  }

  function placeBet() {
    const selections = Object.values(state.selections);
    if (!selections.length) {
      showToast("Add at least one selection to place a bet.");
      return;
    }
    if (state.stake < 100) {
      showToast("Minimum stake is ₦100.");
      return;
    }

    const totalOdds = selections.reduce((acc, item) => acc * item.price, 1);
    const bookingCode = `ER-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    saveHistory({
      id: Date.now(),
      date: new Date().toLocaleString("en-NG"),
      stake: state.stake,
      totalOdds,
      bookingCode,
      selections: selections.map((item) => ({
        matchName: item.matchName,
        outcome: item.outcome,
        price: item.price,
      })),
    });

    const placedSelections = selections.map((item) => ({ ...item }));
    state.selections = {};
    syncOddButtons();
    updateBetslip();
    renderHistory();
    showBetReceipt(placedSelections, totalOdds, bookingCode);
    showToast(`Bet placed successfully. Booking code ${bookingCode}.`);
    if (window.ERIBSBetReturn) {
      window.ERIBSBetReturn.markBetPlacedForReturn();
    }
  }

  document.getElementById("place-bet-btn")?.addEventListener("click", placeBet);
  document.getElementById("clear-history-btn")?.addEventListener("click", () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
    showToast("Bet history cleared.");
  });

  document.querySelectorAll(".cat-odd").forEach((button) => {
    button.addEventListener("click", () => handleOddClick(button));
  });

  document.querySelectorAll(".cat-play, .cat-promo-cta").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("Launching experience — sign in to play.");
    });
  });

  initTabs();
  initStakeControls();
  initReceiptModal();
  updateBetslip();
  renderHistory();
})();
