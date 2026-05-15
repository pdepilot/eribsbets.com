#!/usr/bin/env python3
"""Generate ERIBSBETS admin dashboard HTML pages."""

from __future__ import annotations

from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent
CHART_PAGES = frozenset({"index.html", "analytics.html", "wallet.html", "betting.html"})

NAV = [
    ("Core", [
        ("index.html", "fa-gauge-high", "Dashboard"),
        ("users.html", "fa-users", "Users"),
        ("matches.html", "fa-futbol", "Matches"),
        ("betting.html", "fa-ticket", "Betting"),
    ]),
    ("Finance", [("wallet.html", "fa-wallet", "Wallet")]),
    ("Insights", [("analytics.html", "fa-chart-line", "Analytics")]),
    (
        "System",
        [
            ("notifications.html", "fa-bell", "Notifications"),
            ("settings.html", "fa-gear", "Settings"),
            ("logs.html", "fa-terminal", "Logs"),
        ],
    ),
    ("Account", [("profile.html", "fa-user-shield", "Profile")]),
]


def nav_html(active: str) -> str:
    chunks: list[str] = []
    for group, links in NAV:
        chunks.append(f'          <p class="admin-nav-group-title">{group}</p>')
        for href, icon, label in links:
            cls = "admin-nav-link is-active" if href == active else "admin-nav-link"
            chunks.append(
                f'          <a href="{href}" class="{cls}">'
                f'<i class="fa-solid {icon}"></i>'
                f'<span class="admin-nav-label">{label}</span></a>'
            )
    return "\n".join(chunks)


def head_block(active: str, title: str, description: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} · ERIBSBETS Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" />
  <link rel="stylesheet" href="assets/css/admin.css" />
</head>
<body class="admin-app">
  <div class="admin-grid-bg" aria-hidden="true"></div>
  <div id="sidebar-overlay" class="admin-sidebar-overlay" aria-hidden="true"></div>
  <div class="admin-shell">
    <aside class="admin-sidebar" aria-label="Admin navigation">
      <div class="admin-sidebar-brand">
        <a href="index.html" class="admin-logo">ERIBS<span>BETS</span></a>
        <span class="admin-logo-badge">Admin</span>
      </div>
      <nav class="admin-nav">
{nav_html(active)}
      </nav>
      <div class="admin-sidebar-footer">
        <p>Frontend control center — connect APIs when ready.</p>
        <a href="../index.html" class="admin-nav-link" style="margin-top:12px">
          <i class="fa-solid fa-arrow-left"></i>
          <span class="admin-nav-label">Exit to site</span>
        </a>
        <div class="admin-live-pill">Platform online</div>
      </div>
    </aside>
    <div class="admin-main">
      <header class="admin-topbar">
        <button type="button" id="mobile-menu-btn" class="admin-menu-btn" aria-label="Open menu">
          <i class="fa-solid fa-bars"></i>
        </button>
        <button type="button" id="sidebar-collapse-btn" class="admin-icon-btn" aria-label="Collapse sidebar" title="Collapse sidebar">
          <i class="fa-solid fa-angles-left"></i>
        </button>
        <div class="admin-search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" id="global-search" placeholder="Search users, bets, transactions…" autocomplete="off" />
        </div>
        <div class="admin-topbar-actions">
          <div class="admin-dropdown-wrap" data-dropdown>
            <button type="button" class="admin-icon-btn" data-dropdown-trigger aria-label="Notifications">
              <i class="fa-solid fa-bell"></i>
              <span class="badge-dot"></span>
            </button>
            <div class="admin-dropdown">
              <div class="admin-dropdown-head">Notifications</div>
              <a href="notifications.html" class="admin-dropdown-item">
                <i class="fa-solid fa-wallet" style="color:var(--admin-blue)"></i>
                <div><strong>Withdrawal queue</strong><br /><span style="font-size:12px;color:var(--admin-text-3)">12 pending review</span></div>
              </a>
              <a href="notifications.html" class="admin-dropdown-item">
                <i class="fa-solid fa-futbol" style="color:var(--admin-accent)"></i>
                <div><strong>Match voided</strong><br /><span style="font-size:12px;color:var(--admin-text-3)">Lagos Derby · 4m ago</span></div>
              </a>
              <a href="notifications.html" class="admin-dropdown-item">
                <i class="fa-solid fa-shield-halved" style="color:var(--admin-amber)"></i>
                <div><strong>KYC flagged</strong><br /><span style="font-size:12px;color:var(--admin-text-3)">3 accounts need review</span></div>
              </a>
            </div>
          </div>
          <div class="admin-dropdown-wrap" data-dropdown>
            <button type="button" class="admin-profile-btn" data-dropdown-trigger>
              <span class="admin-avatar">EA</span>
              <span>Admin</span>
              <i class="fa-solid fa-chevron-down" style="font-size:10px;opacity:0.6"></i>
            </button>
            <div class="admin-dropdown">
              <div class="admin-dropdown-head">Account</div>
              <a href="profile.html" class="admin-dropdown-item"><i class="fa-solid fa-user"></i><div>My profile</div></a>
              <a href="settings.html" class="admin-dropdown-item"><i class="fa-solid fa-gear"></i><div>Settings</div></a>
              <a href="../index.html" class="admin-dropdown-item"><i class="fa-solid fa-house"></i><div>Exit to site</div></a>
            </div>
          </div>
        </div>
      </header>
      <main class="admin-content">
        <header class="admin-page-head">
          <nav class="admin-breadcrumb" aria-label="Breadcrumb">
            <a href="index.html">Admin</a>
            <i class="fa-solid fa-chevron-right" style="font-size:9px"></i>
            <span>{title}</span>
          </nav>
          <h1>{title}</h1>
          <p>{description}</p>
        </header>
