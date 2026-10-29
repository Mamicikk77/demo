import sys, numpy as np, potrace
from PIL import Image, ImageFilter
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA")
bg = Image.new("RGBA", im.size, (251, 247, 239, 255)); bg.alpha_composite(im)
K = 8
big = bg.convert("RGB").resize((im.width * K, im.height * K), Image.LANCZOS)
a = np.asarray(big).astype(float)
cols = {"purple": (65, 33, 88), "gold": (214, 182, 100), "bg": (251, 247, 239)}
d = {k: ((a - np.array(v)) ** 2).sum(-1) for k, v in cols.items()}
lab = np.argmin(np.stack([d["purple"], d["gold"], d["bg"]]), 0)
paths = []
for idx, name in ((1, "gold"), (0, "purple")):
    m = Image.fromarray(((lab == idx) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(K * 0.6))
    mask = np.asarray(m) > 127
    bmp = potrace.Bitmap(~mask)
    plist = bmp.trace(turdsize=K * K * 2, alphamax=1.0, opticurve=True, opttolerance=0.3)
    dd = []
    for curve in plist:
        s = curve.start_point
        dd.append(f"M{s.x:.1f},{s.y:.1f}")
        for seg in curve.segments:
            if seg.is_corner:
                dd.append(f"L{seg.c.x:.1f},{seg.c.y:.1f}L{seg.end_point.x:.1f},{seg.end_point.y:.1f}")
            else:
                dd.append(f"C{seg.c1.x:.1f},{seg.c1.y:.1f} {seg.c2.x:.1f},{seg.c2.y:.1f} {seg.end_point.x:.1f},{seg.end_point.y:.1f}")
        dd.append("Z")
    fill = "url(#g)" if name == "gold" else "#41215a"
    paths.append(f'<path fill="{fill}" fill-rule="evenodd" d="{"".join(dd)}"/>')
x0, y0, x1, y1 = im.getbbox()
pad = 2
vb = f"{(x0-pad)*K} {(y0-pad)*K} {(x1-x0+2*pad)*K} {(y1-y0+2*pad)*K}"
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6cd85"/><stop offset=".55" stop-color="#d2b166"/><stop offset="1" stop-color="#b98f3e"/></linearGradient></defs>
{"".join(paths)}</svg>'''
open(out, "w").write(svg)
