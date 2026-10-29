import html
from data import SECTIONS, UI, ALLERGENS

E = html.escape

BASE_CSS = """
@import url(fonts/fonts.css);
:root{--cream:#fbf7ef;--purple:#4a1e6b;--purple2:#5b2d80;--gold:#c39a45;--gold2:#d9b86a;--ink:#2b2233;--mute:#7a7080;}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--cream);color:var(--ink);font-family:Manrope,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;overflow:hidden;background:var(--cream);break-after:page}
.page:last-child{break-after:auto}
.cols{display:flex;height:100%}
.col{overflow:hidden;display:flex;flex-direction:column}
.sec{break-inside:avoid}
.sec h2{font-family:'Cormorant Garamond',serif;font-weight:600;color:var(--purple);text-transform:uppercase;letter-spacing:.12em;line-height:1}
.sec h2 .alt{font-style:italic;text-transform:none;letter-spacing:0;color:var(--gold);font-weight:500;margin-left:.45em}
.sec .rule{height:1px;background:linear-gradient(90deg,var(--gold),rgba(195,154,69,.15))}
.it .row{display:flex;align-items:baseline;gap:.4em}
.it .nm{font-weight:600;color:var(--ink);white-space:nowrap;letter-spacing:.01em}
.it .dots{flex:1;border-bottom:1px dotted rgba(122,112,128,.55);transform:translateY(-.25em);min-width:1em}
.it .pr{font-weight:700;color:var(--purple);white-space:nowrap}
.it .sub{font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold);font-weight:500}
.it .ds{color:var(--mute);font-weight:400}
.brandmark{font-family:'Cinzel',serif;letter-spacing:.35em;color:var(--gold);text-align:center}
"""


def price(p):
    return f"{p}&nbsp;₺"


def item_html(it, lang, mode):
    name = it[lang]
    if mode == "single":
        # Under EN/RU names show the Turkish name so guests can order from Turkish staff.
        sub = it["tr"] if lang != "tr" and it["tr"].lower() != name.lower() else ""
        desc = it["desc"][lang] if it["desc"] else ""
    else:  # trilingual signboard
        alts = []
        for l in ("en", "ru"):
            if it[l].lower() != name.lower() and it[l] not in alts:
                alts.append(it[l])
        sub = " · ".join(alts)
        desc = it["desc"]["tr"] if it["desc"] else ""
    out = f'<div class="it"><div class="row"><span class="nm">{E(name)}</span><span class="dots"></span><span class="pr">{price(it["price"])}</span></div>'
    if mode == "single":
        u = UI[lang]
        kcal = f'{it["kcal"]} {u["kcal"]}' if it["kcal"] is not None else u["varies"]
        badges = "".join(f'<span class="ab">{n}</span>' for n in it["alg"])
        sub_html = f'<span class="sub">{E(sub)}</span>' if sub else ""
        out += f'<div class="meta">{sub_html}<span class="kc">◆ {E(kcal)}</span>{badges}</div>'
    elif sub:
        out += f'<div class="sub">{E(sub)}</div>'
    if desc:
        out += f'<div class="ds">{E(desc)}</div>'
    return out + "</div>"


def section_html(key, lang, mode):
    s = SECTIONS[key]
    title = s["title"][lang]
    if mode == "single":
        alt = ""
    else:
        alts = [s["title"][l] for l in ("en", "ru") if s["title"][l].lower() != title.lower()]
        alt = " · ".join(dict.fromkeys(alts))
    h = f'<h2>{E(title)}' + (f'<span class="alt">{E(alt)}</span>' if alt else "") + "</h2>"
    items = "".join(item_html(it, lang, mode) for it in s["items"])
    return f'<div class="sec">{h}<div class="rule"></div><div class="items">{items}</div></div>'


# ---------------------------------------------------------------- folding paper menu
# Bi-fold: printed on a 28x42 cm sheet (both sides), folded down the middle to 14x42 cm.
# Sheet 1 (outside): back cover | front cover. Sheet 2 (inside): kitchen & coffee | drinks.

