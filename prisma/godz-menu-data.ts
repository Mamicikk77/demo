// GODZ Cafe & Restaurant'ın orijinal (Google Sheets'ten önceki) menüsü.
// public/qr-menu/index.html içindeki DEFAULT_CATEGORIES listesiyle birebir
// aynı veridir — panel artık bu veriyi barındırıyor.

type MenuItem = [name: string, description: string, price: number];

export const GODZ_MENU: {
  name: string;
  note?: string;
  isFeatured?: boolean;
  items: MenuItem[];
}[] = [
  {
    name: "Kahvaltılar",
    items: [
      ['"GODZ" Tost', "kızarmış ekmek, üçgen peynir, kaşar peyniri, dana sucuk", 250],
      ["Kaşarlı Tost", "kızarmış ekmek, kaşar, zeytin, salatalık, domates, patates cips", 250],
      ["Menemen", "iki yumurta, çarliston biber, kabuğu soyulmuş domates, özel baharatlar", 250],
      ['"GODZ" Krok', "çıtır ekmek, hindi füme, kaşar, göz yumurta, mevsim salatası ve sabah meyvesi", 250],
      ["Türk Kahvaltısı", "kızarmış yumurta, beyaz peynir, üçgen peynir, zeytin, salatalık, domates", 250],
      ["Soğuk Sandviç", "sandviç ekmeği, kaşar, beyaz peynir, krem peynir, salam, zeytin ezmesi, salatalık, domates", 250],
      ["Sosisli", "sosis ekmeği, sosis, kaşar, salatalık turşusu, domates, özel sos", 250],
    ],
  },
  {
    name: "Salatalar",
    items: [
      ['"GODZ" Salatası', "avokado, tulum peyniri, cherry domates, yeşillik, kırmızı soğan, zeytinyağı", 250],
      ["Sezar Tavuklu", "tavuk, marul, cherry domates, parmesan, sezar sosu, kruton", 250],
      ["Yunan Salatası", "domates, beyaz peynir, salatalık, yeşil biber, zeytin, kırmızı soğan, zeytinyağı", 250],
      ["Kaşık Salatası", "salatalık, domates, soğan, zeytinyağı, nar ekşisi", 250],
      ["Peynir Tabağı", "kaşar peyniri, otlu peynir, beyaz peynir, ceviz, üzüm, bal", 250],
    ],
  },
  {
    name: "Sıcak Yemekler",
    items: [
      ['"GODZ" Köfte', "300 gr", 345],
      ["Tavuklu Sote", "300 gr", 345],
      ["Kıymalı Makarna", "300 gr", 345],
      ["Hamburger", "250 gr", 345],
    ],
  },
  {
    name: "Godz Sepeti",
    isFeatured: true,
    note: "2 kişiliktir",
    items: [["Godz Sepeti", "", 999]],
  },
  {
    name: "Çocuk Menüsü",
    items: [
      ["Peynirli Makarna", "150 gr", 100],
      ["Mini Hamburger", "150 gr", 100],
      ["Patates Kızartması", "150 gr", 100],
    ],
  },
  {
    name: "Kahveler",
    note: "İki fiyat: sıcak servis / buzlu servis",
    items: [
      ["Espresso", "", 115],
      ["Double Espresso", "", 145],
      ["Türk Kahvesi", "", 145],
      ["Flat White", "", 165],
      ["Amerikano (Sıcak)", "", 155],
      ["Amerikano (Buzlu)", "", 175],
      ["Latte (Sıcak)", "", 185],
      ["Latte (Buzlu)", "", 200],
      ["Latte + Şurup (Sıcak)", "", 190],
      ["Latte + Şurup (Buzlu)", "", 235],
      ["Cappuccino (Sıcak)", "", 185],
      ["Cappuccino (Buzlu)", "", 200],
      ["Mocha (Sıcak)", "", 185],
      ["Mocha (Buzlu)", "", 235],
      ["Beyaz Çikolata Mocha (Sıcak)", "", 185],
      ["Beyaz Çikolata Mocha (Buzlu)", "", 235],
      ["Matcha Latte (Sıcak)", "", 200],
      ["Matcha Latte (Buzlu)", "", 255],
      ["Çilekli Matcha Latte (Sıcak)", "", 200],
      ["Çilekli Matcha Latte (Buzlu)", "", 255],
    ],
  },
  {
    name: "Sıcak İçecekler",
    items: [
      ["Çay", "", 55],
      ["Büyük Çay", "", 55],
      ["Sütlü Çay", "", 80],
      ["Sahlep", "", 130],
      ["Sıcak Çikolata", "", 155],
      ["Beyaz Sıcak Çikolata", "", 155],
      ["Papatya Çayı", "", 145],
      ["Ihlamur Çayı", "", 145],
      ["Kış Çayı", "", 145],
      ["Yeşil Çay", "", 145],
      ["Yesminli Yeşil Çay", "", 145],
      ["Hibiskus Çayı", "", 145],
    ],
  },
  {
    name: "Ek Olarak",
    items: [
      ["Badem Sütü", "", 55],
      ["Yulaf Sütü", "", 55],
      ["Hindistan Cevizli Süt", "", 55],
      ["Laktozsuz Süt", "", 55],
      ["Süt", "", 30],
      ["Şurup", "", 25],
    ],
  },
  {
    name: "Sağlıklı İçecekler",
    items: [
      ["Portakal Suyu", "", 195],
      ["Elma Suyu", "", 275],
      ["Havuç Suyu", "", 195],
      ["Atom", "", 295],
    ],
  },
  {
    name: "Soğuk İçecekler",
    items: [
      ["Su (0,5 l)", "", 75],
      ["Soda", "", 75],
      ["Coca Cola", "", 145],
      ["Fanta", "", 145],
      ["Sprite", "", 145],
      ["Coca Cola Zero", "", 145],
      ["Churchill", "", 145],
      ["Redbull", "", 225],
    ],
  },
  {
    name: "Limonata / Mojito",
    items: [
      ["Klasik Limonata", "", 175],
      ["Nane Limonata", "", 185],
      ["Çilekli Limonata", "", 185],
      ["Klasik Mojito", "", 245],
      ["Blueberry Mojito", "", 245],
      ["Çilekli Mojito", "", 245],
    ],
  },
  {
    name: "Milkshakeler",
    items: [
      ["Vanilyalı", "", 235],
      ["Çikolatalı", "", 235],
      ["Çilekli", "", 235],
      ["Muzlu", "", 235],
      ["Karamelli", "", 235],
    ],
  },
];
