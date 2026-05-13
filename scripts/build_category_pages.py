#!/usr/bin/env python3
"""Generate ERIBSBETS category landing pages."""

from __future__ import annotations

import html
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

MEGA = [
    ("aviator.html", "✈️", "Aviator"),
    ("live-casino.html", "🎲", "Live Casino"),
    ("lucky-nums.html", "🎱", "Lucky Nums"),
    ("betgames.html", "🃏", "Betgames"),
    ("esports.html", "🎮", "Esports"),
    ("virtuals.html", "💻", "Virtuals"),
    ("promos.html", "🎁", "Promos"),
    ("football.html", "⚽", "Football"),
    ("basketball.html", "🏀", "Basketball"),
    ("tennis.html", "🎾", "Tennis"),
    ("table-tennis.html", "🏓", "Table Tennis"),
    ("ice-hockey.html", "🏒", "Ice Hockey"),
]

SPORT_SUB = [
    ("football.html", "Football"),
    ("basketball.html", "Basketball"),
    ("tennis.html", "Tennis"),
    ("table-tennis.html", "Table Tennis"),
    ("ice-hockey.html", "Ice Hockey"),
    ("volleyball.html", "Volleyball"),
    ("more-sports.html", "More Sports"),
]

FIXTURES = {
    "football": [
        ("Premier League", "Arsenal vs Chelsea", "Today 20:00", "2.10", "3.40", "3.25"),
        ("La Liga", "Real Madrid vs Barcelona", "Today 21:00", "2.35", "3.55", "2.90"),
        ("Serie A", "Inter vs AC Milan", "Tomorrow 19:45", "2.05", "3.30", "3.60"),
        ("Bundesliga", "Bayern vs Dortmund", "Tomorrow 17:30", "1.78", "3.90", "4.20"),
    ],
    "basketball": [
        ("NBA", "Lakers vs Warriors", "Today 02:30", "1.95", "N/A", "1.88"),
        ("EuroLeague", "Real Madrid vs Fenerbahce", "Today 20:00", "1.72", "N/A", "2.10"),
        ("NBA", "Celtics vs Bucks", "Tomorrow 01:00", "1.66", "N/A", "2.22"),
        ("NBA", "Nuggets vs Suns", "Tomorrow 03:00", "1.84", "N/A", "1.96"),
    ],
    "tennis": [
        ("ATP", "Sinner vs Alcaraz", "Today 15:00", "1.92", "N/A", "1.90"),
        ("WTA", "Swiatek vs Gauff", "Today 17:30", "1.74", "N/A", "2.08"),
        ("ATP", "Djokovic vs Medvedev", "Tomorrow 14:00", "1.68", "N/A", "2.18"),
        ("ATP", "Rune vs Fritz", "Tomorrow 18:00", "2.05", "N/A", "1.78"),
    ],
    "table-tennis": [
        ("TT Elite", "Ma Long vs Fan Zhendong", "Today 12:30", "1.88", "N/A", "1.92"),
        ("TT Cup", "Boll vs Ovtcharov", "Today 14:10", "2.02", "N/A", "1.76"),
        ("Pro Tour", "Calderano vs Harimoto", "Tomorrow 11:00", "1.95", "N/A", "1.85"),
        ("TT Elite", "Lin vs Lebrun", "Tomorrow 16:20", "1.70", "N/A", "2.12"),
    ],
    "ice-hockey": [
        ("NHL", "Maple Leafs vs Bruins", "Today 01:00", "2.12", "3.80", "3.05"),
        ("NHL", "Rangers vs Devils", "Today 01:30", "1.98", "4.10", "3.20"),
        ("KHL", "CSKA vs SKA", "Tomorrow 17:00", "2.25", "3.95", "2.80"),
        ("NHL", "Oilers vs Avalanche", "Tomorrow 03:00", "2.40", "3.70", "2.75"),
    ],
    "volleyball": [
        ("CEV", "Perugia vs Trentino", "Today 19:00", "1.82", "N/A", "1.98"),
        ("Superliga", "Zenit vs Lokomotiv", "Today 17:00", "1.76", "N/A", "2.05"),
        ("PlusLiga", "Jastrzebski vs ZAKSA", "Tomorrow 18:30", "2.08", "N/A", "1.74"),
        ("CEV", "Lube vs Modena", "Tomorrow 20:00", "1.90", "N/A", "1.90"),
    ],
    "more": [
        ("Cricket", "India vs Australia", "Today 09:30", "1.85", "N/A", "1.95"),
        ("Rugby", "Leinster vs Toulouse", "Tomorrow 15:00", "1.92", "N/A", "1.88"),
        ("MMA", "Adesanya vs Pereira", "Sat 22:00", "2.15", "N/A", "1.72"),
        ("Handball", "Barcelona vs Kiel", "Tomorrow 19:45", "1.68", "N/A", "2.20"),
    ],
}

