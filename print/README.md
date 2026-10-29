# Basılı menüler

- `menu-tr.pdf`, `menu-en.pdf`, `menu-ru.pdf` — 42 × 14 cm kağıt menü (2 sayfa: ön / arka), her dil ayrı.
- `tabela.pdf` — kare tabela menü (1434 × 1434 pt), Türkçe + İngilizce/Rusça alt satırlar.

Yeniden üretmek için:

```bash
cd print/src
python3 gen.py                                   # HTML dosyalarını üretir
mkdir -p out && NODE_PATH=$(npm root -g) node render.js "$PWD"   # out/*.pdf
```

Menü içeriği ve fiyatlar `src/data.py` içinde.
