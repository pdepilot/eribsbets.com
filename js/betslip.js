// ============================================
// ERIBSBETS - Full Betting Engine v3
// Features: Odds Flash, Skeleton Loading,
//           Sub-Nav, Filter Fade, Bet Modal,
//           Stake Presets, Real-Time Odds,
//           Bet History, Toast Notifications
// ============================================

const state = {
  selections: {},
  stake: 100
};

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // FEATURE 3: SKELETON LOADING
  // ============================================
  const matchesSection = document.querySelector('.matches-section');
  const realContent = matchesSection.innerHTML;

  function buildSkeletons(count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="skeleton-card">
          <div class="skeleton skeleton-line short"></div>
          <div class="skeleton skeleton-line medium"></div>
          <div class="skeleton skeleton-line full"></div>
          <div class="skeleton-odds">
            <div class="skeleton skeleton-odd-btn"></div>
            <div class="skeleton skeleton-odd-btn"></div>
            <div class="skeleton skeleton-odd-btn"></div>
          </div>
        </div>`;
    }
    return html;
  }

  matchesSection.innerHTML = buildSkeletons(3);

  setTimeout(() => {
    matchesSection.innerHTML = realContent;
    initOddButtons();
    startLiveOddsSimulation();
  }, 900);

  // ============================================
  // FEATURE 4: SPORTS SUB-NAV CLICK HIGHLIGHT
  // ============================================
  const subNavLinks = document.querySelectorAll('.sub-nav-links li');
  subNavLinks.forEach(li => {
    li.addEventListener('click', () => {
      subNavLinks.forEach(l => l.classList.remove('active'));
      li.classList.add('active');
    });
  });

  // ============================================
  // STAKE INPUT LISTENER
  // ============================================
  const stakeInput = document.getElementById('stake-input');
  const desktopBadge = document.getElementById('desktop-badge');
  const mobileBadge = document.getElementById('mobile-badge');
  const totalOddsDisplay = document.getElementById('total-odds');
  const potentialReturnDisplay = document.getElementById('potential-return');

  if (stakeInput) {
    stakeInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.stake = isNaN(val) || val < 0 ? 0 : val;
      updateCalculations();
    });
  }

  // ============================================
  // CORE: ODD BUTTON INIT
  // ============================================
  function initOddButtons() {
    const oddButtons = document.querySelectorAll('.odd-btn');
    oddButtons.forEach(btn => {
      const matchId = btn.getAttribute('data-match-id');
      const outcome = btn.getAttribute('data-outcome');
      if (state.selections[matchId] && state.selections[matchId].outcome === outcome) {
        btn.classList.add('selected');
      }
      btn.addEventListener('click', () => handleOddClick(btn));
    });
  }

  function handleOddClick(btn) {
    const matchId = btn.getAttribute('data-match-id');
    const matchName = btn.getAttribute('data-match-name');
    const outcome = btn.getAttribute('data-outcome');
    const price = parseFloat(btn.getAttribute('data-price'));

    // FEATURE 1: Flash animation
    btn.classList.remove('flash');
    void btn.offsetWidth;
    btn.classList.add('flash');
    setTimeout(() => btn.classList.remove('flash'), 500);

    if (state.selections[matchId] && state.selections[matchId].outcome === outcome) {
      delete state.selections[matchId];
      btn.classList.remove('selected');
      showToast(`Removed: ${matchName} — ${outcome}`, 'info');
    } else {
      const siblings = btn.parentElement.querySelectorAll('.odd-btn');
      siblings.forEach(s => s.classList.remove('selected'));
      state.selections[matchId] = { matchId, matchName, outcome, price };
      btn.classList.add('selected');
      showToast(`Added: ${matchName} — ${outcome} @ ${price.toFixed(2)}`, 'success');
    }

    updateBetslip();
  }

  // ============================================
  // NEW: REAL-TIME ODDS SIMULATION
  // ============================================
  function startLiveOddsSimulation() {
    setInterval(() => {
      const allOddBtns = document.querySelectorAll('.odd-btn:not(.selected)');
      if (allOddBtns.length === 0) return;

      // Pick 1 random button to "fluctuate"
      const randomBtn = allOddBtns[Math.floor(Math.random() * allOddBtns.length)];
      const currentPrice = parseFloat(randomBtn.getAttribute('data-price'));
      if (isNaN(currentPrice)) return;

      // Fluctuate ±0.05 to ±0.20
      const change = (Math.random() * 0.3 - 0.15).toFixed(2);
      const newPrice = Math.max(1.01, (currentPrice + parseFloat(change))).toFixed(2);

      randomBtn.setAttribute('data-price', newPrice);
      randomBtn.textContent = newPrice;

      // Flash the price change
      randomBtn.classList.remove('flash');
      void randomBtn.offsetWidth;
      randomBtn.classList.add('flash');
      setTimeout(() => randomBtn.classList.remove('flash'), 500);

    }, 4000); // Every 4 seconds
  }

  // ============================================
  // NEW: TOAST NOTIFICATIONS
  // ============================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    // Remove after 3s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  window.showToast = showToast;

  // ============================================
  // FEATURE 7: PLACE BET MODAL + BET HISTORY
  // ============================================
  const placeBetBtn = document.getElementById('place-bet-btn');
  if (placeBetBtn) {
    placeBetBtn.addEventListener('click', () => {
      const keys = Object.keys(state.selections);
      if (keys.length === 0) {
        showToast('Add at least one selection to place a bet.', 'error');
        return;
      }

      let totalOdds = 1;
      keys.forEach(k => { totalOdds *= state.selections[k].price; });
      const potentialReturn = (totalOdds * state.stake).toFixed(2);

      const details = document.getElementById('bet-modal-details');
      let detailsHTML = `<div>Selections: <strong>${keys.length}</strong></div>`;
      keys.forEach(k => {
        const s = state.selections[k];
        detailsHTML += `<div>${s.matchName} — <strong>${s.outcome} @ ${s.price.toFixed(2)}</strong></div>`;
      });
      detailsHTML += `<div style="margin-top:8px;border-top:1px solid #334155;padding-top:8px">
        Stake: <strong>₦${Number(state.stake).toLocaleString()}</strong><br>
        Total Odds: <strong>${totalOdds.toFixed(2)}</strong><br>
        Potential Return: <strong style="color:var(--accent-color)">₦${Number(potentialReturn).toLocaleString()}</strong>
      </div>`;
      details.innerHTML = detailsHTML;

      // Save to bet history in localStorage
      saveBetHistory(keys, totalOdds, potentialReturn);

      document.getElementById('bet-modal-overlay').classList.add('show');
    });
  }

  // ============================================
  // NEW: BET HISTORY (localStorage)
  // ============================================
  function saveBetHistory(keys, totalOdds, potentialReturn) {
    const history = JSON.parse(localStorage.getItem('eribsbets_history') || '[]');
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      stake: state.stake,
      totalOdds: totalOdds.toFixed(2),
      potentialReturn,
      selections: keys.map(k => ({
        match: state.selections[k].matchName,
        outcome: state.selections[k].outcome,
        price: state.selections[k].price.toFixed(2)
      }))
    };
    history.unshift(entry);
    // Keep only last 20
    localStorage.setItem('eribsbets_history', JSON.stringify(history.slice(0, 20)));
  }

  // Render bet history panel if it exists on page
  function renderBetHistory() {
    const panel = document.getElementById('bet-history-list');
    if (!panel) return;
    const history = JSON.parse(localStorage.getItem('eribsbets_history') || '[]');
    if (history.length === 0) {
      panel.innerHTML = '<p class="hint" style="text-align:center;padding:15px">No bets placed yet.</p>';
      return;
    }
    panel.innerHTML = history.map(entry => `
      <div class="history-entry">
        <div class="history-date">${entry.date}</div>
        <div class="history-selections">${entry.selections.map(s => `${s.match} — ${s.outcome} @ ${s.price}`).join('<br>')}</div>
        <div class="history-summary">
          Stake: <strong>₦${Number(entry.stake).toLocaleString()}</strong> &nbsp;|&nbsp;
          Odds: <strong>${entry.totalOdds}</strong> &nbsp;|&nbsp;
          Return: <strong style="color:var(--accent-color)">₦${Number(entry.potentialReturn).toLocaleString()}</strong>
        </div>
      </div>`).join('');
  }
  renderBetHistory();

  // ============================================
  // EXPOSE GLOBAL FUNCTIONS
  // ============================================
  window.removeSelection = function(matchId) {
    delete state.selections[matchId];
    const btn = document.querySelector(`.odd-btn[data-match-id="${matchId}"].selected`);
    if (btn) btn.classList.remove('selected');
    updateBetslip();
  };

  window.setStake = function(amount) {
    state.stake = amount;
    if (stakeInput) stakeInput.value = amount;
    document.querySelectorAll('.stake-preset').forEach(btn => {
      const btnVal = btn.textContent.includes('K')
        ? parseInt(btn.textContent.replace(/[₦K]/g, '')) * 1000
        : parseInt(btn.textContent.replace(/[₦,]/g, ''));
      btn.classList.toggle('active-preset', btnVal === amount);
    });
    updateCalculations();
  };

  window.closeBetModal = function() {
    document.getElementById('bet-modal-overlay').classList.remove('show');
    state.selections = {};
    document.querySelectorAll('.odd-btn.selected').forEach(b => b.classList.remove('selected'));
    updateBetslip();
    renderBetHistory();
    showToast('Bet placed successfully! Good luck! 🎉', 'success');
  };

  // THEME TOGGLE
  window.toggleTheme = function() {
    document.body.classList.toggle('light-theme');
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    localStorage.setItem('eribsbets_theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
  };
  // Restore saved theme
  if (localStorage.getItem('eribsbets_theme') === 'light') {
    document.body.classList.add('light-theme');
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = '☀️';
  }

  // ============================================
  // UPDATE BETSLIP
  // ============================================
  function updateBetslip() {
    const keys = Object.keys(state.selections);
    const count = keys.length;

    if (desktopBadge) desktopBadge.textContent = count;
    if (mobileBadge) mobileBadge.textContent = count;

    const emptyHTML = `
      <div class="empty-state">
        <p>Your betslip is empty</p>
        <p class="hint">Please make a selection to place a bet.</p>
      </div>`;

    let itemsHTML = '';
    if (count > 0) {
      itemsHTML = '<div class="betslip-items">';
      keys.forEach(k => {
        const sel = state.selections[k];
        itemsHTML += `
          <div class="betslip-item">
            <div class="betslip-item-header">
              <span class="betslip-match">${sel.matchName}</span>
              <button class="betslip-remove" onclick="removeSelection('${sel.matchId}')">×</button>
            </div>
            <div class="betslip-item-body">
              <span class="betslip-pick">Pick: ${sel.outcome}</span>
              <span class="betslip-price">${sel.price.toFixed(2)}</span>
            </div>
          </div>`;
      });
      itemsHTML += '</div>';
    }

    const betslipBody = document.getElementById('betslip-body');
    const betslipFooter = document.getElementById('betslip-footer');
    if (betslipBody) betslipBody.innerHTML = count > 0 ? itemsHTML : emptyHTML;
    if (betslipFooter) betslipFooter.style.display = count > 0 ? 'block' : 'none';

    updateCalculations();
  }

  function updateCalculations() {
    const keys = Object.keys(state.selections);
    if (keys.length === 0) return;
    let totalOdds = 1;
    keys.forEach(k => { totalOdds *= state.selections[k].price; });
    const potentialReturn = totalOdds * state.stake;
    if (totalOddsDisplay) totalOddsDisplay.textContent = totalOdds.toFixed(2);
    if (potentialReturnDisplay) potentialReturnDisplay.textContent = '₦' + potentialReturn.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // ============================================
  // FEATURE: UNIFIED FILTERING (SEARCH + LEAGUES + DATES)
  // ============================================
  let activeDateFilter = 'all';

  window.applyFilters = function() {
    const searchQuery = document.getElementById('match-search').value.toLowerCase().trim();
    const searchWords = searchQuery.split(/\s+/).filter(w => w.length > 0);
    const selectedLeagues = Array.from(document.querySelectorAll('#league-options input:checked')).map(cb => cb.value);
    const cards = document.querySelectorAll('.betway-match-card');
    
    // Toggle search clear button
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';

    let visibleCount = 0;
    cards.forEach(card => {
      const teamsEl = card.querySelector('.teams-col');
      const compEl = card.querySelector('.comp-name');
      const compText = compEl.innerText.toLowerCase();
      const teamText = teamsEl.innerText.toLowerCase();
      const matchDate = card.dataset.date || '';
      const matchLeague = card.dataset.league || '';

      // Reset highlighting first
      if (!card.dataset.origTeams) card.dataset.origTeams = teamsEl.innerHTML;
      if (!card.dataset.origComp) card.dataset.origComp = compEl.innerHTML;
      teamsEl.innerHTML = card.dataset.origTeams;
      compEl.innerHTML = card.dataset.origComp;

      // 1. Search Criteria (Smart Word Matching)
      const matchesSearch = searchWords.length === 0 || searchWords.every(word => teamText.includes(word) || compText.includes(word));
      
      // 2. League Criteria
      const matchesLeague = selectedLeagues.length === 0 || selectedLeagues.some(l => matchLeague === l || compText.includes(l));

      // 3. Date Criteria
      const matchesDate = activeDateFilter === 'all' || matchDate === activeDateFilter;

      if (matchesSearch && matchesLeague && matchesDate) {
        card.style.display = 'block';
        visibleCount++;
        
        // Re-apply search highlighting if needed
        if (searchQuery.length > 0) {
          teamsEl.innerHTML = highlightText(card.dataset.origTeams, searchQuery);
          compEl.innerHTML = highlightText(card.dataset.origComp, searchQuery);
        }
      } else {
        card.style.display = 'none';
      }
    });

    // Update UI
    updateSelectedLeaguesText(selectedLeagues);
    updateNoResults(visibleCount, searchQuery || (selectedLeagues.length > 0 ? 'selected leagues' : '') || (activeDateFilter !== 'all' ? activeDateFilter : ''));
    
    // Save state
    localStorage.setItem('eribsbets_filters', JSON.stringify({
      search: searchQuery,
      leagues: selectedLeagues,
      date: activeDateFilter
    }));

    // FEATURE: SCROLL TO TOP
    if (visibleCount > 0) {
      window.scrollTo({ top: matchesSection.offsetTop - 150, behavior: 'smooth' });
    }
  };

  window.filterByDate = function(date) {
    activeDateFilter = date;
    // Update active UI
    document.querySelectorAll('.date-filter-btn').forEach(btn => {
      // Use id or lower case text match
      const btnId = 'date-' + date;
      btn.classList.toggle('active', btn.id === btnId || btn.innerText.toLowerCase().includes(date));
    });
    applyFilters();
  };

  function updateSelectedLeaguesText(leagues) {
    const textEl = document.getElementById('selected-leagues-text');
    if (!textEl) return;
    if (leagues.length === 0) {
      textEl.textContent = 'All Leagues';
    } else if (leagues.length === 1) {
      textEl.textContent = leagues[0].replace(/\b\w/g, l => l.toUpperCase());
    } else {
      textEl.textContent = `${leagues.length} Selected`;
    }
  }

  // ============================================
  // FEATURE: MARKET SWITCHER (1X2 / DC / OU / GG)
  // ============================================
  let currentMarket = '1x2';

  window.switchMarket = function(market, btn) {
    currentMarket = market;
    
    // Update active tab UI
    document.querySelectorAll('.market-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // Update Headers
    const headers = document.getElementById('market-headers');
    const labels = {
      '1x2': ['1', 'X', '2'],
      'dc': ['1X', '12', 'X2'],
      'ou': ['O 2.5', 'U 2.5', ''],
      'gg': ['Yes', 'No', '']
    };
    headers.innerHTML = labels[market].map(l => `<span>${l}</span>`).join('');

    // Update Match Card Buttons
    const cards = document.querySelectorAll('.betway-match-card');
    cards.forEach(card => {
      const odds = card.getAttribute(`data-m${market}`).split(',');
      const btns = card.querySelectorAll('.odd-btn');
      
      btns.forEach((b, idx) => {
        if (odds[idx]) {
          b.style.display = 'block';
          b.setAttribute('data-price', odds[idx]);
          b.setAttribute('data-outcome', labels[market][idx]);
          b.innerHTML = odds[idx];
          
          // Re-check selected state
          const matchId = b.getAttribute('data-match-id');
          if (state.selections[matchId] && state.selections[matchId].outcome === labels[market][idx]) {
            b.classList.add('selected');
          } else {
            b.classList.remove('selected');
          }
        } else {
          b.style.display = 'none';
        }
      });
    });
  };

  // ============================================
  // NEW: REAL-TIME ODDS SIMULATION (with Arrows)
  // ============================================
  function startLiveOddsSimulation() {
    setInterval(() => {
      const allOddBtns = document.querySelectorAll('.odd-btn:not(.selected)');
      if (allOddBtns.length === 0) return;

      const randomBtn = allOddBtns[Math.floor(Math.random() * allOddBtns.length)];
      const currentPrice = parseFloat(randomBtn.getAttribute('data-price'));
      if (isNaN(currentPrice)) return;

      const change = (Math.random() * 0.2 - 0.1).toFixed(2);
      const newPrice = Math.max(1.01, (currentPrice + parseFloat(change))).toFixed(2);
      const isUp = parseFloat(change) > 0;

      randomBtn.setAttribute('data-price', newPrice);
      
      // FEATURE: ARROWS
      const arrow = isUp ? '<span class="odd-indicator indicator-up">▲</span>' : '<span class="odd-indicator indicator-down">▼</span>';
      randomBtn.innerHTML = newPrice + arrow;

      // FEATURE: PULSE ANIMATION
      randomBtn.classList.remove('pulse');
      void randomBtn.offsetWidth; 
      randomBtn.classList.add('pulse');
      
      // Clean up arrow after 2s
      setTimeout(() => {
        if (!randomBtn.classList.contains('selected')) {
          randomBtn.innerHTML = newPrice;
        }
      }, 2000);

    }, 3500); 
  }

  // ============================================
  // FEATURE: DYNAMIC DATE LABELS
  // ============================================
  function initDynamicDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Weekend (next Saturday)
    const weekend = new Date(today);
    weekend.setDate(today.getDate() + (6 - today.getDay() + 7) % 7);

    const fmt = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    document.getElementById('date-today').innerHTML = `Today <span style="font-size:10px;display:block;opacity:0.7">${fmt(today)}</span>`;
    document.getElementById('date-tomorrow').innerHTML = `Tomorrow <span style="font-size:10px;display:block;opacity:0.7">${fmt(tomorrow)}</span>`;
    document.getElementById('date-weekend').innerHTML = `Weekend <span style="font-size:10px;display:block;opacity:0.7">${fmt(weekend)}</span>`;
  }
  initDynamicDates();

  // ============================================
  // FEATURE: BOOKING CODE SYSTEM
  // ============================================
  window.generateBookingCode = function() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'EB-';
    for(let i=0; i<6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('booking-code-val').textContent = code;
  };

  window.copyBookingCode = function() {
    const code = document.getElementById('booking-code-val').textContent;
    navigator.clipboard.writeText(code);
    showToast(`Booking Code ${code} copied!`, 'success');
  };

  // Update place bet to generate code
  const oldPlaceBet = document.getElementById('place-bet-btn').onclick;
  document.getElementById('place-bet-btn').addEventListener('click', () => {
    if (Object.keys(state.selections).length > 0) {
      generateBookingCode();
    }
  });

  // ============================================
  // FEATURE: MULTI-SELECT COMPONENT LOGIC
  // ============================================
  window.toggleMultiSelect = function() {
    document.getElementById('league-multi-select').classList.toggle('open');
  };

  document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('league-multi-select');
    if (wrapper && !wrapper.contains(e.target)) {
      wrapper.classList.remove('open');
    }
  });

  window.selectAllLeagues = function(select) {
    const cbs = document.querySelectorAll('#league-options input[type="checkbox"]');
    cbs.forEach(cb => cb.checked = select);
    applyFilters();
  };

  function updateDynamicCounts() {
    const cards = document.querySelectorAll('.betway-match-card');
    const options = document.querySelectorAll('.multi-option');
    options.forEach(opt => {
      const val = opt.querySelector('input').value;
      const countEl = opt.querySelector('.count');
      const count = Array.from(cards).filter(c => {
        const comp = c.querySelector('.comp-name').innerText.toLowerCase();
        const league = c.dataset.league || '';
        return comp.includes(val) || league === val;
      }).length;
      countEl.textContent = `(${count})`;
    });
  }

  function restoreFilterState() {
    const saved = localStorage.getItem('eribsbets_filters');
    if (!saved) return;
    
    const { search, leagues, date } = JSON.parse(saved);
    const searchInput = document.getElementById('match-search');
    if (searchInput) searchInput.value = search;
    
    const cbs = document.querySelectorAll('#league-options input[type="checkbox"]');
    cbs.forEach(cb => {
      if (leagues.includes(cb.value)) cb.checked = true;
    });

    if (date) {
      activeDateFilter = date;
      document.querySelectorAll('.date-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === date);
      });
    }
    
    if (search || leagues.length > 0 || date !== 'all') applyFilters();
  }

  setTimeout(() => {
    updateDynamicCounts();
    restoreFilterState();
  }, 1000);

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  function highlightText(html, query) {
    const words = query.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return html;
    
    let result = html;
    words.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      result = result.replace(regex, '<span class="search-highlight">$1</span>');
    });
    return result;
  }

  function updateNoResults(count, query) {
    let noResults = document.getElementById('no-search-results');
    if (count === 0) {
      if (!noResults) {
        noResults = document.createElement('div');
        noResults.id = 'no-search-results';
        noResults.className = 'no-results-msg';
        noResults.innerHTML = `
          <div class="no-results-icon">🔎</div>
          <div class="no-results-text">No matches match your current search and filter settings</div>
          <button class="no-results-btn" onclick="clearSearch()">Clear All Filters</button>
        `;
        matchesSection.appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  }

  window.clearSearch = function() {
    const input = document.getElementById('match-search');
    if (input) input.value = '';
    activeDateFilter = 'all';
    document.querySelectorAll('.date-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.innerText.toLowerCase() === 'all');
    });
    selectAllLeagues(false);
  };

  // ============================================
  // FEATURE: SIDEBAR TAB SWITCHING
  // ============================================
  window.switchSidebarTab = function(tab) {
    const betslipTab = document.getElementById('tab-betslip');
    const historyTab = document.getElementById('tab-history');
    const betslipPanel = document.getElementById('panel-betslip');
    const historyPanel = document.getElementById('panel-history');

    if (tab === 'betslip') {
      betslipTab.classList.add('active');
      historyTab.classList.remove('active');
      betslipPanel.style.display = 'block';
      historyPanel.style.display = 'none';
    } else {
      historyTab.classList.add('active');
      betslipTab.classList.remove('active');
      historyPanel.style.display = 'block';
      betslipPanel.style.display = 'none';
      renderBetHistory();
    }
  };

  window.clearBetHistory = function() {
    if (confirm('Are you sure you want to clear your bet history?')) {
      localStorage.removeItem('eribsbets_history');
      renderBetHistory();
      showToast('Bet history cleared', 'info');
    }
  };

});

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