"""


def tail_block(filename: str) -> str:
    extra = ""
    if filename in CHART_PAGES:
        extra = """
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script src="assets/js/admin-charts.js"></script>"""
    return f"""      </main>
    </div>
  </div>
  <div id="admin-toast-root" class="admin-toast-root" aria-live="polite"></div>
  <div id="confirm-modal" class="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
    <div class="admin-modal">
      <div class="admin-modal-head">
        <h3 id="confirm-modal-title">Confirm action</h3>
      </div>
      <div class="admin-modal-body">
        Are you sure you want to proceed? This demo action cannot be undone on a live backend.
      </div>
      <div class="admin-modal-foot">
        <button type="button" class="admin-btn admin-btn-ghost" data-modal-close>Cancel</button>
        <button type="button" class="admin-btn admin-btn-primary" id="confirm-delete-btn">Confirm</button>
      </div>
    </div>
  </div>{extra}
  <script src="assets/js/admin.js"></script>
</body>
</html>
"""


def strip_motion_tags(html: str) -> str:
    """Remove accidental motion.div tags from generated HTML."""
    bad_open = "<" + "motion.div"
    bad_close = "</" + "motion.div>"
    html = html.replace(bad_open, "<div")
    html = html.replace(bad_close, "</div>")
    return html


def build_page(filename: str, meta: dict) -> str:
    html = head_block(filename, meta["title"], meta["description"])
    html += meta["body"]
    html += tail_block(filename)
    return strip_motion_tags(html)


def main() -> list[str]:
    from _admin_bodies import PAGES

    bad_open = "<" + "motion.div"
    bad_close = "</" + "motion.div>"
    created: list[str] = []
    for filename, meta in PAGES.items():
        out = OUT_DIR / filename
        content = build_page(filename, meta)
        if bad_open in content or bad_close in content:
            raise ValueError(f"motion.div leaked into {filename}")
        out.write_text(content, encoding="utf-8")
        created.append(str(out))
        print(f"Wrote {out.name}")
    return created


if __name__ == "__main__":
    files = main()
    print(f"\nGenerated {len(files)} admin pages.")