GAMES = {
    "aviator": [
        ("✈️", "Aviator Classic", "Cash out before the plane flies away."),
        ("🛫", "Aviator X", "Turbo rounds with boosted multipliers."),
        ("🌌", "Spaceman", "Orbit multipliers in deep space."),
        ("🎯", "JetX", "Fast arcade crash action."),
    ],
    "live-casino": [
        ("🎡", "Roulette Live", "Immersive tables with HD dealers."),
        ("🃏", "Blackjack VIP", "Low-latency seats and side bets."),
        ("🎰", "Baccarat Squeeze", "Premium squeeze cameras."),
        ("🎲", "Crazy Time", "Show-style bonus wheels."),
    ],
    "lucky-nums": [
        ("7️⃣", "Lucky 7", "Pick your number and spin."),
        ("🎱", "Keno Blast", "Fast draws every minute."),
        ("🔢", "Number King", "Match digits for instant wins."),
        ("💎", "Diamond Draw", "Jackpot-style number hunt."),
    ],
    "betgames": [
        ("🃏", "Poker Bet", "Live dealer poker rounds."),
        ("🎲", "Dice Duel", "Head-to-head dice battles."),
        ("🎯", "Wheel Bet", "Spin-to-win show format."),
        ("⚡", "War of Bets", "Quick card showdowns."),
    ],
    "esports": [
        ("🎮", "CS2 Majors", "Map winners and round handicaps."),
        ("🛡️", "LoL Worlds", "Series lines and first blood."),
        ("⚔️", "Dota 2 TI", "Match winner and total kills."),
        ("📱", "Mobile Legends", "Regional cups and live markets."),
    ],
}

PROMOS = [
    ("Welcome Boost", "100% first deposit match", "Double your first bankroll up to ₦50,000 with fair playthrough."),
    ("Acca Insurance", "5+ legs protected", "Get a free bet back if one leg lets your accumulator down."),
    ("Weekend Combo", "Odds surge Fridays", "Boosted prices on curated football and basketball combos."),
    ("Cashback Club", "10% weekly return", "Recover part of your net losses every Monday."),
]

