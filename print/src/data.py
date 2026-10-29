# Menu content transcribed from the handwritten pages. Each item:
# (tr, en, ru, price, desc) where desc is None or {"tr","en","ru"}.

def I(tr, en, ru, price, desc=None):
    return {"tr": tr, "en": en, "ru": ru, "price": price, "desc": desc}

def D(tr, en, ru):
    return {"tr": tr, "en": en, "ru": ru}

SECTIONS = {
    "doner": {
        "title": D("Et Dönerler", "Meat Döner", "Мясной дёнер"),
        "items": [
            I("Pilav Üstü Döner", "Döner over Rice", "Дёнер на рисе", 555,
              D("200 gr et döner, pilav, lavaş, turşu, sumaklı soğan, söğüş salatalık ve domates",
                "200 g meat döner, rice, lavash, pickles, onions with sumac, sliced cucumber & tomato",
                "200 г мясного дёнера, рис, лаваш, соленья, лук с сумахом, нарезка из огурцов и помидоров")),
            I("İskender (Et Dönerden)", "İskender (Meat Döner)", "Искендер (из мясного дёнера)", 555,
              D("200 gr et döner, yoğurt, soğan piyaz, söğüş salatalık ve domates, turşu",
                "200 g meat döner, yoghurt, onion piyaz, sliced cucumber & tomato, pickles",
                "200 г мясного дёнера, йогурт, луковый пияз, нарезка из огурцов и помидоров, соленья")),
            I("Döner Burger", "Döner Burger", "Дёнер-бургер", 425,
              D("Hamburger ekmeği, 150 gr et döner, patates kızartması",
                "Burger bun, 150 g meat döner, French fries",
                "Булочка для бургера, 150 г мясного дёнера, картофель фри")),
            I("Et Döner Dürüm", "Meat Döner Dürüm", "Дюрюм с мясным дёнером", 425,
              D("150 gr et döner, patates kızartması",
                "150 g meat döner wrap, French fries",
                "150 г мясного дёнера в тонкой лепёшке, картофель фри")),
            I("Et Döner Lavaş", "Meat Döner in Lavash", "Мясной дёнер в лаваше", 425,
              D("150 gr et döner, patates kızartması",
                "150 g meat döner in lavash, French fries",
                "150 г мясного дёнера в лаваше, картофель фри")),
        ],
    },
    "soup_salad": {
        "title": D("Çorba & Salatalar", "Soup & Salads", "Суп и салаты"),
        "items": [
            I("Günün Çorbası", "Soup of the Day", "Суп дня", 145,
              D("Günün çorbası için garsonumuzla iletişime geçebilirsiniz",
                "Please ask your waiter for today's soup",
                "Уточните суп дня у официанта")),
            I("Çoban Salatası", "Shepherd's Salad", "Салат «Чобан»", 145,
              D("Sebzeler, zeytinyağı, limon suyu ve baharatlarla hazırlanan salata · 200 gr",
                "Fresh vegetables with olive oil, lemon juice and spices · 200 g",
                "Овощи с оливковым маслом, лимонным соком и специями · 200 г")),
            I("Akdeniz Salatası", "Mediterranean Salad", "Средиземноморский салат", 195,
              D("Mevsim yeşillikleri, tulum peyniri ile servis edilir",
                "Seasonal greens served with tulum cheese",
                "Сезонная зелень с сыром тулум")),
        ],
    },
    "sides": {
        "title": D("Yan Lezzetler", "Sides", "Гарниры"),
        "items": [
            I("Pirinç Pilavı", "Rice Pilaf", "Рисовый плов", 145),
            I("Patates Kızartması", "French Fries", "Картофель фри", 165),
            I("Yoğurt", "Yoghurt", "Йогурт", 95),
        ],
    },
    "dessert": {
        "title": D("Tatlı", "Dessert", "Десерт"),
        "items": [
            I("Kabak Tatlısı", "Pumpkin Dessert", "Тыквенный десерт", 195,
              D("Tahinli, cevizli", "With tahini and walnuts", "С тахини и грецкими орехами")),
        ],
    },
    "hot_coffee": {
        "title": D("Sıcak Kahveler", "Hot Coffees", "Горячий кофе"),
        "items": [
            I("Americano", "Americano", "Американо", 145),
            I("Cafe Latte", "Caffè Latte", "Кафе латте", 185),
            I("White Chocolate Latte", "White Chocolate Latte", "Латте с белым шоколадом", 195),
            I("Cappuccino", "Cappuccino", "Капучино", 185),
            I("Flat White", "Flat White", "Флэт уайт", 185),
            I("Macchiato", "Macchiato", "Макиато", 185),
            I("Espresso", "Espresso", "Эспрессо", 95),
            I("Duble Espresso", "Double Espresso", "Двойной эспрессо", 125),
            I("Türk Kahvesi", "Turkish Coffee", "Турецкий кофе", 95),
            I("Duble Türk Kahvesi", "Double Turkish Coffee", "Двойной турецкий кофе", 125),
            I("Vanilya Latte", "Vanilla Latte", "Ванильный латте", 195),
            I("Karamel Latte", "Caramel Latte", "Карамельный латте", 195),
            I("Cortado", "Cortado", "Кортадо", 175),
            I("Ristretto", "Ristretto", "Ристретто", 95),
            I("Mocha", "Mocha", "Мокко", 195),
        ],
    },
    "iced_coffee": {
        "title": D("Soğuk Kahveler", "Iced Coffees", "Холодный кофе"),
        "items": [
            I("Ice Americano", "Iced Americano", "Айс американо", 155),
            I("Ice Latte", "Iced Latte", "Айс латте", 185),
            I("Ice White Chocolate Mocha", "Iced White Chocolate Mocha", "Айс мокко с белым шоколадом", 215),
            I("Ice Cappuccino", "Iced Cappuccino", "Айс капучино", 185),
            I("Ice Vanilya Latte", "Iced Vanilla Latte", "Айс ванильный латте", 215),
            I("Ice Karamel Latte", "Iced Caramel Latte", "Айс карамельный латте", 215),
            I("Ice Mocha", "Iced Mocha", "Айс мокко", 215),
            I("Ice Bumble Coffee", "Iced Bumble Coffee", "Айс бамбл кофе", 255),
        ],
    },
    "frappe": {
        "title": D("Frappe", "Frappé", "Фраппе"),
        "items": [
            I("Espresso Frappe", "Espresso Frappé", "Эспрессо фраппе", 225),
            I("Karamel Frappe", "Caramel Frappé", "Карамельный фраппе", 225),
            I("Vanilya Frappe", "Vanilla Frappé", "Ванильный фраппе", 225),
            I("Çikolata Frappe", "Chocolate Frappé", "Шоколадный фраппе", 225),
        ],
    },
    "hot_drinks": {
        "title": D("Sıcak İçecekler", "Hot Drinks", "Горячие напитки"),
        "items": [
            I("Çay", "Turkish Tea", "Турецкий чай", 50),
            I("Duble Çay", "Large Turkish Tea", "Большой турецкий чай", 70),
            I("Yeşil Çay", "Green Tea", "Зелёный чай", 175),
            I("Ada Çayı", "Sage Tea", "Чай с шалфеем", 175),
            I("Ihlamur Çayı", "Linden Tea", "Липовый чай", 175),
            I("Kış Çayı", "Winter Tea", "Зимний чай", 175),
            I("Jasmine Çayı", "Jasmine Tea", "Жасминовый чай", 175),
            I("Papatya Çayı", "Chamomile Tea", "Ромашковый чай", 175),
            I("Hibiskus Çayı", "Hibiscus Tea", "Чай из гибискуса", 175),
            I("Sıcak Süt", "Hot Milk", "Горячее молоко", 75),
            I("Sıcak Çikolata", "Hot Chocolate", "Горячий шоколад", 175),
            I("Sıcak Beyaz Çikolata", "Hot White Chocolate", "Горячий белый шоколад", 175),
            I("Sahlep", "Salep", "Салеп", 175),
        ],
    },
    "matcha": {
        "title": D("Matcha · Ice Matcha", "Matcha · Iced Matcha", "Матча · Айс матча"),
        "items": [
            I("Green Matcha Latte", "Green Matcha Latte", "Матча латте", 245),
            I("Strawberry Matcha Latte", "Strawberry Matcha Latte", "Клубничный матча латте", 245),
            I("Blue Matcha Latte", "Blue Matcha Latte", "Голубой матча латте", 245),
        ],
    },
    "milkshake": {
        "title": D("Milkshake", "Milkshakes", "Милкшейки"),
        "items": [
            I("Çikolatalı Milkshake", "Chocolate Milkshake", "Шоколадный милкшейк", 245),
            I("Çilekli Milkshake", "Strawberry Milkshake", "Клубничный милкшейк", 245),
            I("Vanilyalı Milkshake", "Vanilla Milkshake", "Ванильный милкшейк", 245),
            I("Muzlu Milkshake", "Banana Milkshake", "Банановый милкшейк", 245),
            I("Karamelli Milkshake", "Caramel Milkshake", "Карамельный милкшейк", 245),
            I("Mangolu Milkshake", "Mango Milkshake", "Манговый милкшейк", 245),
        ],
    },
    "juices": {
        "title": D("Sağlıklı İçecekler", "Fresh Juices", "Свежие соки"),
        "items": [
            I("Portakal Suyu", "Orange Juice", "Апельсиновый сок", 195),
            I("Elma Suyu", "Apple Juice", "Яблочный сок", 245),
            I("Havuç Suyu", "Carrot Juice", "Морковный сок", 195),
            I("Atom", "Atom", "Атом", 355),
        ],
    },
    "lemonade": {
        "title": D("Limonatalar", "Lemonades", "Лимонады"),
        "items": [
            I("Klasik Limonata", "Classic Lemonade", "Классический лимонад", 195),
            I("Çilekli Limonata", "Strawberry Lemonade", "Клубничный лимонад", 195),
            I("Naneli Limonata", "Mint Lemonade", "Мятный лимонад", 195),
        ],
    },
    "mojito": {
        "title": D("Mojito", "Mojito", "Мохито"),
        "items": [
            I("Klasik Mojito", "Classic Mojito", "Классический мохито", 245),
            I("Çilekli Mojito", "Strawberry Mojito", "Клубничный мохито", 245),
        ],
    },
    "frozen": {
        "title": D("Frozen", "Frozen", "Фрозен"),
        "items": [
            I("Mango Frozen", "Mango Frozen", "Фрозен манго", 245),
            I("Çilek Frozen", "Strawberry Frozen", "Фрозен клубника", 245),
            I("Arizona Dream Frozen", "Arizona Dream Frozen", "Фрозен Arizona Dream", 245),
            I("Egzotik Frozen", "Exotic Frozen", "Фрозен экзотик", 245),
            I("Şeftali Frozen", "Peach Frozen", "Фрозен персик", 245),
        ],
    },
    "soft": {
        "title": D("Meşrubatlar", "Soft Drinks", "Безалкогольные напитки"),
        "items": [
            I("Su", "Still Water", "Вода", 45),
            I("Soda", "Sparkling Water", "Газированная вода", 75),
            I("Coca-Cola", "Coca-Cola", "Coca-Cola", 145),
            I("Fanta", "Fanta", "Fanta", 145),
            I("Sprite", "Sprite", "Sprite", 145),
            I("Fuse Tea Şeftali", "Fuse Tea Peach", "Fuse Tea персик", 145),
            I("Fuse Tea Mango Ananas", "Fuse Tea Mango Pineapple", "Fuse Tea манго-ананас", 145),
            I("Fuse Tea Limon", "Fuse Tea Lemon", "Fuse Tea лимон", 145),
            I("Coca-Cola Zero", "Coca-Cola Zero", "Coca-Cola Zero", 145),
            I("Red Bull", "Red Bull", "Red Bull", 195),
            I("Red Bull Zero", "Red Bull Zero", "Red Bull Zero", 195),
            I("Churchill", "Churchill", "Черчилль", 145),
            I("Ayran", "Ayran", "Айран", 95),
            I("Şalgam", "Şalgam", "Шалгам", 95),
        ],
    },
}

