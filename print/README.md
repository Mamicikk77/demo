# Basılı menüler

- `menu-tr.pdf`, `menu-en.pdf`, `menu-ru.pdf` — açılır kapanır (iki kırımlı) kağıt menü, her dil ayrı.
  28 × 42 cm tabaka çift taraflı basılır, ortadan katlanınca 14 × 42 cm olur.
  Sayfa 1 (dış yüz): arka kapak | ön kapak. Sayfa 2 (iç yüz): mutfak & kahveler | içecekler.
- `tabela.pdf` — kare tabela menü (1434 × 1434 pt), Türkçe + İngilizce/Rusça alt satırlar.

Yeniden üretmek için:

```bash
cd print/src
python3 gen.py                                   # HTML dosyalarını üretir
mkdir -p out && NODE_PATH=$(npm root -g) node render.js "$PWD"   # out/*.pdf
```

Menü içeriği ve fiyatlar `src/data.py` içinde. Logo, `trace_logo.py` ile PNG'den vektöre (`godz-logo.svg`) çevrildi.
