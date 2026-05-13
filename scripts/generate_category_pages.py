from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

MEGA_LINKS = [
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

SPORT_SUB_NAV = [
    ("football.html", "Football"),
    ("basketball.html", "Basketball"),
    ("tennis.html", "Tennis"),
    ("table-tennis.html", "Table Tennis"),
    ("ice-hockey.html", "Ice Hockey"),
    ("volleyball.html", "Volleyball"),
    ("more-sports.html", "More Sports"),
]

PAGES = {
    "aviator.html": {
        "title": "Aviator",
        "description": "Ride the multiplier curve on ERIBSBETS Aviator — cash out before the plane flies away.",
        "badge": "Crash multiplier live",
        "icon": "✈️",
        "accent": "#ff7043",
        "hero_a": "rgba(255, 112, 67, 0.28)",
        "hero_b": "rgba(255, 171, 0, 0.18)",
        "headline": "Climb the curve. Cash out before the crash.",
        "sub": "Fast rounds, social leaderboards, and instant mobile payouts on Nigeria's favourite crash game.",
        "stats": [("2.4M", "Rounds today"), ("14.8x", "Top multiplier"), ("₦2.1M", "Biggest win"), ("0.8s", "Avg cash-out")],
        "kind": "games",
        "chips": ["Classic Aviator", "Turbo", "High Roller", "Tournaments"],
        "cards": [
            ("✈️", "Aviator Classic", "The original curve with provably fair rounds and live stats."),
            ("🚀", "Turbo Aviator", "Shorter flights, faster multipliers, and rapid-fire sessions."),
            ("💎", "VIP Tables", "Higher limits, exclusive multipliers, and priority cash-outs."),
            ("🏆", "Daily Race", "Climb the leaderboard for boosted free-flight rewards."),
        ],
        "sidebar": [("Classic", "Live"), ("Turbo", "Live"), ("VIP", "12 seats"), ("Tournaments", "4 open")],
        "sub_nav": None,
        "active_mega": "aviator.html",
    },
    "live-casino.html": {
        "title": "Live Casino",
        "description": "Premium live dealer tables — roulette, blackjack, baccarat, and game shows on ERIBSBETS.",
        "badge": "HD dealers streaming",
        "icon": "🎲",
        "accent": "#d500f9",
        "hero_a": "rgba(213, 0, 249, 0.24)",
        "hero_b": "rgba(41, 121, 255, 0.16)",
        "headline": "Real dealers. Real tension. Real-time wins.",
        "sub": "Crystal-clear streams, professional hosts, and tables tuned for mobile play day and night.",
        "stats": [("38", "Live tables"), ("24/7", "Dealer shifts"), ("₦500", "Min stake"), ("4K", "VIP streams")],
        "kind": "games",
        "chips": ["Roulette", "Blackjack", "Baccarat", "Game Shows"],
        "cards": [
            ("🎡", "Lightning Roulette", "Multipliers light up the wheel on every spin."),
            ("🃏", "Infinite Blackjack", "Always a seat, side bets, and slick mobile controls."),
            ("🎴", "Speed Baccarat", "Fast deals, squeeze cams, and banker/player streaks."),
            ("🎤", "Crazy Time", "Bonus wheels, multipliers, and show-style entertainment."),
        ],
        "sidebar": [("Roulette", "11"), ("Blackjack", "9"), ("Baccarat", "8"), ("Game Shows", "6")],
        "sub_nav": [("Roulette", "#"), ("Blackjack", "#"), ("Baccarat", "#"), ("Game Shows", "#"), ("VIP", "#")],
        "active_mega": "live-casino.html",
    },
    "lucky-nums.html": {
        "title": "Lucky Nums",
        "description": "Pick lucky numbers, chase jackpots, and spin instant draws on ERIBSBETS Lucky Nums.",
        "badge": "Next draw in minutes",
        "icon": "🎱",
        "accent": "#ffab00",
        "hero_a": "rgba(255, 171, 0, 0.24)",
        "hero_b": "rgba(0, 230, 118, 0.14)",
        "headline": "Your numbers. Your moment. Your payout.",
        "sub": "Quick draws, lucky streaks, and jackpot pools that refresh around the clock.",
        "stats": [("6", "Draw types"), ("₦50M", "Jackpot pool"), ("3 min", "Draw cycle"), ("12", "Hot numbers")],
        "kind": "games",
        "chips": ["Power Draw", "Lucky 7", "Mega Pick", "Instant Spin"],
        "cards": [
            ("🎱", "Power Draw", "Pick six numbers and chase the nightly mega pool."),
            ("7️⃣", "Lucky 7", "Fast draws with boosted odds on repeating digits."),
            ("🎡", "Instant Spin", "One tap, one wheel, one shot at a multiplier."),
            ("💰", "Jackpot Club", "Opt in for shared prize boosts across every draw."),
        ],
        "sidebar": [("Power Draw", "Live"), ("Lucky 7", "Live"), ("Mega Pick", "Soon"), ("Instant Spin", "Live")],
        "sub_nav": [("Power Draw", "#"), ("Lucky 7", "#"), ("Mega Pick", "#"), ("Jackpots", "#")],
        "active_mega": "lucky-nums.html",
    },
    "betgames.html": {
        "title": "Betgames",
        "description": "TV-style betting games with live hosts, cards, wheels, and lucky balls on ERIBSBETS.",
        "badge": "Studio hosts on air",
        "icon": "🃏",
        "accent": "#2979ff",
        "hero_a": "rgba(41, 121, 255, 0.24)",
        "hero_b": "rgba(0, 230, 118, 0.12)",
        "headline": "Studio energy with betslip speed.",
        "sub": "Switch between wheels, cards, and lucky draws without leaving the same polished lobby.",
        "stats": [("9", "Game formats"), ("24/7", "Broadcast"), ("₦100", "Entry tables"), ("18", "Markets live")],
        "kind": "games",
        "chips": ["Lucky 7", "Wheel", "Poker", "War of Bets"],
        "cards": [
            ("🎡", "Lucky Wheel", "Colour sectors, multipliers, and rapid repeat betting."),
            ("🃏", "War of Bets", "Head-to-head card battles with simple side markets."),
            ("🎴", "Poker 6+", "Short-deck showdowns hosted in a TV studio layout."),
            ("🎱", "Lucky Ball", "Number draws with combo bets and streak trackers."),
        ],
        "sidebar": [("Lucky 7", "Live"), ("Wheel", "Live"), ("Poker", "Live"), ("War of Bets", "Live")],
        "sub_nav": [("Lucky 7", "#"), ("Wheel", "#"), ("Poker", "#"), ("Lucky Ball", "#")],
        "active_mega": "betgames.html",
    },
    "esports.html": {
        "title": "Esports",
        "description": "Bet on CS2, Valorant, Dota 2, League of Legends, and mobile esports on ERIBSBETS.",
        "badge": "Maps and match winners live",
        "icon": "🎮",
        "accent": "#00e5ff",
        "hero_a": "rgba(0, 229, 255, 0.22)",
        "hero_b": "rgba(156, 39, 176, 0.18)",
        "headline": "Arena odds for the games you already watch.",
        "sub": "Match winners, map handicaps, and live markets for the biggest esports calendars.",
        "stats": [("42", "Live events"), ("6", "Titles covered"), ("₦1K", "Min stake"), ("18", "Prop markets")],
        "kind": "fixtures",
        "chips": ["CS2", "Valorant", "Dota 2", "LoL", "Mobile"],
        "fixtures": [
            ("ESL Pro League", "Live • Map 2", "Team Vitality", "NAVI", ("1.72", "2.08", "—")),
            ("VCT Masters", "Starts 19:30", "Sentinels", "Paper Rex", ("1.95", "1.86", "—")),
            ("The International", "Live • Game 3", "Team Spirit", "OG", ("1.64", "2.22", "—")),
            ("LEC Finals", "Tonight", "G2 Esports", "Fnatic", ("1.88", "1.92", "—")),
        ],
        "sidebar": [("CS2", "14"), ("Valorant", "9"), ("Dota 2", "7"), ("LoL", "6"), ("Mobile", "6")],
        "sub_nav": [("Live", "#"), ("Upcoming", "#"), ("Outrights", "#"), ("Favourites", "#")],
        "active_mega": "esports.html",
    },
    "promos.html": {
        "title": "Promos",
        "description": "Welcome boosts, acca insurance, cashback, and seasonal offers on ERIBSBETS.",
        "badge": "Fresh offers weekly",
        "icon": "🎁",
        "accent": "#00e676",
        "hero_a": "rgba(0, 230, 118, 0.24)",
        "hero_b": "rgba(255, 171, 0, 0.16)",
        "headline": "Boosts built for winners, not fine print.",
        "sub": "Claim tailored rewards across sports, casino, and crash games with transparent terms.",
        "stats": [("12", "Active offers"), ("200%", "Welcome boost"), ("₦25K", "Weekly cashback"), ("5", "VIP tiers")],
        "kind": "promos",
        "chips": ["Welcome", "Sports", "Casino", "VIP"],
        "promos": [
            ("Welcome Flight", "200% first deposit boost up to ₦100,000 on Aviator and sports.", "Claim boost"),
            ("Acca Shield", "Five-fold or more? Get money back if one leg lets you down.", "Build acca"),
            ("Casino Nights", "Free spins and live casino chips every Friday for active players.", "View schedule"),
            ("VIP Lounge", "Priority withdrawals, personal host, and invite-only leaderboard prizes.", "See tiers"),
        ],
        "sidebar": [("Welcome", "Open"), ("Sports", "4"), ("Casino", "3"), ("VIP", "Invite")],
        "sub_nav": [("All offers", "#"), ("Sports", "#"), ("Casino", "#"), ("VIP", "#")],
        "active_mega": "promos.html",
    },
    "football.html": {
        "title": "Football",
        "description": "Premier League, La Liga, Serie A, Champions League, and local football odds on ERIBSBETS.",
        "badge": "Match odds updating live",
        "icon": "⚽",
        "accent": "#00e676",
        "hero_a": "rgba(0, 230, 118, 0.22)",
        "hero_b": "rgba(41, 121, 255, 0.14)",
        "headline": "Every league. Every angle. Every kick-off.",
        "sub": "Build singles and accas across Europe's top flights plus Nigeria's biggest local fixtures.",
        "stats": [("186", "Open markets"), ("38", "Leagues"), ("Live", "In-play"), ("₦100", "Min stake")],
        "kind": "fixtures",
        "chips": ["Premier League", "La Liga", "UCL", "NPFL", "Outrights"],
        "fixtures": [
            ("Premier League", "Today 17:30", "Arsenal", "Chelsea", ("2.10", "3.40", "3.25")),
            ("La Liga", "Today 20:00", "Real Madrid", "Barcelona", ("2.35", "3.55", "2.90")),
            ("Serie A", "Tomorrow", "Inter", "AC Milan", ("2.05", "3.30", "3.60")),
            ("NPFL", "Saturday", "Enyimba", "Rangers", ("2.18", "3.10", "3.15")),
        ],
        "sidebar": [("Premier League", "24"), ("La Liga", "18"), ("UCL", "16"), ("NPFL", "9")],
        "sub_nav": SPORT_SUB_NAV,
        "active_mega": "football.html",
        "active_sub": "football.html",
    },
    "basketball.html": {
        "title": "Basketball",
        "description": "NBA, EuroLeague, and international basketball betting with spreads and player props.",
        "badge": "Quarter lines live",
        "icon": "🏀",
        "accent": "#ff9100",
        "hero_a": "rgba(255, 145, 0, 0.24)",
        "hero_b": "rgba(255, 61, 87, 0.14)",
        "headline": "From tip-off buzzer beaters to quarter spreads.",
        "sub": "Track NBA pace, EuroLeague grinds, and player props with fast-moving live lines.",
        "stats": [("64", "Open games"), ("NBA", "Featured"), ("12", "Prop markets"), ("Live", "Quarters")],
        "kind": "fixtures",
        "chips": ["NBA", "EuroLeague", "NBL", "Player props"],
        "fixtures": [
            ("NBA", "Tonight 01:00", "Lakers", "Celtics", ("1.92", "—", "1.90")),
            ("NBA", "Tonight 03:30", "Warriors", "Nuggets", ("2.05", "—", "1.78")),
            ("EuroLeague", "Friday", "Real Madrid", "Olympiacos", ("1.74", "—", "2.08")),
            ("NBL", "Sunday", "Sydney", "Melbourne", ("1.86", "—", "1.96")),
        ],
        "sidebar": [("NBA", "22"), ("EuroLeague", "12"), ("NBL", "6"), ("Props", "18")],
        "sub_nav": SPORT_SUB_NAV,
        "active_mega": "basketball.html",
        "active_sub": "basketball.html",
    },
    "tennis.html": {
        "title": "Tennis",
        "description": "ATP, WTA, and Grand Slam tennis markets with set betting and live points.",
        "badge": "Set winners in play",
        "icon": "🎾",
        "accent": "#c6ff00",
        "hero_a": "rgba(198, 255, 0, 0.18)",
        "hero_b": "rgba(0, 230, 118, 0.12)",
        "headline": "Serve, rally, cash out on every set.",
        "sub": "From hard courts to clay swings, follow live momentum with game and set markets.",
        "stats": [("48", "Live matches"), ("ATP/WTA", "Tours"), ("Set", "Betting"), ("Live", "Points")],
        "kind": "fixtures",
        "chips": ["ATP", "WTA", "Grand Slams", "Challengers"],
        "fixtures": [
            ("ATP 500", "Live • Set 2", "Alcaraz", "Sinner", ("1.78", "—", "2.02")),
            ("WTA 1000", "Today", "Swiatek", "Sabalenka", ("1.95", "—", "1.86")),
            ("ATP Masters", "Tomorrow", "Djokovic", "Medvedev", ("1.88", "—", "1.94")),
            ("Roland Garros", "Outright", "Alcaraz", "Field", ("3.20", "—", "—")),
        ],
        "sidebar": [("ATP", "21"), ("WTA", "17"), ("Grand Slams", "8"), ("Challengers", "6")],
        "sub_nav": SPORT_SUB_NAV,
        "active_mega": "tennis.html",
        "active_sub": "tennis.html",
    },
    "table-tennis.html": {
        "title": "Table Tennis",
        "description": "Fast table tennis markets with live set scores and rapid in-play updates.",
        "badge": "Set markets refreshing",
        "icon": "🏓",
        "accent": "#18ffff",
        "hero_a": "rgba(24, 255, 255, 0.18)",
        "hero_b": "rgba(41, 121, 255, 0.14)",
        "headline": "Lightning rallies. Lightning odds.",
        "sub": "Follow TT Cup, Elite Series, and international matchups with near-instant line moves.",
        "stats": [("72", "Matches today"), ("11", "Tournaments"), ("Set", "Handicaps"), ("Live", "Points")],
        "kind": "fixtures",
        "chips": ["TT Cup", "Elite Series", "Set betting", "Live"],
        "fixtures": [
            ("TT Cup", "Live • Set 4", "Kallinikos", "Pucar", ("1.62", "—", "2.24")),
            ("Elite Series", "Live • Set 2", "Lebedev", "Gorban", ("1.88", "—", "1.90")),
            ("TT Cup", "In 12 min", "Jang", "Lim", ("1.74", "—", "2.06")),
            ("International", "Tonight", "Korea A", "Japan A", ("1.96", "—", "1.82")),
        ],
        "sidebar": [("TT Cup", "28"), ("Elite Series", "19"), ("International", "14"), ("Live", "31")],
        "sub_nav": SPORT_SUB_NAV,
        "active_mega": "table-tennis.html",
        "active_sub": "table-tennis.html",
    },
    "ice-hockey.html": {
        "title": "Ice Hockey",
        "description": "NHL, KHL, and international hockey betting with period lines and puck lines.",
        "badge": "Period markets live",
        "icon": "🏒",
        "accent": "#40c4ff",
        "hero_a": "rgba(64, 196, 255, 0.22)",
        "hero_b": "rgba(255, 255, 255, 0.08)",
        "headline": "Cold ice. Hot lines.",
        "sub": "Track NHL pace, power-play props, and regulation-time markets across the season.",
        "stats": [("26", "Open games"), ("NHL", "Featured"), ("Period", "Lines"), ("Live", "Puck line")],
        "kind": "fixtures",
        "chips": ["NHL", "KHL", "Period 1", "Puck line"],
        "fixtures": [
            ("NHL", "Tonight", "Maple Leafs", "Canadiens", ("1.84", "4.10", "3.55")),
            ("NHL", "Tonight", "Rangers", "Bruins", ("2.02", "3.95", "3.20")),
            ("KHL", "Tomorrow", "CSKA", "SKA", ("1.92", "4.20", "3.30")),
            ("NHL", "Saturday", "Oilers", "Avalanche", ("2.14", "3.80", "3.05")),
        ],
        "sidebar": [("NHL", "18"), ("KHL", "8"), ("Period lines", "Live"), ("Outrights", "4")],
        "sub_nav": SPORT_SUB_NAV,
        "active_mega": "ice-hockey.html",
        "active_sub": "ice-hockey.html",
    },
    "volleyball.html": {
        "title": "Volleyball",
        "description": "Indoor and beach volleyball betting with set handicaps and live point trading.",
        "badge": "Set handicaps live",
        "icon": "🏐",
        "accent": "#ff4081",
        "hero_a": "rgba(255, 64, 129, 0.22)",
        "hero_b": "rgba(255, 171, 0, 0.12)",
        "headline": "Spikes, blocks, and set-by-set value.",
        "sub": "Follow national leagues, Champions League volleyball, and beach tours with live set scores.",
        "stats": [("34", "Matches today"), ("Set", "Handicaps"), ("Beach", "Tour"), ("Live", "Points")],
        "kind": "fixtures",
        "chips": ["Champions League", "National leagues", "Beach tour", "Live"],
        "fixtures": [
            ("CEV Champions", "Live • Set 3", "Lube", "Perugia", ("1.76", "—", "2.04")),
            ("Brazil Superliga", "Today", "Sada", "Minas", ("1.88", "—", "1.92")),
            ("Beach Pro Tour", "Tomorrow", "Mol/Sørum", "Herrera/Gavira", ("1.70", "—", "2.12")),
            ("Poland PlusLiga", "Friday", "Jastrzębie", "ZAKSA", ("2.08", "—", "1.74")),
        ],
        "sidebar": [("Champions League", "10"), ("National leagues", "14"), ("Beach tour", "6"), ("Live", "12")],
        "sub_nav": SPORT_SUB_NAV,
        "active_mega": None,
        "active_sub": "volleyball.html",
    },
    "more-sports.html": {
        "title": "More Sports",
        "description": "Cricket, rugby, MMA, boxing, darts, snooker, and specialty markets on ERIBSBETS.",
        "badge": "Specialty markets hub",
        "icon": "🏟️",
        "accent": "#b388ff",
        "hero_a": "rgba(179, 136, 255, 0.22)",
        "hero_b": "rgba(0, 230, 118, 0.12)",
        "headline": "Every sport deserves a sharp line.",
        "sub": "Jump into cricket, combat sports, motorsport, and more without leaving the same polished lobby.",
        "stats": [("18", "Sports"), ("120+", "Daily events"), ("Outrights", "Season"), ("Live", "Where available")],
        "kind": "games",
        "chips": ["Cricket", "Rugby", "MMA", "Motorsport", "Darts"],
        "cards": [
            ("🏏", "Cricket", "IPL, Tests, T20, and player performance specials."),
            ("🥊", "Combat", "UFC, boxing, and round/group betting markets."),
            ("🏉", "Rugby", "Union and league with handicap and total points."),
            ("🏎️", "Motorsport", "Formula 1, MotoGP, and outright winner markets."),
        ],
        "sidebar": [("Cricket", "22"), ("Combat", "11"), ("Rugby", "9"), ("Motorsport", "7")],
        "sub_nav": SPORT_SUB_NAV,
        "active_mega": None,
        "active_sub": "more-sports.html",
    },
}


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def mega_menu(active: str | None) -> str:
    lines = ['<motion-placeholder>']
    lines = []
    for href, icon, label in MEGA_LINKS:
        current = ' aria-current="page"' if active == href else ""
        lines.append(
            f'                <a href="{esc(href)}" role="menuitem"{current}>'
            f'<span class="icon">{icon}</span><span>{esc(label)}</span></a>'
        )
    return "\n".join(lines)


def sub_nav(items: list[tuple[str, str]] | None, active: str | None) -> str:
    if not items:
        return ""
    lis = []
    for href, label in items:
        cls = ' class="active"' if active == href else ""
        lis.append(f'          <li{cls}><a href="{esc(href)}">{esc(label)}</a></li>')
    return f"""      <nav class="sub-nav" aria-label="Category navigation">
        <ul>
{chr(10).join(lis)}
        </ul>
      </nav>"""


def render_cards(cards: list[tuple[str, str, str]]) -> str:
    blocks = []
    for icon, title, copy in cards:
        blocks.append(
            f"""          <article class="cat-card">
            <span class="cat-card-icon" aria-hidden="true">{icon}</span>
            <h3>{esc(title)}</h3>
            <p>{esc(copy)}</p>
            <button class="cat-play" type="button">Play now</button>
          </article>"""
        )
    return "\n".join(blocks)


def render_promos(promos: list[tuple[str, str, str]]) -> str:
    blocks = []
    for title, copy, cta in promos:
        blocks.append(
            f"""          <article class="cat-promo">
            <motion-placeholder>
            <motion-placeholder>
            <div>
              <h3>{esc(title)}</h3>
              <p>{esc(copy)}</p>
            </motion-placeholder>
            </div>
            <button class="cat-promo-cta" type="button">{esc(cta)}</button>
          </article>""".replace("<motion-placeholder>", "").replace("</motion-placeholder>", "").replace("</motion-placeholder>", "")
        )
    return "\n".join(blocks)


def slug_id(*parts: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", "-".join(parts).lower())).strip("-")


def betslip_aside() -> str:
    return """      <aside class="category-betslip" aria-label="Betslip">
        <div class="betslip-container">
          <div class="bs-tabs">
            <button class="bs-tab active" data-tab="betslip" type="button">
              Betslip <span class="badge zero" id="desktop-badge">0</span>
            </button>
            <button class="bs-tab" data-tab="history" type="button">History</button>
          </div>
          <div id="panel-betslip">
            <div class="bs-body" id="bs-body">
              <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>Your betslip is empty</p>
                <p class="hint">Select odds to add them here.</p>
              </div>
            </div>
            <div class="bs-footer" id="bs-footer" style="display: none">
              <div class="stake-presets">
                <button class="preset-btn" data-stake="100" type="button">₦100</button>
                <button class="preset-btn" data-stake="500" type="button">₦500</button>
                <button class="preset-btn" data-stake="1000" type="button">₦1K</button>
                <button class="preset-btn" data-stake="5000" type="button">₦5K</button>
              </div>
              <div class="stake-row">
                <span>Stake Amount</span><strong id="stake-display">₦100.00</strong>
              </div>
              <input type="range" id="stake-slider" min="100" max="100000" step="100" value="100" aria-label="Stake slider" />
              <div class="stake-input-row">
                <input type="number" id="stake-input" min="100" max="10000000" value="100" aria-label="Stake amount input" />
              </div>
              <div class="odds-row">
                <span>Total Odds</span><span class="odds-val" id="total-odds">0.00</span>
              </div>
              <div class="return-row">
                <span>Potential Return</span><span class="return-val" id="potential-return">₦0.00</span>
              </div>
              <button class="place-btn" id="place-bet-btn" type="button">PLACE BET</button>
              <p class="rg-note">Please gamble responsibly. 18+ only. T&amp;Cs apply.</p>
            </div>
          </div>
          <div id="panel-history" style="display: none">
            <div class="history-hdr">
              <span>Recent Bets</span>
              <button class="clear-hist-btn" id="clear-history-btn" type="button">Clear All</button>
            </div>
            <div class="history-list" id="history-list"></div>
          </div>
        </div>
      </aside>"""


def bet_receipt_modal() -> str:
    return """    <div id="bet-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="bet-modal-title">
      <div class="modal">
        <div class="modal-icon">✅</div>
        <h2 id="bet-modal-title">Bet Placed!</h2>
        <p>Your bet has been placed successfully. Good luck!</p>
        <div id="bet-details-content" class="bet-details-box"></div>
        <div class="booking-box">
          <span class="booking-label">Booking Code</span>
          <div class="booking-code-row">
            <span class="booking-code-val" id="booking-code-val">ER-XXXXX</span>
            <button class="copy-btn" id="copy-code-btn" type="button">Copy</button>
          </div>
        </div>
        <button class="modal-btn" id="close-bet-modal-btn" type="button">Done</button>
      </div>
    </div>"""


def render_fixtures(fixtures: list[tuple[str, str, str, str, tuple[str, str, str]]]) -> str:
    blocks = []
    for league, meta, home, away, odds in fixtures:
        labels = ("Home", "Draw", "Away")
        match_name = f"{home} vs {away}"
        match_id = slug_id(league, home, away)
        available = [(label, value) for label, value in zip(labels, odds) if value != "—"]
        if len(available) == 2:
            available = [("Home", available[0][1]), ("Away", available[1][1])]
        odd_buttons = [
            (
                f'<button class="cat-odd" type="button" data-match-id="{esc(match_id)}" '
                f'data-match-name="{esc(match_name)}" data-outcome="{esc(label)}" data-price="{esc(value)}">'
                f"<small>{label}</small>{esc(value)}</button>"
            )
            for label, value in available
        ]
        blocks.append(
            f"""          <article class="cat-fixture">
            <div>
              <div class="cat-fixture-meta"><span class="cat-league-pill">{esc(league)}</span><span>{esc(meta)}</span></div>
              <div class="cat-teams"><span>{esc(home)}</span><span>{esc(away)}</span></div>
            </div>
            <div class="cat-odds-row">{''.join(odd_buttons)}</div>
          </article>"""
        )
    return "\n".join(blocks)


def render_sidebar(items: list[tuple[str, str]]) -> str:
    lis = []
    for label, count in items:
        lis.append(
            f"            <li><span>{esc(label)}</span><span class=\"count\">{esc(count)}</span></li>"
        )
    return "\n".join(lis)


def render_page(filename: str, data: dict) -> str:
    active_mega = data.get("active_mega")
    active_sub = data.get("active_sub")
    sub_nav_html = sub_nav(data.get("sub_nav"), active_sub)
    chips = "".join(
        f'<button class="cat-chip{" active" if i == 0 else ""}" type="button">{esc(chip)}</button>'
        for i, chip in enumerate(data["chips"])
    )

    if data["kind"] == "fixtures":
        main_panel = f"""        <section class="cat-panel" aria-label="Featured markets">
          <motion-placeholder>
          <motion-placeholder>
          <div class="cat-panel-head">
            <h2>Featured markets</h2>
            <span>Updated moments ago</span>
          </div>
{render_fixtures(data["fixtures"])}
        </section>""".replace("<motion-placeholder>", "").replace("</motion-placeholder>", "")
    elif data["kind"] == "promos":
        main_panel = f"""        <section class="cat-panel" aria-label="Active promotions">
          <div class="cat-panel-head">
            <h2>Active promotions</h2>
            <span>Limited-time boosts</span>
          </div>
          <motion-placeholder>
          <div class="cat-promo-stack">
{render_promos(data["promos"])}
          </div>
        </section>""".replace("<motion-placeholder>", "").replace("</motion-placeholder>", "")
    else:
        main_panel = f"""        <section class="cat-panel" aria-label="Featured experiences">
          <div class="cat-panel-head">
            <h2>Featured experiences</h2>
            <span>Curated for ERIBSBETS players</span>
          </div>
          <div class="cat-card-grid">
{render_cards(data["cards"])}
          </div>
        </section>"""

    stats = "".join(
        f"""            <motion-placeholder>
            <div class="cat-stat">
              <span class="cat-stat-val">{esc(value)}</span>
              <span class="cat-stat-label">{esc(label)}</span>
            </div>""".replace("<motion-placeholder>", "").replace("</motion-placeholder>", "")
        for value, label in data["stats"]
    )

    style = (
        f"--cat-accent: {data['accent']}; --cat-hero-a: {data['hero_a']}; --cat-hero-b: {data['hero_b']};"
    )

    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>ERIBSBETS — {esc(data['title'])}</title>
    <meta name="description" content="{esc(data['description'])}" />
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
          <span class="ticker-label">⚡ NOW</span>
          <div class="ticker-scroll">
            <motion-placeholder>
            <div class="ticker-inner">
              <span class="ticker-item"><span class="t-score">{esc(data['title'])}</span> markets are live</span>
              <span class="ticker-item">Boosted accas on featured fixtures</span>
              <span class="ticker-item">Fast cash-out available on selected events</span>
              <span class="ticker-item"><span class="t-score">{esc(data['title'])}</span> markets are live</span>
              <span class="ticker-item">Boosted accas on featured fixtures</span>
              <span class="ticker-item">Fast cash-out available on selected events</span>
            </div>
          </div>
        </div>
        <div class="auth-row desktop-auth">
          <div class="auth-field">
            <span class="prefix">+234</span>
            <input type="tel" placeholder="Mobile Number" maxlength="11" aria-label="Mobile number" />
          </div>
          <div class="auth-field">
            <input type="password" placeholder="Password" aria-label="Password" />
          </div>
          <a href="#" class="forgot-link">Forgot?</a>
          <a href="login.html" class="btn btn-login">Login</a>
          <a href="login.html" class="btn btn-register">Register</a>
        </div>
        <a href="login.html" class="mobile-auth-btn">Login / Register</a>
      </header>

      <nav class="main-nav" aria-label="Main navigation">
        <motion-placeholder>
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
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <motion-placeholder>
            <div class="mega-menu" id="mega-menu" role="menu">
              <div class="mega-grid">
{mega_menu(active_mega)}
              </div>
            </div>
          </div>
        </div>
      </nav>
{sub_nav_html}
    </div>

    <main class="category-page" style="{style}">
      <aside class="category-sidebar" aria-label="Category overview">
        <div class="cat-side-card">
          <h3>Highlights</h3>
          <ul class="cat-side-list">
{render_sidebar(data['sidebar'])}
          </ul>
        </div>
        <div class="cat-side-card">
          <h3>Quick links</h3>
          <ul class="cat-side-list">
            <li><a href="live.html">Live betting</a><span class="count">Open</span></li>
            <li><a href="promos.html">Promotions</a><span class="count">12</span></li>
            <li><a href="virtuals.html">Virtuals</a><span class="count">24/7</span></li>
          </ul>
        </div>
      </aside>

      <section class="category-main" aria-label="{esc(data['title'])}">
        <section class="cat-hero">
          <div class="cat-hero-top">
            <div>
              <div class="cat-badge"><span class="cat-badge-dot"></span>{esc(data['badge'])}</motion-placeholder>
              </div>
              <h1>{esc(data['headline'])}</h1>
              <p>{esc(data['sub'])}</p>
            </div>
            <span class="cat-hero-icon" aria-hidden="true">{data['icon']}</span>
          </div>
          <div class="cat-stats">
{stats}
          </div>
        </section>

        <div class="cat-chip-row" aria-label="Filters">
{chips}
        </div>

{main_panel}
      </section>

{betslip_aside()}
    </main>

{bet_receipt_modal()}
    <div id="cat-toast" class="cat-toast" role="status" aria-live="polite"></div>
    <script src="js/category.js"></script>
  </body>
</html>
""".replace("<motion-placeholder>", "").replace("</motion-placeholder>", "")


def main() -> None:
    for filename, data in PAGES.items():
        (ROOT / filename).write_text(render_page(filename, data), encoding="utf-8")
    print(f"Generated {len(PAGES)} pages in {ROOT}")


if __name__ == "__main__":
    main()
