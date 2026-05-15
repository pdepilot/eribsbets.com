/* ============================================================
   ERIBSBETS — LIVE.JS
   Real-time simulation layer · WebSocket-ready architecture
   ============================================================ */
(function () {
  "use strict";

  /* ──────────────────────────────────────────────
     STATE
  ────────────────────────────────────────────── */
  const State = {
    selections:    {},
    stake:         100,
    sport:         "all",
    favorites:     new Set(JSON.parse(localStorage.getItem("live_favs") || "[]")),
    user:          { loggedIn: false, balance: 50000 },
    refreshActive: true,
    lastRefresh:   Date.now(),
  };

  /* ──────────────────────────────────────────────
     LIVE MATCH DATA STORE
     Structure mirrors what a WebSocket payload would send
  ────────────────────────────────────────────── */
  const LiveMatches = [
    {
      id: "lv1", sport: "football",
      league: "Premier League", country: "🏴",
      home: "Arsenal", away: "Chelsea",
      score: [2, 1], minute: 58, halfTime: false, trending: true,
      odds: { h: 1.75, d: 3.40, a: 4.80 },
      events: [
        { type: "goal",   time: 23, team: "home", player: "Saka" },
        { type: "yellow", time: 41, team: "away", player: "Gallagher" },
        { type: "goal",   time: 55, team: "home", player: "Martinelli" },
        { type: "goal",   time: 57, team: "away", player: "Palmer" },
      ],
      stats: { possession: [58, 42], shots: [8, 5], shotsOnTarget: [4, 2], corners: [5, 3] },
      extraMarkets: [
        { name: "Both Teams Score", odds: ["1.55", "2.30"] },
        { name: "Over/Under 2.5",   odds: ["1.40", "2.80"] },
        { name: "Double Chance",    odds: ["1.18", "1.35", "2.10"] },
        { name: "Asian Handicap",   odds: ["1.88 (-0.5)", "1.92 (+0.5)"] },
      ],
    },
    {
      id: "lv2", sport: "football",
      league: "Bundesliga", country: "🇩🇪",
      home: "Bayern Munich", away: "Dortmund",
      score: [3, 1], minute: 72, halfTime: false, trending: false,
      odds: { h: 1.32, d: 5.50, a: 8.00 },
      events: [
        { type: "goal",   time: 12, team: "home", player: "Kane" },
        { type: "goal",   time: 29, team: "away", player: "Fullkrug" },
        { type: "goal",   time: 45, team: "home", player: "Müller" },
        { type: "red",    time: 62, team: "away", player: "Emre Can" },
        { type: "goal",   time: 68, team: "home", player: "Kane" },
      ],
      stats: { possession: [65, 35], shots: [14, 4], shotsOnTarget: [7, 2], corners: [9, 1] },
      extraMarkets: [
        { name: "Both Teams Score", odds: ["1.65", "2.10"] },
        { name: "Over/Under 3.5",   odds: ["1.55", "2.35"] },
        { name: "Next Goal",        odds: ["1.50 Home", "4.50 Away"] },
      ],
    },
    {
      id: "lv3", sport: "football",
      league: "La Liga", country: "🇪🇸",
      home: "Real Madrid", away: "Barcelona",
      score: [1, 1], minute: "HT", halfTime: true, trending: true,
      odds: { h: 2.20, d: 3.20, a: 3.10 },
      events: [
        { type: "goal",   time: 18, team: "home", player: "Vinícius Jr" },
        { type: "yellow", time: 33, team: "home", player: "Camavinga" },
        { type: "goal",   time: 44, team: "away", player: "Lewandowski" },
      ],
      stats: { possession: [48, 52], shots: [6, 7], shotsOnTarget: [3, 3], corners: [4, 5] },
      extraMarkets: [
        { name: "2nd Half Winner",  odds: ["2.30", "3.00", "2.80"] },
        { name: "Both Teams Score", odds: ["1.45", "2.60"] },
        { name: "Total Goals",      odds: ["2.5+: 1.80", "3.5+: 3.20"] },
      ],
    },
    {
      id: "lv4", sport: "football",
      league: "Champions League", country: "🌍",
      home: "PSG", away: "Man City",
      score: [0, 0], minute: 15, halfTime: false, trending: false,
      odds: { h: 2.80, d: 3.30, a: 2.55 },
      events: [],
      stats: { possession: [44, 56], shots: [2, 3], shotsOnTarget: [0, 1], corners: [1, 2] },
      extraMarkets: [
        { name: "Both Teams Score", odds: ["1.60", "2.25"] },
        { name: "Over/Under 2.5",   odds: ["1.90", "1.90"] },
        { name: "First Goal",       odds: ["2.75 Home", "2.55 Away", "8.00 No Goal"] },
      ],
    },
    {
      id: "lv5", sport: "basketball",
      league: "NBA", country: "🇺🇸",
      home: "LA Lakers", away: "Golden State",
      score: [68, 72], minute: "Q3 4:22", halfTime: false, trending: true,
      odds: { h: 2.10, d: null, a: 1.75 },
      events: [],
      stats: { possession: [48, 52], shots: [0, 0], shotsOnTarget: [0, 0], corners: [0, 0] },
      extraMarkets: [
        { name: "Total Points",     odds: ["O 215.5: 1.90", "U 215.5: 1.90"] },
        { name: "Q4 Winner",        odds: ["Lakers: 2.00", "GS: 1.85"] },
      ],
    },
    {
      id: "lv6", sport: "tennis",
      league: "Roland Garros", country: "🇫🇷",
      home: "Alcaraz", away: "Djokovic",
      score: [1, 0], minute: "Set 2 · 4-3", halfTime: false, trending: false,
      odds: { h: 1.65, d: null, a: 2.20 },
      events: [],
      stats: { possession: [52, 48], shots: [18, 15], shotsOnTarget: [9, 7], corners: [0, 0] },
      extraMarkets: [
        { name: "Total Sets",       odds: ["3 Sets: 2.10", "4 Sets: 2.40", "5 Sets: 3.50"] },
        { name: "Next Set",         odds: ["Alcaraz: 1.70", "Djokovic: 2.10"] },
      ],
    },
    {
      id: "lv7", sport: "football",
      league: "Serie A", country: "🇮🇹",
      home: "AC Milan", away: "Inter Milan",
      score: [0, 1], minute: 35, halfTime: false, trending: false,
      odds: { h: 3.10, d: 3.20, a: 2.30 },
      events: [
        { type: "goal",   time: 22, team: "away", player: "Lautaro" },
        { type: "yellow", time: 30, team: "home", player: "Theo H." },
      ],
      stats: { possession: [42, 58], shots: [4, 7], shotsOnTarget: [1, 4], corners: [2, 5] },
      extraMarkets: [
        { name: "Both Teams Score", odds: ["2.10", "1.72"] },
        { name: "AC Milan to score", odds: ["1.85", "2.00"] },
      ],
    },
  ];

  /* Quick lookup map */
  const matchMap = {};
  LiveMatches.forEach(m => matchMap[m.id] = m);

  /* ──────────────────────────────────────────────
     UTILITY
  ────────────────────────────────────────────── */
  function showToast(msg, type = "info") {
    const cont = document.getElementById("toast-container");
    if (!cont) return;
    const t = document.createElement("div");
    t.className = `toast toast-${type}`;
    t.setAttribute("role", "status");
    t.textContent = msg;
    cont.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("show")));
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  function formatMinute(m) {
    if (typeof m === "string") return m;
    return m + "'";
  }

  function eventIcon(type) {
    const icons = { goal: "⚽", yellow: "🟨", red: "🟥" };
    return icons[type] || "•";
  }

  function outcomeLabel(sport, idx) {
    if (sport === "basketball" || sport === "tennis") {
      return ["1", "2"][idx];
    }
    return ["1", "X", "2"][idx];
  }

  function saveFavorites() {
    localStorage.setItem("live_favs", JSON.stringify([...State.favorites]));
  }

  /* ──────────────────────────────────────────────
     RENDER HELPERS
  ────────────────────────────────────────────── */
  function renderEventsStrip(events) {
    if (!events || !events.length) return "";
    return `<div class="lc-events" aria-label="Match events">
      ${events.map(e => `
        <span class="lc-event-tag ${e.type}" title="${e.player} · ${e.time}'">
          ${eventIcon(e.type)} ${e.player} ${e.time}'
        </span>`).join("")}
    </div>`;
  }

  function renderOdds(match) {
    const sport = match.sport;
    const keys  = sport === "basketball" || sport === "tennis" ? ["h", "a"] : ["h", "d", "a"];
    const labels = sport === "basketball" || sport === "tennis" ? ["1", "2"] : ["1", "X", "2"];

    return keys.map((k, i) => {
      if (match.odds[k] === null) return "";
      const sel = State.selections[match.id];
      const isSelected = sel && sel.outcome === labels[i];
      return `<button
        class="odd-btn${isSelected ? " selected" : ""}"
        type="button"
        data-id="${match.id}"
        data-key="${k}"
        data-outcome="${labels[i]}"
        data-price="${match.odds[k]}"
        aria-label="${match.home} vs ${match.away} — ${labels[i]} @ ${match.odds[k]}"
        aria-pressed="${isSelected}"
      >
        <span class="odd-label">${labels[i]}</span>
        <span class="odd-value">${match.odds[k].toFixed(2)}</span>
      </button>`;
    }).join("");
  }

  function parseDisplayOdd(str) {
    const s = String(str);
    if (s.includes(":")) {
      const tail = s.split(":").pop() || s;
      const m = tail.match(/[\d]+(?:\.\d+)?/g);
      if (m && m.length) return parseFloat(m[m.length - 1]);
    }
    const m = s.match(/[\d]+(?:\.\d+)?/);
    return m ? parseFloat(m[0]) : NaN;
  }

  function renderExpandedContent(match) {
    const s = match.stats;

    const marketsHtml = match.extraMarkets.map(mkt => {
      const oddsHtml = mkt.odds.map((o, i) => {
        const price = parseDisplayOdd(o);
        const label = o.includes(":") ? o.split(":")[0].trim() : (i === 0 ? "Opt A" : "Opt B");
        const display = o.includes(":") ? o.split(":").slice(1).join(":").trim() : o;
        const safePrice = !Number.isNaN(price) ? price : 1.5;
        return `<button type="button" class="odd-btn exp-odd-btn" data-id="${match.id}" data-outcome="${mkt.name}: ${label}" data-price="${safePrice}" style="font-size:11px;height:36px">
          <span class="odd-label">${label}</span>
          <span class="odd-value">${display}</span>
        </button>`;
      }).join("");
      return `<div class="exp-market-row">
        <div class="exp-market-label">${mkt.name}</div>
        <div class="exp-market-odds">${oddsHtml}</div>
      </div>`;
    }).join("");

    const statsRows = [
      { label: "Possession", home: s.possession[0], away: s.possession[1], unit: "%" },
      { label: "Shots",      home: s.shots[0],      away: s.shots[1],      unit: "" },
      { label: "On Target",  home: s.shotsOnTarget[0], away: s.shotsOnTarget[1], unit: "" },
      { label: "Corners",    home: s.corners[0],    away: s.corners[1],    unit: "" },
    ].filter(r => match.sport !== "tennis" || r.label !== "Corners");

    const statsHtml = statsRows.map(r => {
      const total = r.home + r.away || 1;
      const hp    = Math.round((r.home / total) * 100);
      const ap    = 100 - hp;
      return `<div class="stat-row">
        <span class="stat-home">${r.home}${r.unit}</span>
        <div class="stat-bar">
          <div class="sb-home" style="width:${hp}%"></div>
          <div class="sb-away" style="width:${ap}%"></div>
        </div>
        <span class="stat-label">${r.label}</span>
        <span class="stat-away">${r.away}${r.unit}</span>
      </div>`;
    }).join("");

    return `<div class="lc-exp-inner">
      <div class="exp-markets-title">More Markets</div>
      <div class="exp-markets-grid">${marketsHtml}</div>
      <div class="exp-stats-title">Match Stats</div>
      ${statsHtml}
    </div>`;
  }

  function buildMatchCard(match) {
    const isFav = State.favorites.has(match.id);

    const timeDisplay = match.halfTime
      ? `<span class="lc-minute">HT</span><span class="lc-ht-label">Half time</span>`
      : `<span class="lc-minute" id="min-${match.id}">${formatMinute(match.minute)}</span>
         <span class="lc-ht-label">LIVE</span>`;

    const trendBadge = match.trending
      ? `<span class="lc-trending-badge">🔥 HOT</span>` : "";

    return `
    <article
      class="live-card${match.trending ? " trending-card" : ""}"
      data-id="${match.id}"
      data-sport="${match.sport}"
      role="region"
      aria-label="${match.home} vs ${match.away} — Live"
    >
      <div class="lc-header">
        <div class="lc-league">
          <span>${match.country}</span>
          <span>${match.league}</span>
        </div>
        <div class="lc-header-right">
          ${trendBadge}
          <span class="lc-live-badge"><span class="lc-live-dot"></span>LIVE</span>
          <button
            type="button"
            class="lc-fav-btn${isFav ? " active" : ""}"
            data-fav="${match.id}"
            aria-label="${isFav ? "Remove from" : "Add to"} favourites"
            title="Favourite"
          >${isFav ? "⭐" : "☆"}</button>
        </div>
      </div>

      <div class="lc-body">
        <div class="lc-teams">
          <div class="lc-team-row">
            <span class="lc-team-name">${match.home}</span>
            <div class="lc-score" id="score-h-${match.id}">${match.score[0]}</div>
          </div>
          <div class="lc-team-row">
            <span class="lc-team-name">${match.away}</span>
            <div class="lc-score" id="score-a-${match.id}">${match.score[1]}</div>
          </div>
        </div>
        <div class="lc-time-col">${timeDisplay}</div>
        <div class="lc-odds-col" id="odds-${match.id}">
          ${renderOdds(match)}
        </div>
      </div>

      ${renderEventsStrip(match.events)}

      <div class="lc-footer">
        <span style="font-size:11px;color:var(--text-3)">${match.extraMarkets.length + 1} markets</span>
        <button type="button" class="lc-more-btn" data-expand="${match.id}" aria-expanded="false">
          More Markets →
        </button>
      </div>

      <div class="lc-expanded" id="exp-${match.id}" aria-hidden="true"></div>
    </article>`;
  }

  /* Re-renders odds col only (avoids full card redraw) */
  function patchOddsCol(match) {
    const col = document.getElementById(`odds-${match.id}`);
    if (!col) return;
    col.innerHTML = renderOdds(match);
    col.querySelectorAll(".odd-btn").forEach(b => b.addEventListener("click", handleOddClick));
  }

  function patchScore(match, side) {
    const el = document.getElementById(`score-${side}-${match.id}`);
    if (!el) return;
    el.textContent = match.score[side === "h" ? 0 : 1];
    el.classList.add("just-scored");
    setTimeout(() => el.classList.remove("just-scored"), 600);
  }

  function patchMinute(match) {
    const el = document.getElementById(`min-${match.id}`);
    if (el && !match.halfTime) el.textContent = formatMinute(match.minute);
  }

  /* ──────────────────────────────────────────────
     MAIN RENDER
  ────────────────────────────────────────────── */
  function getFilteredMatches() {
    return LiveMatches.filter(m => {
      if (State.sport === "favorites") return State.favorites.has(m.id);
      if (State.sport !== "all" && m.sport !== State.sport) return false;
      return true;
    });
  }

  function syncLiveCounts() {
    const counts = { all: 0, football: 0, basketball: 0, tennis: 0, favorites: 0, trending: 0 };
    LiveMatches.forEach(m => {
      counts.all++;
      if (counts[m.sport] !== undefined) counts[m.sport]++;
      if (m.trending) counts.trending++;
      if (State.favorites.has(m.id)) counts.favorites++;
    });

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val);
    };

    setText("chip-all", counts.all);
    setText("chip-football", counts.football);
    setText("chip-basketball", counts.basketball);
    setText("chip-tennis", counts.tennis);
    setText("chip-favs", counts.favorites);

    setText("ct-football", counts.football);
    setText("ct-basketball", counts.basketball);
    setText("ct-tennis", counts.tennis);

    setText("lst-trending", counts.trending);
    setText("lst-total", counts.all);
    setText("lst-favs", counts.favorites);
  }

  function renderMatchList() {
    const section = document.getElementById("live-matches-section");
    if (!section) return;

    syncLiveCounts();
    const matches = getFilteredMatches();
    if (!matches.length) {
      section.innerHTML = `
        <div class="no-matches">
          <div class="nm-icon">📡</div>
          <h3>No live matches</h3>
          <p>${State.sport === "favorites" ? "You haven't starred any matches yet." : "Check back soon for live action."}</p>
        </div>`;
      return;
    }

    section.innerHTML = matches.map(buildMatchCard).join("");

    /* Attach events after render */
    section.querySelectorAll(".odd-btn").forEach(b => b.addEventListener("click", handleOddClick));
    section.querySelectorAll(".lc-more-btn").forEach(b => b.addEventListener("click", handleExpand));
    section.querySelectorAll(".lc-fav-btn").forEach(b => b.addEventListener("click", handleFav));
  }

  function renderSkeletons(n = 3) {
    const section = document.getElementById("live-matches-section");
    if (!section) return;
    section.innerHTML = Array.from({ length: n }).map(() => `
      <div class="skeleton-live-card">
        <div class="sk-line" style="width:40%;height:12px;margin-bottom:12px"></div>
        <div style="display:flex;gap:10px;margin-bottom:12px">
          <div class="sk-line" style="flex:1;height:16px"></div>
          <div class="sk-line" style="width:30px;height:16px"></div>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:10px">
          <div class="sk-line" style="flex:1;height:16px"></div>
          <div class="sk-line" style="width:30px;height:16px"></div>
        </div>
        <div style="display:flex;gap:6px">
          <div class="sk-line" style="flex:1;height:44px;border-radius:10px"></div>
          <div class="sk-line" style="flex:1;height:44px;border-radius:10px"></div>
          <div class="sk-line" style="flex:1;height:44px;border-radius:10px"></div>
        </div>
      </div>`).join("");
  }

  /* ──────────────────────────────────────────────
     EVENT HANDLERS
  ────────────────────────────────────────────── */
  function handleOddClick(e) {
    const btn     = e.currentTarget;
    const id      = btn.dataset.id;
    const outcome = btn.dataset.outcome;
    const price   = parseFloat(btn.dataset.price);
    const match   = matchMap[id];
    if (!match) return;

    const matchName = `${match.league}: ${match.home} vs ${match.away}`;

    if (State.selections[id] && State.selections[id].outcome === outcome) {
      delete State.selections[id];
      showToast(`Removed — ${outcome}`, "info");
    } else {
      State.selections[id] = { id, matchName, outcome, price };
      showToast(`Added — ${outcome} @ ${price.toFixed(2)}`, "success");
      btn.style.transform = "scale(0.93)";
      setTimeout(() => (btn.style.transform = ""), 150);
      showQuickBetToast(matchName, outcome, price);
    }
    updateBetslip();
    patchOddsCol(match);
  }

  function handleExpand(e) {
    const btn = e.currentTarget;
    const id  = btn.dataset.expand;
    const exp = document.getElementById(`exp-${id}`);
    if (!exp) return;

    const isOpen = exp.classList.contains("open");

    /* Close all first */
    document.querySelectorAll(".lc-expanded.open").forEach(el => {
      el.classList.remove("open");
      el.setAttribute("aria-hidden", "true");
    });
    document.querySelectorAll(".lc-more-btn").forEach(b => {
      b.textContent = "More Markets →";
      b.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      if (!exp.innerHTML.trim()) {
        exp.innerHTML = renderExpandedContent(matchMap[id]);
        exp.querySelectorAll(".exp-odd-btn").forEach(b => b.addEventListener("click", handleOddClick));
      }
      exp.classList.add("open");
      exp.setAttribute("aria-hidden", "false");
      btn.textContent = "Less ↑";
      btn.setAttribute("aria-expanded", "true");
    }
  }

  function handleFav(e) {
    const btn = e.currentTarget;
    const id  = btn.dataset.fav;
    if (State.favorites.has(id)) {
      State.favorites.delete(id);
      btn.textContent = "☆";
      btn.classList.remove("active");
      btn.setAttribute("aria-label", "Add to favourites");
      showToast("Removed from favourites", "info");
    } else {
      State.favorites.add(id);
      btn.textContent = "⭐";
      btn.classList.add("active");
      btn.setAttribute("aria-label", "Remove from favourites");
      showToast("Added to favourites ⭐", "success");
    }
    saveFavorites();
    syncLiveCounts();
    /* If current filter is favorites, re-render */
    if (State.sport === "favorites") renderMatchList();
  }

  /* Quick Bet Toast */
  const qbtEl    = document.getElementById("quick-bet-toast");
  let qbtTimeout = null;

  function showQuickBetToast(match, outcome, price) {
    if (!qbtEl) return;
    const text = qbtEl.querySelector(".qbt-text");
    if (text) text.innerHTML = `<strong>${outcome}</strong> @ ${price.toFixed(2)} — ${match}`;
    qbtEl.classList.add("show");
    clearTimeout(qbtTimeout);
    qbtTimeout = setTimeout(() => qbtEl.classList.remove("show"), 3200);
  }

  qbtEl?.querySelector(".qbt-close")?.addEventListener("click", () => {
    qbtEl.classList.remove("show");
    clearTimeout(qbtTimeout);
  });

  /* ──────────────────────────────────────────────
     BETSLIP
  ────────────────────────────────────────────── */
  function calcOdds() {
    const sels    = Object.values(State.selections);
    const total   = sels.length ? sels.reduce((a, s) => a * s.price, 1) : 0;
    const ret     = total * State.stake;
    const fmt     = n => n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    ["total-odds",    "mob-total-odds"]   .forEach(id => { const el = document.getElementById(id); if (el) el.textContent = total.toFixed(2); });
    ["potential-return","mob-potential-return"].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = "₦" + fmt(ret); });
  }

  function setStake(value) {
    const v = Math.max(0, Math.min(10_000_000, parseInt(value, 10) || 0));
    State.stake = v;
    const display = "₦" + v.toLocaleString("en-NG");
    ["stake-display","mob-stake-display"].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = display; });
    const si = document.getElementById("stake-input");  if (si) si.value = v;
    const capped = Math.min(v, 100000);
    ["stake-slider", "mob-stake-slider"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = String(capped);
    });
    calcOdds();
  }

  function buildBetItems(removeCls) {
    return Object.values(State.selections).map(s => `
      <div class="bs-item">
        <div class="bs-item-hdr">
          <span class="bs-match">${s.matchName}</span>
          <button class="${removeCls}" data-id="${s.id}" aria-label="Remove ${s.outcome}">×</button>
        </div>
        <div><span class="bs-pick">${s.outcome}</span><span class="bs-price">@ ${s.price.toFixed(2)}</span></div>
      </div>`).join("");
  }

  function updateBetslip() {
    const count    = Object.keys(State.selections).length;
    const hasItems = count > 0;

    const setBadge = (id, n) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = n;
      el.classList.toggle("zero", n === 0);
    };
    setBadge("desktop-badge", count);
    setBadge("mob-drawer-badge", count);

    const mb = document.getElementById("mob-badge");
    if (mb) { mb.style.display = hasItems ? "block" : "none"; mb.textContent = count; }

    /* Desktop betslip */
    const body   = document.getElementById("bs-body");
    const footer = document.getElementById("bs-footer");
    if (body) {
      body.innerHTML = hasItems
        ? buildBetItems("bs-remove")
        : `<div class="empty-state"><div class="empty-icon">📋</div><p>Your betslip is empty</p><p class="hint">Select odds to add them here.</p></div>`;
      if (footer) footer.style.display = hasItems ? "block" : "none";
      body.querySelectorAll(".bs-remove").forEach(btn => btn.addEventListener("click", () => {
        delete State.selections[btn.dataset.id];
        const m = matchMap[btn.dataset.id];
        if (m) patchOddsCol(m);
        updateBetslip();
      }));
    }

    /* Mobile drawer */
    const dBody   = document.getElementById("drawer-body");
    const dFooter = document.getElementById("drawer-footer");
    if (dBody) {
      dBody.innerHTML = hasItems
        ? buildBetItems("mob-bs-remove")
        : `<div class="empty-state"><div class="empty-icon">📋</div><p>Your betslip is empty</p><p class="hint">Tap odds to add selections.</p></div>`;
      if (dFooter) dFooter.style.display = hasItems ? "block" : "none";
      dBody.querySelectorAll(".mob-bs-remove").forEach(btn => btn.addEventListener("click", () => {
        delete State.selections[btn.dataset.id];
        const m = matchMap[btn.dataset.id];
        if (m) patchOddsCol(m);
        updateBetslip();
      }));
    }
    calcOdds();
  }

  function placeBet() {
    const sels = Object.values(State.selections);
    if (!sels.length)          return showToast("Add at least one selection", "error");
    if (State.stake < 100)     return showToast("Minimum stake is ₦100", "error");

    const total     = sels.reduce((a, s) => a * s.price, 1);
    const potential = total * State.stake;
    const code      = "ER-" + Math.random().toString(36).substr(2, 6).toUpperCase();

    /* Save history */
    const hist = getHistory();
    hist.unshift({ id: Date.now(), date: new Date().toLocaleString("en-NG"), stake: State.stake, totalOdds: total, bookingCode: code, selections: sels.map(s => ({ matchName: s.matchName, outcome: s.outcome, price: s.price })) });
    localStorage.setItem("eribsbets_history", JSON.stringify(hist.slice(0, 50)));

    /* Clear selections */
    const placed = { ...State.selections };
    State.selections = {};
    updateBetslip();
    Object.keys(placed).forEach(id => { const m = matchMap[id]; if (m) patchOddsCol(m); });
    closeDrawer();

    showToast(`✅ Bet Placed! Code: ${code} · Potential: ₦${potential.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`, "success");
    if (window.ERIBSBetReturn) {
      window.ERIBSBetReturn.markBetPlacedForReturn();
      window.setTimeout(function () {
        window.ERIBSBetReturn.redirectToProfileIfPending();
      }, 2400);
    }
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem("eribsbets_history") || "[]"); }
    catch { return []; }
  }

  /* ──────────────────────────────────────────────
     SPORT FILTER CHIPS
  ────────────────────────────────────────────── */
  function initFilterChips() {
    document.querySelectorAll(".lf-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".lf-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        State.sport = chip.dataset.sport;
        renderMatchList();
      });
    });
  }

  /* ──────────────────────────────────────────────
     AUTO-REFRESH CONTROLS
  ────────────────────────────────────────────── */
  function initRefreshBar() {
    const bar    = document.getElementById("refresh-bar");
    const toggle = document.getElementById("rf-toggle");
    const label  = document.getElementById("rf-label");
    if (!bar || !toggle) return;

    toggle.addEventListener("click", () => {
      State.refreshActive = !State.refreshActive;
      bar.classList.toggle("paused", !State.refreshActive);
      toggle.textContent = State.refreshActive ? "Pause" : "Resume";
      label.textContent  = State.refreshActive ? "Live — updating" : "Paused";
    });
  }

  /* ──────────────────────────────────────────────
     REAL-TIME SIMULATION ENGINE
     Replace this block's internals with WebSocket
     messages when backend is ready.
  ────────────────────────────────────────────── */
  function simulateLive() {
    if (!State.refreshActive) return;

    LiveMatches.forEach(match => {
      if (match.halfTime) return;

      /* Tick minute */
      if (typeof match.minute === "number") {
        match.minute = Math.min(match.minute + 1, 95);
        patchMinute(match);
      }

      /* Random goal (low probability) */
      if (Math.random() < 0.015) {
        const side    = Math.random() < 0.55 ? 0 : 1;
        const team    = side === 0 ? match.home : match.away;
        const sideKey = side === 0 ? "h" : "a";
        match.score[side]++;
        patchScore(match, sideKey);

        const fakePlayer = ["Striker", "Midfielder", "Forward"][Math.floor(Math.random() * 3)];
        match.events.push({ type: "goal", time: match.minute, team: side === 0 ? "home" : "away", player: fakePlayer });

        const el = document.getElementById(`odds-${match.id}`)?.closest(".live-card");
        if (el) {
          el.style.transition = "box-shadow .3s";
          el.style.boxShadow  = "0 0 30px var(--accent-glow-strong)";
          setTimeout(() => (el.style.boxShadow = ""), 1200);
        }
        showToast(`⚽ GOAL! ${team} score! ${match.score[0]}–${match.score[1]}`, "success");
      }

      /* Odds drift */
      const keys = match.sport === "basketball" || match.sport === "tennis"
        ? ["h", "a"]
        : ["h", "d", "a"];
      keys.forEach(k => {
        if (match.odds[k] === null || match.odds[k] === undefined) return;
        const drift   = (Math.random() - 0.5) * 0.05;
        const prev    = match.odds[k];
        match.odds[k] = Math.max(1.01, Math.round((prev + drift) * 100) / 100);

        const col = document.getElementById(`odds-${match.id}`);
        if (col) {
          const btn = col.querySelector(`.odd-btn[data-key="${k}"]`);
          if (btn && !btn.classList.contains("selected")) {
            const valEl = btn.querySelector(".odd-value");
            if (valEl) valEl.textContent = match.odds[k].toFixed(2);
            btn.dataset.price = String(match.odds[k]);
            btn.classList.add(drift > 0 ? "odds-up" : "odds-down");
            setTimeout(() => btn.classList.remove("odds-up", "odds-down"), 500);
          }
        }
      });
    });

    /* Update refresh label */
    const label = document.getElementById("rf-label");
    if (label) {
      State.lastRefresh = Date.now();
      label.textContent = "Just updated";
      setTimeout(() => { if (label) label.textContent = "Live — updating"; }, 1500);
    }
  }

  /* ──────────────────────────────────────────────
     TRENDING BANNER
  ────────────────────────────────────────────── */
  function buildTrendingBanner() {
    const items = [
      "🔥 Arsenal 2–1 Chelsea · 58'  ",
      "⚡ Real Madrid vs Barça at HT — El Clásico is LIVE  ",
      "🎯 Bayern leads 3–1 with 10-man Dortmund  ",
      "📈 Alcaraz takes first set vs Djokovic  ",
      "💥 PSG vs Man City — 0–0 at 15'  ",
    ];
    const doubled = [...items, ...items];
    const el      = document.getElementById("trending-inner");
    if (!el) return;
    el.innerHTML = doubled.map(t => `<span class="tb-item">${t}</span>`).join("");
  }

  function buildTopTicker() {
    const el = document.getElementById("ticker-inner");
    if (!el) return;
    const items = LiveMatches
      .filter(m => m.sport === "football")
      .slice(0, 4)
      .map(m => `${m.home} <span class="t-score">${m.score[0]}–${m.score[1]}</span> ${m.away} <span class="t-live">LIVE</span>`);
    const doubled = [...items, ...items];
    el.innerHTML = doubled.map(t => `<span class="ticker-item">${t}</span>`).join("");
  }

  /* ──────────────────────────────────────────────
     DRAWER (mobile betslip)
  ────────────────────────────────────────────── */
  function openDrawer() {
    document.getElementById("drawer-overlay")?.classList.add("open");
    document.getElementById("betslip-drawer")?.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    document.getElementById("drawer-overlay")?.classList.remove("open");
    document.getElementById("betslip-drawer")?.classList.remove("open");
    document.body.style.overflow = "";
  }

  function initBackToTop() {
    const backBtn = document.getElementById("back-top");
    if (!backBtn) return;
    window.addEventListener("scroll", () => {
      backBtn.style.display = window.scrollY > 300 ? "flex" : "none";
    });
    backBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  /* ──────────────────────────────────────────────
     WIRE-UP
  ────────────────────────────────────────────── */
  function wireUI() {
    /* Stake controls */
    document.getElementById("stake-slider")?.addEventListener("input", e => setStake(e.target.value));
    document.getElementById("mob-stake-slider")?.addEventListener("input", e => setStake(e.target.value));
    document.getElementById("stake-input")?.addEventListener("input", e => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) setStake(v); });
    document.getElementById("stake-input")?.addEventListener("blur", e => { const v = parseInt(e.target.value, 10); if (isNaN(v) || v < 100) { setStake(100); showToast("Minimum stake ₦100", "error"); } });
    document.querySelectorAll(".preset-btn").forEach(btn => btn.addEventListener("click", () => {
      const v = parseInt(btn.dataset.stake);
      if (!isNaN(v)) {
        setStake(v);
        document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      }
    }));

    /* Place bet */
    document.getElementById("place-bet-btn")?.addEventListener("click", placeBet);
    document.getElementById("mob-place-btn")?.addEventListener("click", placeBet);

    /* Betslip desktop tabs */
    document.querySelectorAll(".bs-tab[data-tab]").forEach(tab => tab.addEventListener("click", () => {
      document.querySelectorAll(".bs-tab[data-tab]").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("panel-betslip").style.display = tab.dataset.tab === "betslip" ? "block" : "none";
      document.getElementById("panel-history").style.display  = tab.dataset.tab === "history"  ? "block" : "none";
    }));

    /* Mobile drawer */
    document.getElementById("mob-betslip-trigger")?.addEventListener("click", e => { e.preventDefault(); openDrawer(); });
    document.getElementById("close-drawer-btn")?.addEventListener("click", closeDrawer);
    document.getElementById("drawer-overlay")?.addEventListener("click", closeDrawer);

    /* Mobile drawer tabs */
    document.querySelectorAll("[data-mob-tab]").forEach(tab => tab.addEventListener("click", () => {
      document.querySelectorAll("[data-mob-tab]").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.mobTab;
      document.getElementById("mob-panel-betslip").style.display = target === "betslip" ? "flex" : "none";
      document.getElementById("mob-panel-history").style.display  = target === "history"  ? "flex" : "none";
    }));

    /* Theme toggle */
    document.getElementById("theme-btn")?.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      document.getElementById("theme-btn").textContent = document.body.classList.contains("light-theme") ? "☀️" : "🌙";
      localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark");
    });
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light-theme");
      const tb = document.getElementById("theme-btn");
      if (tb) tb.textContent = "☀️";
    }

    /* Keyboard escape */
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeDrawer();
    });

    /* Pause simulation on tab hidden */
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && State.refreshActive) {
        const label = document.getElementById("rf-label");
        if (label) label.textContent = "Live — updating";
      }
    });
  }

  /* ──────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────── */
  function init() {
    /* Show skeletons briefly for premium feel */
    renderSkeletons(4);

    setTimeout(() => {
      renderMatchList();
      buildTopTicker();
      buildTrendingBanner();
      initFilterChips();
      initRefreshBar();
      wireUI();
      initBackToTop();
      setStake(100);
      updateBetslip();

      /* Start simulation ticker */
      setInterval(simulateLive, 8000);
    }, 900);
  }

  /* Run after DOM ready */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