PAPER_CSS = """
@page{size:280mm 420mm;margin:0}
.sheet{width:280mm;height:420mm;display:flex;break-after:page;overflow:hidden}
.sheet:last-child{break-after:auto}
.page{width:140mm;height:420mm;flex:none;display:flex;flex-direction:column;break-after:auto}
.frame{position:absolute;inset:4mm;border:1px solid var(--gold);pointer-events:none}
.frame2{position:absolute;inset:5.6mm;border:1px solid rgba(195,154,69,.4);pointer-events:none}
.cols{flex:1;min-height:0;height:auto;padding:7mm 11mm 6mm;gap:7mm}
.col{flex:1 1 0;gap:7.5mm}
.sec h2{font-size:13pt;margin-bottom:1.3mm}
.sec .rule{margin-bottom:1.8mm}
.items{display:flex;flex-direction:column;gap:2.6mm}
.col.food .items{gap:3.6mm}
.it .nm{font-size:8.6pt;white-space:normal;min-width:0}
.it .pr{font-size:8.6pt}
.it .sub{font-size:8.6pt;line-height:1;margin-top:0}
.it .ds{font-size:7pt;line-height:1.3;margin-top:.4mm}
.topline{text-align:center;font-size:5.6pt;letter-spacing:.4em;color:var(--gold);padding-top:9mm}
.head{display:flex;flex-direction:column;align-items:center;text-align:center;padding:12mm 0 7mm;margin:0 11mm;border-bottom:1px solid var(--gold)}
.head img{width:44mm}
.head .mn{font-family:'Cormorant Garamond',serif;font-weight:500;color:var(--purple);font-size:32pt;letter-spacing:.32em;margin:4mm 0 0 .32em;line-height:1}
.head .tg{font-size:6.4pt;letter-spacing:.32em;color:var(--ink);margin-top:3mm}
.band{height:26mm;flex:none;background:var(--purple);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.2mm}
.band .ig{font-size:7pt;letter-spacing:.3em;color:#f3e7c9}
.band .ct{font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold2);font-size:11pt}
.band .st{color:var(--gold2);font-size:8pt}
.notes{margin:0 11mm;border-top:1px solid var(--gold);padding-top:2.6mm;display:flex;flex-direction:column;gap:1.3mm;font-size:6.6pt;color:var(--mute);line-height:1.35}
.notes span{color:var(--gold)}
.meta{display:flex;flex-wrap:wrap;align-items:center;column-gap:1.3mm;row-gap:.3mm;margin-top:.2mm}
.meta .sub{margin:0}
.meta .kc{font-size:6.4pt;color:var(--mute);white-space:nowrap}
.ab{display:inline-flex;align-items:center;justify-content:center;min-width:3.1mm;padding:0 .4mm;height:3.1mm;border:.6pt solid var(--purple);border-radius:1.6mm;font-size:5pt;font-weight:600;color:var(--purple)!important;line-height:1}
.notes .lgh{font-family:'Cormorant Garamond',serif;font-weight:600;color:var(--purple);text-transform:uppercase;letter-spacing:.12em;font-size:10.5pt}
.notes .lg{display:grid;grid-template-columns:repeat(3,1fr);gap:1.1mm 3mm;margin-bottom:1.8mm}
.notes .lg div{display:flex;align-items:center;gap:1.3mm;color:var(--ink)}
.notes .nl{display:flex;flex-direction:column;gap:1mm}
.page .band{position:relative;z-index:1}

.inner-r .cols{padding-top:5mm}
.backc .mid{margin:auto 0;display:flex;flex-direction:column;gap:14mm}
.backc .top{display:flex;flex-direction:column;align-items:center;gap:4mm}
.backc .top img{width:52mm}
.backc .top .ig{font-size:7.4pt;letter-spacing:.32em;color:var(--purple)}
.backc .notes{font-size:7.2pt;gap:1.6mm}
.backc .notes .lgh{font-size:12pt}
.backc .notes .lg{grid-template-columns:repeat(2,1fr);gap:2mm 4mm;margin-bottom:3mm}
.backc .notes .ab{min-width:3.6mm;height:3.6mm;font-size:5.6pt}
.front{background:var(--purple);align-items:center;justify-content:center;text-align:center;position:relative}
.front .f1{position:absolute;inset:6mm;border:1.2pt solid var(--gold)}
.front .f2{position:absolute;inset:8.2mm;border:.6pt solid rgba(217,184,106,.55)}
.front .orb{position:absolute;left:0;top:0;width:140mm;height:420mm}
.front .logo{width:104mm;position:relative}
.front .mn{font-family:'Cormorant Garamond',serif;font-weight:500;color:#f6ecd6;font-size:44pt;letter-spacing:.34em;margin:16mm 0 0 .34em;line-height:1;position:relative}
.front .ml{font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold2);font-size:15pt;margin-top:4mm;position:relative}
.front .tg{font-size:7.4pt;letter-spacing:.38em;color:#e9dcc0;margin-top:7mm;position:relative}
.front .st{color:var(--gold2);font-size:12pt;margin:14mm 0 0;position:relative}
.front .bt{position:absolute;bottom:22mm;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:2mm}
.front .bt .ig{font-size:7.4pt;letter-spacing:.32em;color:#f3e7c9}
.front .bt .ct{font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold2);font-size:13pt}
.front .corner{position:absolute;width:12mm;height:12mm;border-color:var(--gold2);border-style:solid;border-width:0}
"""

