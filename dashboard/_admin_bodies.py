# Page body fragments (valid HTML only — no motion.div)

PAGES = {
    "index.html": {
        "title": "Dashboard Overview",
        "description": "Real-time snapshot of users, revenue, betting volume, and platform activity.",
        "body": """
        <div class="admin-stats-grid admin-skeleton-target">
          <div class="admin-stat-card">
            <div class="admin-stat-top">
              <div class="admin-stat-icon"><i class="fa-solid fa-users"></i></div>
              <span class="admin-stat-delta up"><i class="fa-solid fa-arrow-trend-up"></i> 12.4%</span>
            </div>
            <p class="admin-stat-label">Total Users</p>
            <div class="admin-stat-value" data-count-to="48290">0</div>
            <p class="admin-stat-sub">+1,240 this week</p>
          </div>
          <div class="admin-stat-card accent-blue">
            <div class="admin-stat-top">
              <div class="admin-stat-icon"><i class="fa-solid fa-coins"></i></div>
              <span class="admin-stat-delta up"><i class="fa-solid fa-arrow-trend-up"></i> 8.2%</span>
            </div>
            <p class="admin-stat-label">Revenue (30d)</p>
            <div class="admin-stat-value" data-count-to="128.4" data-prefix="₦" data-suffix="M" data-decimals="1">0</div>
            <p class="admin-stat-sub">GGR after bonuses</p>
          </div>
          <div class="admin-stat-card accent-amber">
            <div class="admin-stat-top">
              <div class="admin-stat-icon"><i class="fa-solid fa-ticket"></i></div>
              <span class="admin-stat-delta up"><i class="fa-solid fa-arrow-trend-up"></i> 5.1%</span>
            </div>
            <p class="admin-stat-label">Open Bets</p>
            <div class="admin-stat-value" data-count-to="3842">0</div>
            <p class="admin-stat-sub">₦18.2M exposure</p>
          </div>
          <div class="admin-stat-card accent-purple">
            <div class="admin-stat-top">
              <div class="admin-stat-icon"><i class="fa-solid fa-bolt"></i></div>
              <span class="admin-stat-delta down"><i class="fa-solid fa-arrow-trend-down"></i> 0.8%</span>
            </div>
            <p class="admin-stat-label">Live Events</p>
            <div class="admin-stat-value" data-count-to="156">0</div>
            <p class="admin-stat-sub">Across 12 sports</p>
          </div>
        </div>
        <div class="admin-grid-2">
          <section class="admin-panel admin-skeleton-target">
            <div class="admin-panel-head">
              <h2>Revenue (7 days)</h2>
              <span class="admin-badge success">Live</span>
            </div>
            <div class="admin-panel-body chart-wrap">
              <canvas id="chart-revenue" height="260"></canvas>
            </div>
          </section>
          <section class="admin-panel admin-skeleton-target">
            <div class="admin-panel-head"><h2>Activity Feed</h2></div>
            <div class="admin-panel-body">
              <ul class="admin-feed">
                <li>
                  <div class="admin-feed-icon bet"><i class="fa-solid fa-ticket"></i></div>
                  <div class="admin-feed-body">
                    <strong>Accumulator settled — ₦2.4M payout</strong>
                    <span>2 min ago · User #8291</span>
                  </div>
                </li>
                <li>
                  <div class="admin-feed-icon wallet"><i class="fa-solid fa-wallet"></i></div>
                  <div class="admin-feed-body">
                    <strong>Withdrawal approved — ₦450,000</strong>
                    <span>8 min ago · Paystack</span>
                  </div>
                </li>
                <li>
                  <div class="admin-feed-icon alert"><i class="fa-solid fa-triangle-exclamation"></i></div>
                  <div class="admin-feed-body">
                    <strong>Odds feed latency spike</strong>
                    <span>14 min ago · Resolved</span>
                  </div>
                </li>
                <li>
                  <div class="admin-feed-icon bet"><i class="fa-solid fa-user-plus"></i></div>
                  <div class="admin-feed-body">
                    <strong>142 new registrations today</strong>
                    <span>1 hr ago · KYC queue normal</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
        <div class="admin-grid-2">
          <section class="admin-panel admin-skeleton-target">
            <div class="admin-panel-head"><h2>Active Users (24h)</h2></div>
            <div class="admin-panel-body chart-wrap">
              <canvas id="chart-users" height="240"></canvas>
            </div>
          </section>
          <section class="admin-panel admin-skeleton-target">
            <div class="admin-panel-head"><h2>Betting Mix</h2></div>
            <div class="admin-panel-body chart-wrap">
              <canvas id="chart-betting" height="240"></canvas>
            </div>
          </section>
        </div>
""",
    },
    "users.html": {
        "title": "User Management",
        "description": "IP address, location, and device type update live for accounts that register and browse while signed in (stored in this browser only until APIs are connected).",
        "body": """
        <p id="registered-users-meta"></p>
        <p id="registered-users-empty" class="admin-presence-empty" hidden style="margin-bottom:16px">
          No registered accounts recorded yet. Create one from the main site, sign in, and browse — IP and location appear after the geo lookup completes (HTTPS recommended).
        </p>
        <div class="admin-toolbar">
          <input type="search" id="registered-users-toolbar-search" class="admin-input" placeholder="Search registered accounts…" style="min-width:220px" />
          <select class="admin-select" aria-label="Status filter">
            <option>All statuses</option><option>Active</option><option>Suspended</option><option>Pending KYC</option>
          </select>
          <select class="admin-select" aria-label="Tier filter">
            <option>All tiers</option><option>VIP</option><option>Standard</option>
          </select>
          <button type="button" class="admin-btn admin-btn-primary" data-modal-open="add-user-modal">
            <i class="fa-solid fa-plus"></i> Add user
          </button>
        </div>
        <section class="admin-panel">
          <div class="admin-panel-head">
            <h2>Registered accounts</h2>
            <span class="admin-badge info">This browser only · Demo frontend</span>
          </div>
          <div class="admin-table-wrap">
            <table class="admin-table admin-table-presence">
              <thead><tr><th>User</th><th>Username / Email</th><th>IP address</th><th>Location</th><th>Device</th><th>Last activity</th><th>Balance</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody id="registered-users-tbody"></tbody>
            </table>
          </div>
          <p style="font-size:12px;color:var(--admin-text-3);margin-top:16px;padding:0 4px">
            Static sample rows below — replace with API-backed data in production.
          </p>
          <div class="admin-table-wrap" style="margin-top:12px">
            <table class="admin-table">
              <thead><tr><th>User</th><th>Email</th><th>IP address</th><th>Location</th><th>Device</th><th>Last activity</th><th>Balance</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                <tr>
                  <td><div class="admin-user-cell"><span class="mini-avatar">AO</span><div><strong>Ada Okafor</strong><br /><span style="color:var(--admin-text-3);font-size:12px">#10284</span></div></div></td>
                  <td>ada.o@email.com</td>
                  <td style="color:var(--admin-text-3)">—</td><td style="color:var(--admin-text-3)">—</td><td style="color:var(--admin-text-3)">—</td><td style="color:var(--admin-text-3)">—</td>
                  <td>₦124,500</td><td><span class="admin-badge success">Active</span></td><td>12 Jan 2025</td>
                  <td><button type="button" class="admin-btn admin-btn-ghost" data-demo-action="edit">Edit</button>
                  <button type="button" class="admin-btn admin-btn-ghost" data-demo-action="delete">Delete</button></td>
                </tr>
                <tr>
                  <td><div class="admin-user-cell"><span class="mini-avatar">KM</span><div><strong>Kunle Musa</strong><br /><span style="color:var(--admin-text-3);font-size:12px">#10291</span></div></div></td>
                  <td>k.musa@email.com</td>
                  <td style="color:var(--admin-text-3)">—</td><td style="color:var(--admin-text-3)">—</td><td style="color:var(--admin-text-3)">—</td><td style="color:var(--admin-text-3)">—</td>
                  <td>₦8,200</td><td><span class="admin-badge warning">Pending KYC</span></td><td>03 Mar 2025</td>
                  <td><button type="button" class="admin-btn admin-btn-ghost" data-demo-action="edit">Edit</button>
                  <button type="button" class="admin-btn admin-btn-ghost" data-demo-action="delete">Delete</button></td>
                </tr>
                <tr>
                  <td><div class="admin-user-cell"><span class="mini-avatar">CE</span><div><strong>Chidi Eze</strong><br /><span style="color:var(--admin-text-3);font-size:12px">#10302</span></div></div></td>
                  <td>chidi.eze@email.com</td>
                  <td style="color:var(--admin-text-3)">—</td><td style="color:var(--admin-text-3)">—</td><td style="color:var(--admin-text-3)">—</td><td style="color:var(--admin-text-3)">—</td>
                  <td>₦0</td><td><span class="admin-badge danger">Suspended</span></td><td>18 Feb 2025</td>
                  <td><button type="button" class="admin-btn admin-btn-ghost" data-demo-action="edit">Edit</button>
                  <button type="button" class="admin-btn admin-btn-ghost" data-demo-action="delete">Delete</button></td>
                </tr>
                <tr>
                  <td><div class="admin-user-cell"><span class="mini-avatar">FN</span><div><strong>Fatima Nwosu</strong><br /><span style="color:var(--admin-text-3);font-size:12px">#10318</span></div></div></td>
                  <td>f.nwosu@email.com</td>
                  <td style="color:var(--admin-text-3)">—</td><td style="color:var(--admin-text-3)">—</td><td style="color:var(--admin-text-3)">—</td><td style="color:var(--admin-text-3)">—</td>
                  <td>₦892,000</td><td><span class="admin-badge success">VIP</span></td><td>07 Apr 2024</td>
                  <td><button type="button" class="admin-btn admin-btn-ghost" data-demo-action="edit">Edit</button>
                  <button type="button" class="admin-btn admin-btn-ghost" data-demo-action="delete">Delete</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="admin-pagination">
            <span style="font-size:13px;color:var(--admin-text-3)">Showing 1–4 of 48,290 users</span>
            <div class="admin-pagination-pages">
              <button type="button" class="is-active">1</button><button type="button">2</button>
              <button type="button">3</button><button type="button">…</button><button type="button">1208</button>
            </div>
          </div>
        </section>
        <div id="add-user-modal" class="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="add-user-title">
          <div class="admin-modal">
            <div class="admin-modal-head"><h3 id="add-user-title">Add new user</h3></div>
            <div class="admin-modal-body">
              <div class="admin-form-grid">
                <div class="admin-form-group"><label for="nu-name">Full name</label><input id="nu-name" type="text" placeholder="Jane Doe" /></div>
                <div class="admin-form-group"><label for="nu-email">Email</label><input id="nu-email" type="email" placeholder="user@email.com" /></div>
                <div class="admin-form-group"><label for="nu-phone">Phone</label><input id="nu-phone" type="tel" placeholder="+234…" /></div>
                <div class="admin-form-group"><label for="nu-tier">Tier</label><select id="nu-tier"><option>Standard</option><option>VIP</option></select></div>
              </div>
            </div>
            <div class="admin-modal-foot">
              <button type="button" class="admin-btn admin-btn-ghost" data-modal-close>Cancel</button>
              <button type="button" class="admin-btn admin-btn-primary" data-demo-action="save">Create user</button>
            </div>
          </div>
        </div>
""",
    },
    "matches.html": {
        "title": "Match Management",
        "description": "Schedule, suspend, and monitor fixtures across all sportsbooks.",
        "body": """
        <div class="admin-toolbar">
          <input type="search" class="admin-input" placeholder="Search teams, league, ID…" style="min-width:220px" />
          <select class="admin-select" aria-label="Sport filter">
            <option>All sports</option><option>Football</option><option>Basketball</option><option>Tennis</option>
          </select>
          <select class="admin-select" aria-label="Status filter">
            <option>All statuses</option><option>Live</option><option>Upcoming</option><option>Finished</option>
          </select>
          <button type="button" class="admin-btn admin-btn-primary" data-demo-action="add-match">
            <i class="fa-solid fa-plus"></i> Add match
          </button>
        </div>
        <section class="admin-panel">
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead><tr><th>Match</th><th>League</th><th>Kickoff</th><th>Status</th><th>Markets</th><th>Actions</th></tr></thead>
              <tbody>
                <tr>
                  <td><strong>Arsenal vs Chelsea</strong><br /><span style="color:var(--admin-text-3);font-size:12px">#M-48291</span></td>
                  <td>Premier League</td><td>Today 17:30</td>
                  <td><span class="admin-badge live"><i class="fa-solid fa-circle" style="font-size:8px"></i> Live</span></td>
                  <td>142</td>
                  <td><button type="button" class="admin-btn admin-btn-ghost" data-demo-action="edit">Edit</button>
                  <button type="button" class="admin-btn admin-btn-ghost" data-demo-action="suspend">Suspend</button></td>
                </tr>
                <tr>
                  <td><strong>Lakers vs Celtics</strong><br /><span style="color:var(--admin-text-3);font-size:12px">#M-48292</span></td>
                  <td>NBA</td><td>Today 02:00</td>
                  <td><span class="admin-badge live"><i class="fa-solid fa-circle" style="font-size:8px"></i> Live</span></td>
                  <td>89</td>
                  <td><button type="button" class="admin-btn admin-btn-ghost" data-demo-action="edit">Edit</button>
                  <button type="button" class="admin-btn admin-btn-ghost" data-demo-action="suspend">Suspend</button></td>
                </tr>
                <tr>
                  <td><strong>Barcelona vs Real Madrid</strong><br /><span style="color:var(--admin-text-3);font-size:12px">#M-48301</span></td>
                  <td>La Liga</td><td>Tomorrow 21:00</td>
                  <td><span class="admin-badge">Upcoming</span></td>
                  <td>198</td>
                  <td><button type="button" class="admin-btn admin-btn-ghost" data-demo-action="edit">Edit</button>
                  <button type="button" class="admin-btn admin-btn-ghost" data-demo-action="delete">Delete</button></td>
                </tr>
                <tr>
                  <td><strong>Djokovic vs Alcaraz</strong><br /><span style="color:var(--admin-text-3);font-size:12px">#M-48308</span></td>
                  <td>ATP Masters</td><td>Yesterday 14:00</td>
                  <td><span class="admin-badge success">Finished</span></td>
                  <td>56</td>
                  <td><button type="button" class="admin-btn admin-btn-ghost" data-demo-action="view">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
""",
    },
    "betting.html": {
        "title": "Betting Activity",
        "description": "Monitor open slips, settlements, and exposure by market type.",
        "body": """
        <div class="admin-grid-2">
          <section class="admin-panel admin-skeleton-target" style="grid-column:1/-1">
            <div class="admin-panel-head">
              <h2>Recent bets</h2>
              <select class="admin-select" aria-label="Bet type">
                <option>All types</option><option>Single</option><option>Accumulator</option><option>Live</option>
              </select>
            </div>
            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead><tr><th>Slip ID</th><th>User</th><th>Selection</th><th>Stake</th><th>Odds</th><th>Status</th></tr></thead>
                <tbody>
                  <tr>
                    <td>#B-92841</td><td>Ada Okafor</td><td>Arsenal ML + Over 2.5</td>
                    <td>₦25,000</td><td>4.82</td><td><span class="admin-badge warning">Open</span></td>
                  </tr>
                  <tr>
                    <td>#B-92838</td><td>Fatima Nwosu</td><td>Lakers -4.5</td>
                    <td>₦120,000</td><td>1.91</td><td><span class="admin-badge live">Live</span></td>
                  </tr>
                  <tr>
                    <td>#B-92835</td><td>Kunle Musa</td><td>5-fold acca</td>
                    <td>₦2,000</td><td>18.4</td><td><span class="admin-badge success">Won</span></td>
                  </tr>
                  <tr>
                    <td>#B-92830</td><td>Chidi Eze</td><td>Barcelona BTTS</td>
                    <td>₦8,500</td><td>2.10</td><td><span class="admin-badge danger">Lost</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section class="admin-panel admin-skeleton-target">
            <div class="admin-panel-head"><h2>Volume by type</h2></div>
            <div class="admin-panel-body chart-wrap">
              <canvas id="chart-betting" height="280"></canvas>
            </div>
          </section>
        </div>
""",
    },
    "wallet.html": {
        "title": "Wallet & Transactions",
        "description": "Deposits, withdrawals, and balance movements across payment rails.",
        "body": """
        <div class="admin-grid-2">
          <section class="admin-panel admin-skeleton-target">
            <div class="admin-panel-head">
              <h2>Cash flow (6 weeks)</h2>
              <span class="admin-badge success">Synced</span>
            </div>
            <div class="admin-panel-body chart-wrap">
              <canvas id="chart-wallet" height="260"></canvas>
            </div>
          </section>
          <section class="admin-panel">
            <div class="admin-panel-head"><h2>Quick stats</h2></div>
            <div class="admin-panel-body">
              <ul class="admin-feed">
                <li>
                  <div class="admin-feed-icon wallet"><i class="fa-solid fa-arrow-down"></i></div>
                  <div class="admin-feed-body">
                    <strong>Deposits today — ₦4.2M</strong>
                    <span>842 transactions</span>
                  </div>
                </li>
                <li>
                  <div class="admin-feed-icon alert"><i class="fa-solid fa-arrow-up"></i></div>
                  <div class="admin-feed-body">
                    <strong>Withdrawals pending — ₦1.8M</strong>
                    <span>12 awaiting review</span>
                  </div>
                </li>
                <li>
                  <div class="admin-feed-icon bet"><i class="fa-solid fa-scale-balanced"></i></div>
                  <div class="admin-feed-body">
                    <strong>Net position — ₦2.4M</strong>
                    <span>vs yesterday +6.1%</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
        <section class="admin-panel">
          <div class="admin-toolbar" style="padding:16px 20px 0">
            <select class="admin-select" aria-label="Type filter">
              <option>All types</option><option>Deposit</option><option>Withdrawal</option><option>Bonus</option>
            </select>
            <input type="date" class="admin-input" aria-label="From date" />
            <input type="date" class="admin-input" aria-label="To date" />
          </div>
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead><tr><th>TX ID</th><th>User</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Time</th></tr></thead>
              <tbody>
                <tr>
                  <td>#TX-482901</td><td>Fatima Nwosu</td><td>Deposit</td>
                  <td style="color:var(--admin-accent)">+₦250,000</td><td>Paystack</td>
                  <td><span class="admin-badge success">Completed</span></td><td>2 min ago</td>
                </tr>
                <tr>
                  <td>#TX-482898</td><td>Ada Okafor</td><td>Withdrawal</td>
                  <td style="color:var(--admin-red)">-₦45,000</td><td>Bank transfer</td>
                  <td><span class="admin-badge warning">Pending</span></td><td>18 min ago</td>
                </tr>
                <tr>
                  <td>#TX-482890</td><td>Kunle Musa</td><td>Bonus</td>
                  <td style="color:var(--admin-accent)">+₦5,000</td><td>Promo</td>
                  <td><span class="admin-badge success">Completed</span></td><td>1 hr ago</td>
                </tr>
                <tr>
                  <td>#TX-482885</td><td>Chidi Eze</td><td>Deposit</td>
                  <td style="color:var(--admin-accent)">+₦12,000</td><td>Card</td>
                  <td><span class="admin-badge danger">Failed</span></td><td>2 hr ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
""",
    },
    "analytics.html": {
        "title": "Analytics",
        "description": "Platform performance, GGR trends, and operational health scores.",
        "body": """
        <div class="admin-stats-grid admin-skeleton-target">
          <div class="admin-stat-card">
            <p class="admin-stat-label">Conversion rate</p>
            <div class="admin-stat-value" data-count-to="3.8" data-suffix="%" data-decimals="1">0</div>
            <p class="admin-stat-sub">Signup → first bet</p>
          </div>
          <div class="admin-stat-card accent-blue">
            <p class="admin-stat-label">Avg bet size</p>
            <div class="admin-stat-value" data-count-to="4200" data-prefix="₦">0</div>
            <p class="admin-stat-sub">Last 7 days</p>
          </div>
          <div class="admin-stat-card accent-amber">
            <p class="admin-stat-label">Retention (30d)</p>
            <div class="admin-stat-value" data-count-to="68" data-suffix="%">0</div>
            <p class="admin-stat-sub">Returning users</p>
          </div>
          <div class="admin-stat-card accent-purple">
            <p class="admin-stat-label">NGR margin</p>
            <div class="admin-stat-value" data-count-to="12.2" data-suffix="%" data-decimals="1">0</div>
            <p class="admin-stat-sub">After bonuses</p>
          </div>
        </div>
        <div class="admin-grid-2">
          <section class="admin-panel admin-skeleton-target">
            <div class="admin-panel-head"><h2>Revenue trend</h2></div>
            <div class="admin-panel-body chart-wrap">
              <canvas id="chart-revenue" height="240"></canvas>
            </div>
          </section>
          <section class="admin-panel admin-skeleton-target">
            <div class="admin-panel-head"><h2>GGR by month</h2></div>
            <div class="admin-panel-body chart-wrap">
              <canvas id="chart-analytics-secondary" height="240"></canvas>
            </div>
          </section>
        </div>
        <section class="admin-panel admin-skeleton-target">
          <div class="admin-panel-head"><h2>Platform health</h2></div>
          <div class="admin-panel-body chart-wrap" style="max-width:480px;margin:0 auto">
            <canvas id="chart-performance" height="320"></canvas>
          </div>
        </section>
""",
    },
    "notifications.html": {
        "title": "Notifications",
        "description": "System alerts, compliance flags, and operational messages.",
        "body": """
        <div class="admin-toolbar">
          <select class="admin-select" aria-label="Filter">
            <option>All</option><option>Unread</option><option>Critical</option><option>Wallet</option>
          </select>
          <button type="button" class="admin-btn admin-btn-ghost" data-demo-action="mark-read">Mark all read</button>
        </div>
        <section class="admin-panel">
          <ul class="admin-notif-list">
            <li class="admin-notif-item unread">
              <div class="admin-notif-icon critical"><i class="fa-solid fa-shield-halved"></i></div>
              <div class="admin-notif-body">
                <strong>KYC review required — 3 accounts</strong>
                <p>Users flagged by automated screening need manual approval.</p>
                <span class="admin-notif-time">12 min ago</span>
              </div>
              <button type="button" class="admin-btn admin-btn-ghost" data-demo-action="dismiss">Dismiss</button>
            </li>
            <li class="admin-notif-item unread">
              <div class="admin-notif-icon wallet"><i class="fa-solid fa-wallet"></i></div>
              <div class="admin-notif-body">
                <strong>Withdrawal queue above threshold</strong>
                <p>12 pending withdrawals totaling ₦1.8M await approval.</p>
                <span class="admin-notif-time">28 min ago</span>
              </div>
              <a href="wallet.html" class="admin-btn admin-btn-primary">Review</a>
            </li>
            <li class="admin-notif-item">
              <div class="admin-notif-icon match"><i class="fa-solid fa-futbol"></i></div>
              <div class="admin-notif-body">
                <strong>Match voided — Lagos Derby</strong>
                <p>All open bets on event #M-48102 have been refunded.</p>
                <span class="admin-notif-time">1 hr ago</span>
              </div>
            </li>
            <li class="admin-notif-item">
              <div class="admin-notif-icon info"><i class="fa-solid fa-chart-line"></i></div>
              <div class="admin-notif-body">
                <strong>Weekly report ready</strong>
                <p>GGR up 8.2% vs prior week. Download from analytics.</p>
                <span class="admin-notif-time">3 hr ago</span>
              </div>
            </li>
            <li class="admin-notif-item">
              <div class="admin-notif-icon info"><i class="fa-solid fa-server"></i></div>
              <div class="admin-notif-body">
                <strong>Scheduled maintenance completed</strong>
                <p>Odds feed cluster upgraded with zero downtime.</p>
                <span class="admin-notif-time">Yesterday</span>
              </div>
            </li>
          </ul>
        </section>
""",
    },
    "settings.html": {
        "title": "Settings",
        "description": "Configure platform defaults, security policies, and integrations.",
        "body": """
        <div data-tabs>
        <div class="admin-tabs" role="tablist">
          <button type="button" class="admin-tab is-active" data-tab="general" role="tab" aria-selected="true">General</button>
          <button type="button" class="admin-tab" data-tab="security" role="tab">Security</button>
          <button type="button" class="admin-tab" data-tab="platform" role="tab">Platform</button>
        </div>
        <section class="admin-panel admin-tab-panel is-active" data-tab-panel="general" role="tabpanel">
          <div class="admin-panel-body">
            <div class="admin-form-grid">
              <div class="admin-form-group">
                <label for="set-site-name">Site name</label>
                <input id="set-site-name" type="text" value="ERIBSBETS" />
              </div>
              <div class="admin-form-group">
                <label for="set-currency">Default currency</label>
                <select id="set-currency"><option>NGN (₦)</option><option>USD ($)</option></select>
              </div>
              <div class="admin-form-group">
                <label for="set-timezone">Timezone</label>
                <select id="set-timezone"><option>Africa/Lagos</option><option>UTC</option></select>
              </div>
              <div class="admin-form-group">
                <label for="set-support">Support email</label>
                <input id="set-support" type="email" value="support@eribsbets.demo" />
              </div>
            </div>
            <button type="button" class="admin-btn admin-btn-primary" data-demo-action="save" style="margin-top:20px">Save general</button>
          </div>
        </section>
        <section class="admin-panel admin-tab-panel" data-tab-panel="security" role="tabpanel" hidden>
          <div class="admin-panel-body">
            <div class="admin-form-grid">
              <div class="admin-form-group">
                <label for="set-2fa">Require 2FA for admins</label>
                <select id="set-2fa"><option>Enabled</option><option>Disabled</option></select>
              </div>
              <div class="admin-form-group">
                <label for="set-session">Session timeout (minutes)</label>
                <input id="set-session" type="number" value="30" />
              </div>
              <div class="admin-form-group">
                <label for="set-ip">IP allowlist</label>
                <textarea id="set-ip" rows="3" placeholder="One IP per line…"></textarea>
              </div>
            </div>
            <button type="button" class="admin-btn admin-btn-primary" data-demo-action="save" style="margin-top:20px">Save security</button>
          </div>
        </section>
        <section class="admin-panel admin-tab-panel" data-tab-panel="platform" role="tabpanel" hidden>
          <div class="admin-panel-body">
            <div class="admin-form-grid">
              <div class="admin-form-group">
                <label for="set-min-bet">Minimum bet (₦)</label>
                <input id="set-min-bet" type="number" value="100" />
              </div>
              <div class="admin-form-group">
                <label for="set-max-payout">Max payout (₦)</label>
                <input id="set-max-payout" type="number" value="50000000" />
              </div>
              <div class="admin-form-group">
                <label for="set-maintenance">Maintenance mode</label>
                <select id="set-maintenance"><option>Off</option><option>On</option></select>
              </div>
              <div class="admin-form-group">
                <label for="set-api">Odds API endpoint</label>
                <input id="set-api" type="url" placeholder="https://api.example.com/odds" />
              </div>
            </div>
            <button type="button" class="admin-btn admin-btn-primary" data-demo-action="save" style="margin-top:20px">Save platform</button>
          </div>
        </section>
        </div>
""",
    },
    "profile.html": {
        "title": "Admin Profile",
        "description": "Your administrator account details and activity summary.",
        "body": """
        <div class="admin-grid-2">
          <section class="admin-panel">
            <div class="admin-panel-head"><h2>Profile</h2></div>
            <div class="admin-panel-body">
              <div class="admin-profile-header">
                <span class="admin-avatar large">EA</span>
                <div>
                  <h2 style="font-family:var(--admin-font-head);font-size:1.25rem">ERIBS Admin</h2>
                  <p style="color:var(--admin-text-3);font-size:14px">superadmin@eribsbets.demo</p>
                </div>
              </div>
              <div class="admin-form-grid" style="margin-top:24px">
                <div class="admin-form-group">
                  <label for="prof-name">Display name</label>
                  <input id="prof-name" type="text" value="ERIBS Admin" />
                </div>
                <div class="admin-form-group">
                  <label for="prof-email">Email</label>
                  <input id="prof-email" type="email" value="superadmin@eribsbets.demo" />
                </div>
                <div class="admin-form-group">
                  <label for="prof-role">Role</label>
                  <input id="prof-role" type="text" value="Super Administrator" readonly />
                </div>
                <div class="admin-form-group">
                  <label for="prof-pass">New password</label>
                  <input id="prof-pass" type="password" placeholder="••••••••" />
                </div>
              </div>
              <button type="button" class="admin-btn admin-btn-primary" data-demo-action="save" style="margin-top:20px">Update profile</button>
            </div>
          </section>
          <section class="admin-panel">
            <div class="admin-panel-head"><h2>Your activity</h2></div>
            <div class="admin-panel-body">
              <div class="admin-stats-grid" style="grid-template-columns:1fr 1fr">
                <div class="admin-stat-card" style="padding:16px">
                  <p class="admin-stat-label">Actions today</p>
                  <div class="admin-stat-value" data-count-to="47">0</div>
                </div>
                <div class="admin-stat-card accent-blue" style="padding:16px">
                  <p class="admin-stat-label">Last login</p>
                  <p style="font-size:15px;font-weight:600;margin-top:8px">Today 09:14</p>
                </div>
              </div>
              <ul class="admin-feed" style="margin-top:20px">
                <li>
                  <div class="admin-feed-icon bet"><i class="fa-solid fa-user-check"></i></div>
                  <div class="admin-feed-body">
                    <strong>Approved withdrawal #TX-482880</strong>
                    <span>2 hr ago</span>
                  </div>
                </li>
                <li>
                  <div class="admin-feed-icon wallet"><i class="fa-solid fa-gear"></i></div>
                  <div class="admin-feed-body">
                    <strong>Updated platform settings</strong>
                    <span>Yesterday</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
""",
    },
    "logs.html": {
        "title": "System Logs",
        "description": "Audit trail and application events (demo static output).",
        "body": """
        <div class="admin-toolbar">
          <select class="admin-select" aria-label="Log level">
            <option>All levels</option><option>INFO</option><option>WARN</option><option>ERROR</option>
          </select>
          <input type="search" class="admin-input" placeholder="Filter logs…" style="min-width:200px" />
          <button type="button" class="admin-btn admin-btn-ghost" data-demo-action="export">Export</button>
        </div>
        <section class="admin-panel">
          <pre class="admin-logs" aria-label="System log output"><code>[2025-05-15 09:14:02] INFO  auth.session     Admin login successful uid=admin-001 ip=102.89.x.x
[2025-05-15 09:18:41] INFO  wallet.withdraw  TX-482898 queued amount=45000 user=10284
[2025-05-15 09:22:15] WARN  odds.feed        Latency spike provider=primary duration_ms=842
[2025-05-15 09:22:48] INFO  odds.feed        Latency normalized duration_ms=120
[2025-05-15 09:31:02] INFO  betting.settle   Slip B-92835 settled payout=36800 user=10291
[2025-05-15 09:45:19] ERROR payment.gateway  Card deposit failed code=declined tx=482885
[2025-05-15 09:52:33] INFO  kyc.review       Flag cleared user=10302 reviewer=admin-001
[2025-05-15 10:01:07] INFO  match.void       Event M-48102 voided reason=abandoned bets_refunded=124
[2025-05-15 10:08:55] WARN  security.rate    Login attempts exceeded ip=197.210.x.x threshold=5
[2025-05-15 10:15:22] INFO  cache.warm       Sportsbook cache refreshed keys=1842 duration_ms=340
[2025-05-15 10:22:01] INFO  api.health       All services healthy uptime=99.98%</code></pre>
        </section>
""",
    },
}