PAGES = [
    {
        "file": "football.html",
        "title": "Football Betting",
        "desc": "Premier League, La Liga, Serie A and more with boosted football markets.",
        "icon": "⚽",
        "badge": "Football Hub",
        "hero": "Bet smarter on the world's biggest leagues.",
        "sub": "From kick-off specials to live corners, build slips with sharp prices and instant updates.",
        "theme": "",
        "kind": "sport",
        "sport_key": "football",
        "sub_active": "football.html",
        "stats": [("128", "Live Markets"), ("42", "Leagues"), ("₦2.1M", "Top Payout"), ("96%", "Cash Out")],
        "chips": ["All Leagues", "England", "Spain", "Italy", "Europe"],
        "sidebar": [("Premier League", "24"), ("Champions League", "18"), ("La Liga", "16"), ("Serie A", "14")],
    },
    {
        "file": "basketball.html",
        "title": "Basketball Betting",
        "desc": "NBA, EuroLeague and college lines with player props and quarter markets.",
        "icon": "🏀",
        "badge": "Hoops Central",
        "hero": "Fast breaks, faster odds.",
        "sub": "Track spreads, totals and player props across NBA nights and EuroLeague fixtures.",
        "theme": "",
        "kind": "sport",
        "sport_key": "basketball",
        "sub_active": "basketball.html",
        "stats": [("64", "Live Games"), ("18", "Competitions"), ("₦950K", "Max Win"), ("24/7", "Lines")],
        "chips": ["NBA", "EuroLeague", "NCAA", "Player Props", "Quarters"],
        "sidebar": [("NBA", "22"), ("EuroLeague", "12"), ("NCAA", "28"), ("WNBA", "8")],
    },
    {
        "file": "tennis.html",
        "title": "Tennis Betting",
        "desc": "ATP, WTA and Grand Slam match winner, set betting and live markets.",
        "icon": "🎾",
        "badge": "Court Side",
        "hero": "Serve up value on every surface.",
        "sub": "From clay masters to hard-court night sessions, price swings update point by point.",
        "theme": "",
        "kind": "sport",
        "sport_key": "tennis",
        "sub_active": "tennis.html",
        "stats": [("38", "Courts Live"), ("12", "Tours"), ("₦600K", "Top Win"), ("Live", "Point Bets")],
        "chips": ["ATP", "WTA", "Grand Slams", "Challengers", "Live"],
        "sidebar": [("ATP 1000", "14"), ("WTA 1000", "11"), ("Grand Slams", "6"), ("Challengers", "19")],
    },
    {
        "file": "table-tennis.html",
        "title": "Table Tennis Betting",
        "desc": "Rapid table tennis markets with live set betting and match handicaps.",
        "icon": "🏓",
        "badge": "Ping Pong Pulse",
        "hero": "Lightning rallies, lightning lines.",
        "sub": "Micro-markets refresh between points for elite TT Elite and international tours.",
        "theme": "",
        "kind": "sport",
        "sport_key": "table-tennis",
        "sub_active": "table-tennis.html",
        "stats": [("52", "Matches"), ("9", "Tours"), ("₦400K", "Max Win"), ("3s", "Refresh")],
        "chips": ["TT Elite", "Pro Tour", "Set Betting", "Handicap", "Live"],
        "sidebar": [("TT Elite", "16"), ("TT Cup", "12"), ("Pro Tour", "10"), ("International", "14")],
    },
    {
        "file": "ice-hockey.html",
        "title": "Ice Hockey Betting",
        "desc": "NHL and KHL puck lines, period totals and overtime specials.",
        "icon": "🏒",
        "badge": "Ice Edge",
        "hero": "Cold ice, hot prices.",
        "sub": "Skate through regulation, period and shootout markets with live cash-out.",
        "theme": "",
        "kind": "sport",
        "sport_key": "ice-hockey",
        "sub_active": "ice-hockey.html",
        "stats": [("26", "Games"), ("6", "Leagues"), ("₦720K", "Top Win"), ("Period", "Markets")],
        "chips": ["NHL", "KHL", "Puck Line", "Period Totals", "Overtime"],
        "sidebar": [("NHL", "18"), ("KHL", "8"), ("SHL", "6"), ("Liiga", "5")],
    },
    {
        "file": "volleyball.html",
        "title": "Volleyball Betting",
        "desc": "Indoor and beach volleyball match winner and set handicap markets.",
        "icon": "🏐",
        "badge": "Volley Vault",
        "hero": "Set-by-set drama, slip by slip.",
        "sub": "European powerhouses and international cups with live set betting.",
        "theme": "",
        "kind": "sport",
        "sport_key": "volleyball",
        "sub_active": "volleyball.html",
        "stats": [("22", "Matches"), ("7", "Leagues"), ("₦380K", "Max Win"), ("Live", "Sets")],
        "chips": ["CEV", "Superliga", "PlusLiga", "Set Handicap", "Totals"],
        "sidebar": [("CEV Champions", "9"), ("Superliga", "7"), ("PlusLiga", "6"), ("Beach", "4")],
    },
    {
        "file": "more-sports.html",
        "title": "More Sports",
        "desc": "Cricket, rugby, MMA, handball and specialty markets in one hub.",
        "icon": "🏆",
        "badge": "All Sports",
        "hero": "Every sport, one sharp book.",
        "sub": "Discover niche leagues and novelty markets without leaving ERIBSBETS.",
        "theme": "",
        "kind": "sport",
        "sport_key": "more",
        "sub_active": "more-sports.html",
        "stats": [("80+", "Disciplines"), ("31", "Live Now"), ("₦1.2M", "Top Win"), ("Daily", "Specials")],
        "chips": ["Cricket", "Rugby", "MMA", "Handball", "Darts"],
        "sidebar": [("Cricket", "11"), ("Rugby", "8"), ("MMA", "6"), ("Handball", "7")],
    },
    {
        "file": "aviator.html",
        "title": "Aviator",
        "desc": "Crash-style Aviator games with instant cash-out and multiplier hunts.",
        "icon": "✈️",
        "badge": "Crash Zone",
        "hero": "Ride the multiplier before takeoff.",
        "sub": "Watch the curve climb, cash out in a tap, and chase sky-high multipliers responsibly.",
        "theme": "theme-aviator",
        "kind": "game",
        "game_key": "aviator",
        "sub_active": None,
        "stats": [("x5000", "Max Mult"), ("2.4s", "Avg Round"), ("₦100", "Min Stake"), ("24/7", "Live")],
        "chips": ["Classic", "Turbo", "Auto Bet", "History", "Leaderboard"],
        "sidebar": [("Classic", "Live"), ("Turbo", "Live"), ("Spaceman", "Hot"), ("JetX", "New")],
    },
    {
        "file": "live-casino.html",
        "title": "Live Casino",
        "desc": "HD live dealer tables, game shows and VIP blackjack rooms.",
        "icon": "🎲",
        "badge": "Dealer Studio",
        "hero": "Real dealers. Real-time wins.",
        "sub": "Stream premium tables with low latency, side bets and immersive game-show formats.",
        "theme": "theme-casino",
        "kind": "game",
        "game_key": "live-casino",
        "sub_active": None,
        "stats": [("48", "Tables"), ("12", "Studios"), ("₦5M", "VIP Limit"), ("HD", "Streams")],
        "chips": ["Roulette", "Blackjack", "Baccarat", "Game Shows", "VIP"],
        "sidebar": [("Roulette", "14"), ("Blackjack", "16"), ("Baccarat", "9"), ("Shows", "6")],
    },
    {
        "file": "lucky-nums.html",
        "title": "Lucky Nums",
        "desc": "Number draws, keno and instant lucky pick games.",
        "icon": "🎱",
        "badge": "Lucky Draw",
        "hero": "Pick lucky digits, land instant hits.",
        "sub": "Fast number games with transparent draws and rapid result cycles.",
        "theme": "theme-casino",
        "kind": "game",
        "game_key": "lucky-nums",
        "sub_active": None,
        "stats": [("60s", "Draw Cycle"), ("8", "Games"), ("₦250K", "Jackpot"), ("RNG", "Certified")],
        "chips": ["Keno", "Lucky 7", "Jackpots", "Quick Pick", "History"],
        "sidebar": [("Lucky 7", "Live"), ("Keno Blast", "Live"), ("Number King", "Hot"), ("Diamond Draw", "New")],
    },
    {
        "file": "betgames.html",
        "title": "Betgames",
        "desc": "TV-style live betting games with cards, dice and wheels.",
        "icon": "🃏",
        "badge": "Showtime",
        "hero": "TV-style games, bet in seconds.",
        "sub": "Join presenter-led rounds built for quick decisions and social energy.",
        "theme": "theme-casino",
        "kind": "game",
        "game_key": "betgames",
        "sub_active": None,
        "stats": [("24/7", "Broadcast"), ("6", "Shows"), ("₦800K", "Top Win"), ("Live", "Hosts")],
        "chips": ["Poker", "Dice", "Wheel", "War", "Lucky 6"],
        "sidebar": [("Poker Bet", "Live"), ("Dice Duel", "Live"), ("Wheel Bet", "Hot"), ("War of Bets", "Live")],
    },
    {
        "file": "esports.html",
        "title": "Esports",
        "desc": "CS2, LoL, Dota 2 and mobile esports with live map markets.",
        "icon": "🎮",
        "badge": "Esports Arena",
        "hero": "Pixel-perfect esports pricing.",
        "sub": "Follow tier-one tournaments with map winners, handicaps and in-play swings.",
        "theme": "",
        "kind": "game",
        "game_key": "esports",
        "sub_active": None,
        "stats": [("34", "Live Maps"), ("9", "Titles"), ("₦1.5M", "Max Win"), ("Live", "Data")],
        "chips": ["CS2", "LoL", "Dota 2", "Valorant", "Mobile"],
        "sidebar": [("CS2", "12"), ("LoL", "9"), ("Dota 2", "7"), ("Valorant", "6")],
    },
    {
        "file": "promos.html",
        "title": "Promotions",
        "desc": "Welcome boosts, acca insurance, cashback and weekend specials.",
        "icon": "🎁",
        "badge": "Rewards",
        "hero": "Bonuses built for real bettors.",
        "sub": "Claim transparent offers with clear terms — no hidden hoops, just extra value.",
        "theme": "theme-promo",
        "kind": "promo",
        "sub_active": None,
        "stats": [("4", "Active Offers"), ("₦50K", "Welcome"), ("10%", "Cashback"), ("Daily", "Boosts")],
        "chips": ["Welcome", "Accas", "Cashback", "Casino", "VIP"],
        "sidebar": [("Sports", "3"), ("Casino", "2"), ("VIP", "1"), ("New", "2")],
    },
]


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def mega_menu(current: str) -> str:
    lines = ['              <motion omitted class="mega-grid">']
    for href, icon, label in MEGA:
        current_attr = ' aria-current="page"' if href == current else ""
        lines.append(
            f'                <a href="{esc(href)}" role="menuitem"{current_attr}>'
            f'<span class="icon">{icon}</span><span>{esc(label)}</span></a>'
        )
    lines.append("              </motion omitted>")
    return "\n".join(lines).replace("<motion omitted>", "div")