UI = {
    "tr": {"menu": "MENÜ", "tagline": "DÖNER · MUTFAK · KAHVE", "kitchen": "Mutfak", "drinks": "İçecekler",
           "vat": "Fiyatlarımıza KDV dahildir.",
           "allergy": "Alerjiniz veya özel beslenme ihtiyacınız varsa lütfen personelimize danışın.",
           "city": "Alanya"},
    "en": {"menu": "MENU", "tagline": "DÖNER · KITCHEN · COFFEE", "kitchen": "Kitchen", "drinks": "Drinks",
           "vat": "All prices in Turkish lira, VAT included.",
           "allergy": "Please tell our staff about any allergies or dietary requirements.",
           "city": "Alanya"},
    "ru": {"menu": "МЕНЮ", "tagline": "ДЁНЕР · КУХНЯ · КОФЕ", "kitchen": "Кухня", "drinks": "Напитки",
           "vat": "Все цены указаны в турецких лирах с учётом НДС.",
           "allergy": "Если у вас аллергия или особые предпочтения в питании, сообщите персоналу.",
           "city": "Аланья"},
}

# Approximate calories and allergen numbers (see ALLERGENS), keyed by Turkish name.
# Drinks carry the values from the previous printed menu; food values are estimates
# from standard recipes and should be checked against the kitchen's own recipes.
# kcal None means it varies (e.g. soup of the day).
NUTRI = {
    "Pilav Üstü Döner": (1050, [1, 2]), "İskender (Et Dönerden)": (950, [1, 2]),
    "Döner Burger": (850, [1, 7]), "Et Döner Dürüm": (780, [1]), "Et Döner Lavaş": (780, [1]),
    "Günün Çorbası": (None, []), "Çoban Salatası": (120, []), "Akdeniz Salatası": (280, [2]),
    "Pirinç Pilavı": (350, [2]), "Patates Kızartması": (480, []), "Yoğurt": (120, [2]),
    "Kabak Tatlısı": (450, [4, 7]),
    "Americano": (10, []), "Cafe Latte": (190, [2]), "White Chocolate Latte": (330, [2]),
    "Cappuccino": (130, [2]), "Flat White": (120, [2]), "Macchiato": (25, [2]), "Espresso": (5, []),
    "Duble Espresso": (10, []), "Türk Kahvesi": (10, []), "Duble Türk Kahvesi": (20, []),
    "Vanilya Latte": (250, [2]), "Karamel Latte": (260, [2]), "Cortado": (60, [2]),
    "Ristretto": (5, []), "Mocha": (290, [2]),
    "Ice Americano": (10, []), "Ice Latte": (150, [2]), "Ice White Chocolate Mocha": (340, [2]),
    "Ice Cappuccino": (120, [2]), "Ice Vanilya Latte": (220, [2]), "Ice Karamel Latte": (230, [2]),
    "Ice Mocha": (260, [2]), "Ice Bumble Coffee": (160, []),
    "Espresso Frappe": (380, [2]), "Karamel Frappe": (420, [2]), "Vanilya Frappe": (400, [2]),
    "Çikolata Frappe": (440, [2]),
    "Çay": (2, []), "Duble Çay": (4, []), "Yeşil Çay": (2, []), "Ada Çayı": (2, []),
    "Ihlamur Çayı": (2, []), "Kış Çayı": (60, []), "Jasmine Çayı": (2, []), "Papatya Çayı": (2, []),
    "Hibiskus Çayı": (5, []), "Sıcak Süt": (150, [2]), "Sıcak Çikolata": (340, [2]),
    "Sıcak Beyaz Çikolata": (380, [2]), "Sahlep": (280, [2]),
    "Green Matcha Latte": (190, [2]), "Strawberry Matcha Latte": (230, [2]), "Blue Matcha Latte": (180, [2]),
    "Çikolatalı Milkshake": (520, [2]), "Çilekli Milkshake": (460, [2]), "Vanilyalı Milkshake": (470, [2]),
    "Muzlu Milkshake": (480, [2]), "Karamelli Milkshake": (510, [2]), "Mangolu Milkshake": (450, [2]),
    "Portakal Suyu": (110, []), "Elma Suyu": (120, []), "Havuç Suyu": (90, []), "Atom": (420, [2, 4]),
    "Klasik Limonata": (160, []), "Çilekli Limonata": (180, []), "Naneli Limonata": (160, []),
    "Klasik Mojito": (150, []), "Çilekli Mojito": (170, []),
    "Mango Frozen": (240, []), "Çilek Frozen": (220, []), "Arizona Dream Frozen": (250, []),
    "Egzotik Frozen": (240, []), "Şeftali Frozen": (230, []),
    "Su": (0, []), "Soda": (0, []), "Coca-Cola": (140, []), "Fanta": (150, []), "Sprite": (140, []),
    "Fuse Tea Şeftali": (90, []), "Fuse Tea Mango Ananas": (90, []), "Fuse Tea Limon": (90, []),
    "Coca-Cola Zero": (1, []), "Red Bull": (115, []), "Red Bull Zero": (5, []), "Churchill": (15, []),
    "Ayran": (90, [2]), "Şalgam": (25, []),
}

ALLERGENS = {
    "tr": ["Gluten", "Süt", "Yumurta", "Kabuklu yemiş", "Yer fıstığı", "Soya", "Susam", "Hardal", "Kereviz", "Sülfit"],
    "en": ["Gluten", "Milk", "Egg", "Tree nuts", "Peanut", "Soy", "Sesame", "Mustard", "Celery", "Sulphites"],
    "ru": ["Глютен", "Молоко", "Яйцо", "Орехи", "Арахис", "Соя", "Кунжут", "Горчица", "Сельдерей", "Сульфиты"],
}

for _s in SECTIONS.values():
    for _it in _s["items"]:
        _it["kcal"], _it["alg"] = NUTRI[_it["tr"]]

UI["tr"].update(kcal="kcal", varies="kalori değişken", allergens="Alerjenler",
                kcalnote="Kalori değerleri yaklaşıktır, porsiyona göre değişebilir.")
UI["en"].update(kcal="kcal", varies="calories vary", allergens="Allergens",
                kcalnote="Calorie values are approximate and may vary by portion.")
UI["ru"].update(kcal="ккал", varies="калорийность меняется", allergens="Аллергены",
                kcalnote="Калорийность указана приблизительно и может меняться в зависимости от порции.")