ORB = """<svg class="orb" viewBox="0 0 140 420" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" fill="none">
<ellipse cx="70" cy="168" rx="92" ry="20" transform="rotate(-12 70 168)" stroke="#d9b86a" stroke-opacity=".55" stroke-width=".35"/>
<ellipse cx="70" cy="172" rx="104" ry="27" transform="rotate(-8 70 172)" stroke="#d9b86a" stroke-opacity=".3" stroke-width=".25"/>
<ellipse cx="70" cy="164" rx="80" ry="14" transform="rotate(-16 70 164)" stroke="#f6ecd6" stroke-opacity=".18" stroke-width=".25"/>
<circle cx="24" cy="120" r=".7" fill="#d9b86a"/><circle cx="118" cy="214" r=".9" fill="#d9b86a"/>
<circle cx="110" cy="96" r=".5" fill="#f6ecd6" fill-opacity=".6"/><circle cx="30" cy="236" r=".5" fill="#f6ecd6" fill-opacity=".6"/>
</svg>"""


def band(lang):
    return f'<div class="band"><div class="st">✦</div><div class="ig">@GODZ_ALANYA</div><div class="ct">{E(UI[lang]["city"])}</div></div>'


def notes(lang):
    u = UI[lang]
    legend = "".join(f'<div><span class="ab">{i}</span>{E(n)}</div>' for i, n in enumerate(ALLERGENS[lang], 1))
    lines = "".join(f'<div><span>✦</span> {E(u[k])}</div>' for k in ("kcalnote", "allergy", "vat"))
    return (f'<div class="notes"><div class="lgh">{E(u["allergens"])}</div><div class="lg">{legend}</div>'
            f'<div class="nl">{lines}</div></div>')


FRAMES = '<div class="frame"></div><div class="frame2"></div>'


def front_cover(lang):
    u = UI[lang]
    return f"""<div class="page front">{ORB}<div class="f1"></div><div class="f2"></div>
<img class="logo" src="godz-logo-light.svg" alt="GODZ Cafe">
<div class="mn">{E(u['menu'])}</div><div class="tg">{E(u['tagline'])}</div><div class="st">✦</div>
<div class="bt"><div class="ig">@GODZ_ALANYA</div><div class="ct">{E(u['city'])}</div></div></div>"""


def back_cover(lang):
    return (f'<div class="page backc"><div class="mid"><div class="top"><img src="godz-logo.svg" alt="GODZ Cafe">'
            f'<div class="ig">@GODZ_ALANYA</div></div>{notes(lang)}</div>{band(lang)}{FRAMES}</div>')


INSIDE = [
    [("food", ["doner", "soup_salad", "sides", "dessert"]), ("", ["hot_coffee", "iced_coffee", "frappe"])],
    [("", ["hot_drinks", "matcha", "milkshake", "juices"]), ("", ["soft", "frozen", "lemonade", "mojito"])],
]