def sport_sub_nav(active: str | None) -> str:
    if not active:
        return ""
    items = []
    for href, label in SPORT_SUB:
        cls = ' class="active"' if href == active else ""
        items.append(f'          <li{cls}><a href="{esc(href)}">{esc(label)}</a></li>')
    return (
        '\n      <nav class="sub-nav" aria-label="Sport categories">\n        <ul>\n'
        + "\n".join(items)
        + "\n        </ul>\n      </nav>"
    )


def fixtures_block(sport_key: str) -> str:
    rows = []
    for league, teams, time, home, draw, away in FIXTURES[sport_key]:
        draw_btn = (
            f'            <button class="odds-btn" type="button"><span>Draw</span>{esc(draw)}</button>\n'
            if draw != "N/A"
            else ""
        )
        rows.append(
            f"""          <article class="fixture-row">
            <div class="fixture-meta">
              <motion omitted class="fixture-league">{esc(league)}</motion omitted>
              <motion omitted class="fixture-teams">{esc(teams)}</motion omitted>
              <motion omitted class="fixture-time">{esc(time)}</motion omitted>
            </motion omitted>
            <button class="odds-btn" type="button"><span>Home</span>{esc(home)}</button>
{draw_btn}            <button class="odds-btn" type="button"><span>Away</span>{esc(away)}</button>
          </article>"""
        )
    body = "\n".join(rows).replace("<motion omitted>", "div").replace("</motion omitted>", "</div>")
    return f"""        <section class="cat-section" aria-label="Featured fixtures">
          <header class="cat-section-head">
            <h2>Featured Fixtures</h2>
            <span class="meta">Prices update in real time</span>
          </header>
          <div class="fixture-list">
{body}
          </div>
        </section>"""


