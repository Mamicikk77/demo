import html
from data import SECTIONS, UI

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
    if sub:
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


# ---------------------------------------------------------------- paper menu 14x42 (portrait)

PAPER_CSS = """
@page{size:140mm 420mm;margin:0}
.page{width:140mm;height:420mm;display:flex;flex-direction:column}
.frame{position:absolute;inset:4mm;border:1px solid var(--gold);pointer-events:none}
.frame2{position:absolute;inset:5.6mm;border:1px solid rgba(195,154,69,.4);pointer-events:none}
.cols{flex:1;min-height:0;height:auto;padding:7mm 11mm 6mm;gap:7mm}
.col{flex:1 1 0;gap:7.5mm}
.sec h2{font-size:13pt;margin-bottom:1.3mm}
.sec .rule{margin-bottom:1.8mm}
.items{display:flex;flex-direction:column;gap:2.6mm}
.col.food .items{gap:3.6mm}
html[lang=tr] .items{gap:4.4mm}
html[lang=tr] .col.food .items{gap:5mm}
html[lang=tr] .col{gap:9mm}
.it .nm{font-size:8.6pt;white-space:normal;min-width:0}
.it .pr{font-size:8.6pt}
.it .sub{font-size:8.6pt;line-height:1;margin-top:0}
.it .ds{font-size:7pt;line-height:1.3;margin-top:.4mm}
.topline{text-align:center;font-size:5.6pt;letter-spacing:.4em;color:var(--gold);padding-top:9mm}
.cover{display:flex;flex-direction:column;align-items:center;text-align:center;padding:12mm 0 7mm;margin:0 11mm;border-bottom:1px solid var(--gold)}
.cover img{width:58mm}
.cover .mn{font-family:'Cormorant Garamond',serif;font-weight:500;color:var(--purple);font-size:32pt;letter-spacing:.32em;margin:4mm 0 0 .32em;line-height:1}
.cover .tg{font-size:6.4pt;letter-spacing:.32em;color:var(--ink);margin-top:3mm}
.band{height:26mm;flex:none;background:var(--purple);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.2mm}
.band .ig{font-size:7pt;letter-spacing:.3em;color:#f3e7c9}
.band .ct{font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold2);font-size:11pt}
.band .st{color:var(--gold2);font-size:8pt}
.notes{margin:0 11mm 7mm;border-top:1px solid var(--gold);padding-top:2.6mm;display:flex;flex-direction:column;gap:1.3mm;font-size:6.6pt;color:var(--mute);line-height:1.35}
.notes span{color:var(--gold)}
.page .band{position:relative;z-index:1}
"""


def cover(lang):
    u = UI[lang]
    return f"""<div class="cover"><img src="godz-logo.png" alt="GODZ Cafe">
<div class="mn">{E(u['menu'])}</div><div class="tg">{E(u['tagline'])}</div></div>"""


def band(lang):
    return f'<div class="band"><div class="st">✦</div><div class="ig">@GODZ_ALANYA</div><div class="ct">{E(UI[lang]["city"])}</div></div>'


def notes(lang):
    u = UI[lang]
    return f'<div class="notes"><div><span>✦</span> {E(u["vat"])}</div><div><span>✦</span> {E(u["allergy"])}</div></div>'


PAPER_LAYOUT = [
    ("front", [("food", ["doner", "soup_salad", "sides", "dessert"]), ("", ["hot_coffee", "iced_coffee", "frappe"])]),
    ("back", [("", ["hot_drinks", "matcha", "milkshake", "juices"]), ("", ["soft", "frozen", "lemonade", "mojito"])]),
]


def paper(lang):
    pages = []
    for side, cols in PAPER_LAYOUT:
        body = "".join(f'<div class="col {cls}">' + "".join(section_html(k, lang, "single") for k in keys) + "</div>"
                       for cls, keys in cols)
        head = cover(lang) if side == "front" else '<div class="topline">GODZ ✦ CAFE</div>'
        foot = "" if side == "front" else notes(lang)
        pages.append(f'<div class="page">{head}<div class="cols">{body}</div>{foot}{band(lang)}'
                     '<div class="frame"></div><div class="frame2"></div></div>')
    return f'<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><style>{BASE_CSS}{PAPER_CSS}</style></head><body>{"".join(pages)}</body></html>'


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
<div class="head"><img src="godz-logo.png" alt="GODZ Cafe"><div class="vr"></div><div><div class="mn">MENÜ</div>
<div class="alt">Menu · Меню</div><div class="tg">DÖNER · MUTFAK · KAHVE</div></div></div>
<div class="cols">{cols}</div>
<div class="band"><span>@GODZ_ALANYA</span><span class="st">✦</span><span class="v">{E(vat)}</span><span class="st">✦</span><span>ALANYA</span></div>
</div></body></html>"""


if __name__ == "__main__":
    for lang in ("tr", "en", "ru"):
        open(f"menu-{lang}.html", "w").write(paper(lang))
    open("tabela.html", "w").write(sign())