def inside_panel(lang, cols, left):
    body = "".join(f'<div class="col {cls}">' + "".join(section_html(k, lang, "single") for k in keys) + "</div>"
                   for cls, keys in cols)
    head = ('<div class="head"><img src="godz-logo.svg" alt="GODZ Cafe"></div>' if left
            else '<div class="topline">GODZ ✦ CAFE</div>')
    cls = "inner-l" if left else "inner-r"
    return f'<div class="page {cls}">{head}<div class="cols">{body}</div>{band(lang)}{FRAMES}</div>'


def paper(lang):
    outside = f'<div class="sheet">{back_cover(lang)}{front_cover(lang)}</div>'
    inside = f'<div class="sheet">{inside_panel(lang, INSIDE[0], True)}{inside_panel(lang, INSIDE[1], False)}</div>'
    return f'<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><style>{BASE_CSS}{PAPER_CSS}</style></head><body>{outside}{inside}</body></html>'


# ---------------------------------------------------------------- signboard (tabela)

SIGN_CSS = """
@page{size:1434pt 1434pt;margin:0}
.page{width:1434pt;height:1434pt;display:flex;flex-direction:column}
.frame{position:absolute;inset:26pt;border:1.5pt solid var(--gold);pointer-events:none}
.head{display:flex;align-items:center;justify-content:center;gap:44pt;padding:62pt 0 30pt;margin:0 64pt;border-bottom:1.5pt solid var(--gold)}
.head img{width:300pt}
.head .vr{width:1.5pt;height:120pt;background:var(--gold)}
.head .mn{font-family:'Cormorant Garamond',serif;font-weight:500;color:var(--purple);font-size:66pt;letter-spacing:.3em;line-height:1}
.head .alt{font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold);font-size:22pt;margin-top:10pt}
.head .tg{font-size:10pt;letter-spacing:.38em;margin-top:12pt}
.cols{flex:1;padding:26pt 64pt 22pt;gap:30pt;height:auto;min-height:0}
.col{flex:1 1 0;gap:14pt}
.sec h2{font-size:19pt;letter-spacing:.07em;margin-bottom:5pt;display:flex;flex-direction:column}
.sec h2 .alt{font-size:13pt;margin:4pt 0 0}
.sec .rule{margin-bottom:6pt}
.items{display:flex;flex-direction:column;gap:5.5pt}
.it .nm,.it .pr{font-size:12.5pt}
.it .sub{font-family:Manrope,sans-serif;font-style:normal;color:var(--mute);font-size:9pt;font-weight:400;margin-top:1pt}
.it .ds{font-size:9pt;font-style:italic;font-family:'Cormorant Garamond',serif;font-size:11pt;color:var(--gold);line-height:1.15;margin-top:1pt}
.band{height:74pt;background:var(--purple);display:flex;align-items:center;justify-content:center;gap:34pt;color:#f3e7c9;font-size:11pt;letter-spacing:.3em}
.band .st{color:var(--gold2);letter-spacing:0}
.band .v{letter-spacing:.06em}
"""

SIGN_LAYOUT = [
    ["doner", "soup_salad", "sides", "dessert"],
    ["hot_coffee", "iced_coffee"],
    ["frappe", "hot_drinks", "matcha"],
    ["milkshake", "juices", "lemonade", "mojito"],
    ["frozen", "soft"],
]


def sign():
    cols = "".join('<div class="col">' + "".join(section_html(k, "tr", "tri") for k in c) + "</div>" for c in SIGN_LAYOUT)
    vat = " · ".join([UI["tr"]["vat"].rstrip("."), "VAT included", "НДС включён"])
    return f"""<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>{BASE_CSS}{SIGN_CSS}</style></head><body>
<div class="page"><div class="frame"></div>
<div class="head"><img src="godz-logo.svg" alt="GODZ Cafe"><div class="vr"></div><div><div class="mn">MENÜ</div>
<div class="alt">Menu · Меню</div><div class="tg">DÖNER · MUTFAK · KAHVE</div></div></div>
<div class="cols">{cols}</div>
<div class="band"><span>@GODZ_ALANYA</span><span class="st">✦</span><span class="v">{E(vat)}</span><span class="st">✦</span><span>ALANYA</span></div>
</div></body></html>"""


if __name__ == "__main__":
    for lang in ("tr", "en", "ru"):
        open(f"menu-{lang}.html", "w").write(paper(lang))
    open("tabela.html", "w").write(sign())