def games_block(game_key: str) -> str:
    cards = []
    for icon, title, blurb in GAMES[game_key]:
        cards.append(
            f"""          <article class="game-card" tabindex="0">
            <div class="game-card-icon">{icon}</div>
            <h3>{esc(title)}</h3>
            <p>{esc(blurb)}</p>
            <span class="play-tag">Play now</span>
          </article>"""
        )
    return f"""        <section class="cat-section" aria-label="Featured games">
          <header class="cat-section-head">
            <h2>Featured Games</h2>
            <span class="meta">Tap a tile to launch</span>
          </header>
          <div class="game-grid">
{chr(10).join(cards)}
          </div>
        </section>"""


def promos_block() -> str:
    cards = []
    for kicker, title, blurb in PROMOS:
        cards.append(
            f"""          <article class="promo-card">
            <div>
              <div class="promo-kicker">{esc(kicker)}</motion omitted>
              <h3>{esc(title)}</h3>
              <p>{esc(blurb)}</p>
            </motion omitted>
            <button class="promo-cta" type="button">Claim offer</button>
          </article>"""
        )
    body = "\n".join(cards).replace("<motion omitted>", "motion omitted").replace("motion omitted", "motion omitted")
    body = body.replace("<motion omitted>", "div").replace("</motion omitted>", "</div>")
    return f"""        <section class="cat-section" aria-label="Active promotions">
          <header class="cat-section-head">
            <h2>Active Promotions</h2>
            <span class="meta">18+ · T&amp;Cs apply</span>
          </header>
          <div class="promo-grid">
{body}
          </div>
        </section>"""


def render_page(page: dict) -> str:
    current = page["file"]
    chips = "".join(
        f'\n            <button class="cat-chip{" active" if i == 0 else ""}" type="button">{esc(c)}</button>'
        for i, c in enumerate(page["chips"])
    )
    stats = "".join(
        f"""
            <div class="cat-stat">
              <span class="cat-stat-val">{esc(v)}</span>
              <span class="cat-stat-label">{esc(l)}</span>
            </div>"""
        for v, l in page["stats"]
    )
    sidebar = "".join(
        f"\n            <li><span>{esc(name)}</span><span class=\"ct\">{esc(count)}</span></li>"
        for name, count in page["sidebar"]
    )

    if page["kind"] == "sport":
        main_body = fixtures_block(page["sport_key"])
        aria = "Sport betting"
    elif page["kind"] == "promo":
        main_body = promos_block()
        aria = "Promotions"
    else:
        main_body = games_block(page["game_key"])
        aria = page["title"]

    sub_nav = sport_sub_nav(page.get("sub_active"))
    theme = page.get("theme") or ""

    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>ERIBSBETS — {esc(page["title"])}</title>
    <meta name="description" content="{esc(page["desc"])}" />
    <meta name="theme-color" content="#00e676" />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="css/index.css" />
    <link rel="stylesheet" href="css/category.css" />
  </head>
  <body>
    <div class="header-wrapper">
      <header class="topbar">
        <a href="index.html" class="topbar-brand" aria-label="ERIBSBETS Home">
          <span class="brand-er">ER</span><span class="brand-ibs">IBS</span><span class="brand-bets">BETS</span>
        </a>
        <div class="topbar-ticker" aria-label="Highlights ticker">
          <span class="ticker-label">⚡ {esc(page["badge"])}</span>
          <div class="ticker-scroll">
            <div class="ticker-inner">
              <span class="ticker-item"><span class="t-score">{esc(page["icon"])}</span> {esc(page["title"])} — {esc(page["hero"])}</span>
              <span class="ticker-item"><span class="t-score">ERIBSBETS</span> Sharp odds · Fast payouts</span>
            </div>
          </div>
        </div>
        <motion omitted class="auth-row desktop-auth">
          <motion omitted class="auth-field">
            <span class="prefix">+234</span>
            <input type="tel" placeholder="Mobile Number" maxlength="11" aria-label="Mobile number" />
          </motion omitted>
          <motion omitted class="auth-field">
            <input type="password" placeholder="Password" aria-label="Password" />
          </motion omitted>
          <a href="#" class="forgot-link">Forgot?</a>
          <a href="login.html" class="btn btn-login">Login</a>
          <a href="login.html" class="btn btn-register">Register</a>
        </motion omitted>
        <a href="login.html" class="mobile-auth-btn">Login / Register</a>
      </header>

      <nav class="main-nav" aria-label="Main navigation">
        <div class="logo-placeholder" aria-label="ERIBSBETS">ER</div>
        <ul class="nav-links">
          <li><a href="index.html"><span class="icon" aria-hidden="true">🏠</span><span>Home</span></a></li>
          <li class="active"><a href="index.html" aria-current="page"><span class="icon" aria-hidden="true">⚽</span><span>Sport</span></a></li>
          <li><a href="live.html"><span class="icon" aria-hidden="true">⏱️</span><span>Live</span></a></li>
          <li><a href="casino.html"><span class="icon" aria-hidden="true">🎰</span><span>Casino</span></a></li>
        </ul>
        <div class="nav-right" style="margin-left: auto">
          <button class="icon-btn" id="theme-btn" aria-label="Toggle theme">🌙</button>
          <div class="dropdown-wrap">
            <button class="icon-btn" id="mega-menu-btn" aria-label="More sports" aria-expanded="false">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="mega-menu" id="mega-menu" role="menu">
{mega_menu(current)}
            </div>
          </div>
        </div>
      </nav>
{sub_nav}
    </div>

    <main class="category-page" aria-label="{esc(aria)}">
      <aside class="category-sidebar" aria-label="Highlights">
        <div class="sidebar-card">
          <h3>Highlights</h3>
          <ul class="sidebar-list">{sidebar}
          </ul>
        </div>
      </aside>

      <section class="category-main">
        <header class="cat-hero {esc(theme)}">
          <div class="cat-hero-inner">
            <div class="cat-hero-badge"><span class="pulse-dot" aria-hidden="true"></span> {esc(page["badge"])}</div>
            <h1 class="cat-hero-title"><span class="cat-hero-icon" aria-hidden="true">{page["icon"]}</span>{esc(page["hero"])}</h1>
            <p class="cat-hero-sub">{esc(page["sub"])}</p>
            <div class="cat-hero-stats">{stats}
            </div>
          </div>
        </header>

        <div class="cat-toolbar">
          <div class="cat-chip-row" role="list">{chips}
          </div>
          <label class="cat-search">
            <span aria-hidden="true">🔎</span>
            <input id="cat-search" type="search" placeholder="Search markets..." aria-label="Search markets" />
          </label>
        </motion omitted>

{main_body}
      </section>

      <aside class="category-betslip" aria-label="Betslip">
        <div class="bs-shell">
          <div class="bs-head">Betslip</div>
          <div class="bs-empty"><div class="icon">📋</div><p>Select odds to build your slip.</p></div>
        </div>
      </aside>
    </main>

    <div id="cat-toast" class="cat-toast" role="status" aria-live="polite"></div>

    <script src="js/category.js"></script>
  </body>
</html>
""".replace("<motion omitted>", "div").replace("</motion omitted>", "</div>")


def main() -> None:
    for page in PAGES:
        path = ROOT / page["file"]
        path.write_text(render_page(page), encoding="utf-8")
        print(f"Wrote {path.name}")


if __name__ == "__main__":
    main()
