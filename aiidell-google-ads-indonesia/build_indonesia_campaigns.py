"""Indonesia -> India Google Search campaigns for AiiDell, built on the FNP (Ferns N Petals) playbook.
Output: Google Ads Editor import CSVs. Same format as marketing/google-ads/build_campaigns.py in aiidellgifting.
Everything is created PAUSED, so nothing spends until you switch it on.

Who sees it: people IN Indonesia searching to send food, flowers, cakes, gifts or groceries to India. They pay in Rupiah.

What we copy from FNP (fnp.com, Nov 2026):
  FNP title: "India's #1 Online Gift Store | 60 Mins Delivery"   -> we lead with speed too: "Makanan Sampai 40 Menit"
  FNP: "Same-Day and Midnight Delivery", "under 2 hours"        -> "Same Day ke India" (flowers/cakes before cut-off)
  FNP: one page per product / occasion / recipient / feeling    -> one ad group per theme, each to its own AiiDell page
  FNP: Flowers, Cakes, Same Day, Birthday, Anniversary, Boyfriend, Miss You, Chocolates, Hampers
What we do NOT copy: the FNP name in ad text (Google trademark policy), "Free Shipping" and "Midnight Delivery"
(AiiDell does not offer them), and FNP's customer numbers (they are FNP's, not ours).

Claims used and where the site already makes them:
  Pay in Rupiah: QRIS / DANA / OVO / ShopeePay / BCA VA   -> Midtrans checkout
  Food in about 40 minutes                                 -> "Food in 40 minutes" on the homepage and /food
  Flowers & cakes often same day before the daily cut-off  -> FAQ on /policies
  Bought locally in India, no customs                      -> homepage, customer stories
  Groceries: paste a link from any Indian store/app        -> /send-items (Blinkit, BigBasket ...), placed in ~20 min

TWO_HOUR: you asked for "delivered in 2 hours". The site does not promise that for flowers/gifts yet. Set True only once
the team can really deliver flowers and cakes within 2 hours in the cities you target; it adds 2-hour headlines.

Edit the copy/keywords below and re-run:  python3 build_indonesia_campaigns.py
Checked here: headlines <= 30 chars, descriptions <= 90, paths <= 15, exactly 15 headlines + 4 descriptions per ad.
"""
import csv

TWO_HOUR = False

B = "https://aiidell.com"
def u(path, camp): return f"{B}{path}?utm_source=google&utm_medium=cpc&utm_campaign={camp}"

# ======================= Bahasa Indonesia =======================
ID_SHARED_H = ["Makanan Sampai 40 Menit", "Same Day Delivery ke India", "Bayar Rupiah: QRIS, DANA, OVO",
               "Dibeli Langsung di India", "Tanpa Bea Cukai, Tanpa Kurir", "Semudah Belanja Online",
               "Lacak Pesanan via WhatsApp", "Delhi, Mumbai, Bangalore", "Toko Hadiah Indonesia-India",
               "AiiDell: Hadiah Tanpa Batas"]
ID_TWO_HOUR_H = ["Bunga & Kue Sampai 2 Jam", "Kirim Hari Ini, Sampai 2 Jam"]  # replace the last two shared ones
ID_SHARED_D = ["Bayar Rupiah via QRIS, DANA, OVO, ShopeePay atau BCA VA. Tanpa kartu internasional.",
               "Checkout semudah belanja online, tim AiiDell urus sampai pintu. Lacak via WhatsApp."]

def g(name, path, p1, p2, kws, H, D): return dict(name=name, path=path, p1=p1, p2=p2, kws=kws, H=H, D=D)

ID_GROUPS = [
 g("Kirim hadiah ke India", "/kirim-hadiah-ke-india", "kirim-hadiah", "india",
   ["kirim hadiah ke india", "kirim kado ke india", "kirim kado ke india dari indonesia", "kirim hadiah ke india dari indonesia",
    "toko hadiah online india", "kirim hampers ke india"],
   ["Kirim Hadiah ke India", "Kirim Kado ke India Hari Ini", "Hampers, Bunga, Kue & Cokelat", "Hadiah untuk Semua Momen", "Surat Cinta Tulisan Tangan"],
   ["Kirim kado, hampers, bunga & kue ke India. Dibeli langsung di India, tanpa bea cukai.",
    "Ulang tahun, anniversary, atau cuma kangen? Kado sampai ke pintunya, kamu bayar Rupiah."]),
 g("Kirim bunga ke India", "/kirim-bunga-ke-india", "kirim-bunga", "india",
   ["kirim bunga ke india", "kirim buket bunga ke india", "kirim bunga ke india dari indonesia", "toko bunga online india",
    "kirim mawar ke india", "bunga ulang tahun ke india"],
   ["Kirim Bunga ke India", "Buket Segar dari Florist Lokal", "Mawar, Lily & Anggrek", "Bunga + Kue, Satu Pesanan", "Bunga Sampai di Hari yang Sama"],
   ["Buket segar dari florist lokal di India. Bisa sampai hari ini kalau pesan sebelum batas.",
    "Mawar, lily, anggrek. Tambah kue atau cokelat. Foto bukti saat bunga sampai di tangannya."]),
 g("Kirim kue ke India", "/gifts/cakes", "kue", "india",
   ["kirim kue ke india", "kirim cake ke india", "kirim kue ulang tahun ke india", "pesan kue online india",
    "kirim kue ulang tahun untuk pacar di india"],
   ["Kirim Kue ke India", "Kue Ulang Tahun ke India", "Cokelat, Red Velvet & Lainnya", "Kue Fresh dari Toko Lokal", "Kue + Bunga, Satu Pesanan"],
   ["Kue ulang tahun fresh dari toko kue lokal di India. Bisa sampai hari ini sebelum batas.",
    "Cokelat, red velvet, butterscotch. Tambah bunga atau lilin. Kamu bayar Rupiah saja."]),
 g("Kirim makanan ke India", "/food", "makanan", "india",
   ["kirim makanan ke india", "pesan makanan untuk pacar di india", "kirim pizza ke india", "order makanan di india dari indonesia",
    "kirim makan malam ke india", "pesan makanan online india dari luar negeri"],
   ["Kirim Makanan ke India", "Sampai dalam 40 Menit", "Pizza, Burger, Biryani, Momo", "Dia Lapar? Kirim dari Sini", "Restoran Favorit di India"],
   ["Pizza, burger, biryani & momo dari restoran favorit di India, sampai sekitar 40 menit.",
    "Pacar atau keluarga di India lapar? Pesan dari Indonesia, bayar Rupiah, langsung diantar."]),
 g("Same day ke India", "/gifts/same-day", "same-day", "india",
   ["kirim hadiah same day india", "kirim bunga hari ini india", "kado dadakan ke india", "kirim kado hari ini ke india",
    "same day delivery india"],
   ["Kado Same Day ke India", "Lupa Ulang Tahunnya? Tenang", "Pesan Pagi, Sampai Hari Ini", "Bunga & Kue Hari Ini Juga", "Kado Dadakan ke India"],
   ["Lupa tanggalnya? Bunga, kue & makanan bisa sampai hari ini kalau pesan sebelum batas.",
    "Kado same day ke India: bunga, kue, cokelat, makanan hangat ±40 menit. Bayar Rupiah."]),
 g("Kado ulang tahun India", "/gifts/birthday", "ulang-tahun", "india",
   ["kado ulang tahun ke india", "hadiah ulang tahun ke india", "kirim kado ulang tahun pacar india",
    "kado ulang tahun untuk pacar india", "surprise ulang tahun ke india"],
   ["Kado Ulang Tahun ke India", "Surprise Ulang Tahun untuk Dia", "Kue, Bunga & Balon", "Sampai Tepat di Harinya", "Kami Ingatkan Tanggalnya"],
   ["Surprise ulang tahun ke India: kue, bunga & hampers sampai tepat di harinya. Bayar Rupiah.",
    "Simpan tanggalnya, kami ingatkan 7, 3, 2 & 1 hari sebelumnya. Tidak pernah lupa lagi."]),
 g("Kado anniversary India", "/gifts/anniversary", "anniversary", "india",
   ["kado anniversary ke india", "hadiah anniversary untuk pacar india", "kirim kado anniversary ke india",
    "kado anniversary ldr india"],
   ["Kado Anniversary ke India", "Rayakan Hari Jadi dari Jauh", "Mawar Merah & Kue Romantis", "Kado Romantis untuk Dia", "Surat Cinta + Bunga"],
   ["Hari jadi tapi beda negara? Kirim mawar, kue & surat cinta ke India. Bayar Rupiah.",
    "Kado anniversary romantis dibeli di India, sampai ke pintunya. Lacak via WhatsApp."]),
 g("Kado untuk pacar di India", "/gifts/boyfriend", "pacar", "india",
   ["kado untuk pacar di india", "kado untuk pacar india", "hadiah untuk pacar india", "kado untuk cowok india",
    "hadiah untuk pacar ldr india"],
   ["Kado untuk Pacar di India", "Bikin Dia Senyum Hari Ini", "Jam, Parfum, Hoodie & Lainnya", "Kado Cowok yang Dia Suka", "Dari Indonesia, Penuh Cinta"],
   ["Kado untuk pacar di India: jam, parfum, hoodie, kue & bunga. Dibeli di India, bayar Rp.",
    "Bikin dia senyum hari ini. Pilih kado, checkout, tim AiiDell antar sampai pintunya."]),
 g("LDR & kangen India", "/gifts/long-distance", "ldr", "india",
   ["kado ldr india", "kado ldr indonesia india", "hadiah ldr untuk pacar india", "kado kangen untuk pacar",
    "kirim kado untuk pacar jarak jauh"],
   ["Kado LDR Indonesia-India", "Kangen Dia? Kirim Pelukan", "Jarak Bukan Halangan", "Surat Cinta Tulisan Tangan", "Kado LDR yang Bikin Nangis"],
   ["LDR Indonesia-India? Kirim surat cinta, bunga, kue atau makanan favoritnya. Bayar Rupiah.",
    "Kangen tapi jauh? Kado sampai ke pintunya, plus foto bukti saat dia menerimanya."]),
 g("Kirim cokelat ke India", "/gifts/chocolates", "cokelat", "india",
   ["kirim cokelat ke india", "kirim coklat ke india", "hampers cokelat india", "kado cokelat untuk pacar india"],
   ["Kirim Cokelat ke India", "Tidak Meleleh, Dibeli di India", "Hampers Cokelat Premium", "Cokelat + Bunga + Kue", "Manis untuk Orang Tersayang"],
   ["Cokelat dibeli langsung di India, jadi tidak meleleh di jalan. Hampers mulai harga hemat.",
    "Kirim cokelat, hampers & bunga ke India dari Indonesia. Bayar Rupiah, tanpa bea cukai."]),
 g("Belanja & groceries ke India", "/send-items", "belanja", "india",
   ["kirim belanjaan ke india", "beli barang di india dari indonesia", "belanja online india dari indonesia",
    "titip beli barang india", "jastip india", "kirim groceries ke india"],
   ["Belanja Kebutuhan ke India", "Kirim Link, Kami Belikan", "Groceries & Kebutuhan Harian", "Dari Toko Online Mana Saja", "Jastip India Tanpa Ribet"],
   ["Kirim link dari toko online India mana saja, kami belikan & antar ke rumah. Bayar Rupiah.",
    "Groceries, susu, beras & kebutuhan harian. Pesanan dibuat ±20 menit setelah kamu bayar."]),
]

# ======================= English =======================
EN_SHARED_H = ["Food Delivered in 40 Mins", "Same-Day Delivery to India", "Pay in Rupiah: QRIS, DANA, OVO",
               "Bought Locally in India", "No Customs, No Courier", "Checkout Like Any Online Shop",
               "Track It on WhatsApp", "Delhi, Mumbai, Bangalore", "Indonesia-to-India Gift Shop",
               "AiiDell: Gifts Without Borders"]
EN_TWO_HOUR_H = ["Flowers & Cakes in 2 Hours", "Order Now, Delivered in 2 Hrs"]
EN_SHARED_D = ["Pay in Rupiah with QRIS, DANA, OVO, ShopeePay or BCA VA. No international card needed.",
               "Check out like any online shop. The AiiDell team handles the rest. Track it on WhatsApp."]

EN_GROUPS = [
 g("Send gifts to India", "/send-gifts-to-india", "send-gifts", "india",
   ["send gifts to india from indonesia", "send gift to india", "send gifts to india", "online gift delivery india",
    "online gift shop india", "send hampers to india"],
   ["Send Gifts to India", "Gifts for Every Occasion", "Hampers, Flowers & Cakes", "From Indonesia, Pay in Rupiah", "Handwritten Love Letters"],
   ["Send gifts, hampers, flowers & cakes to India from Indonesia. Bought in India, no customs.",
    "Birthday, anniversary or just missing them? Delivered to their door. You pay in Rupiah."]),
 g("Send flowers to India", "/send-flowers", "flowers", "india",
   ["send flowers to india from indonesia", "send flowers to india", "flower delivery india", "online flower delivery india",
    "send roses to india"],
   ["Send Flowers to India", "Fresh Bouquets, Local Florists", "Roses, Lilies & Orchids", "Flowers + Cake, One Order", "Same-Day Before Cut-Off"],
   ["Fresh bouquets from local florists in India. Same-day delivery if ordered before cut-off.",
    "Roses, lilies, orchids. Add a cake or chocolates. Get a photo when the flowers arrive."]),
 g("Send cake to India", "/gifts/cakes", "cakes", "india",
   ["send cake to india", "send birthday cake to india", "online cake delivery india", "order cake online india from abroad"],
   ["Send Cakes to India", "Birthday Cakes Delivered", "Chocolate, Red Velvet & More", "Freshly Baked by Local Bakers", "Cake + Flowers, One Order"],
   ["Freshly baked birthday cakes from local bakers in India. Same-day if ordered by cut-off.",
    "Chocolate, red velvet, butterscotch. Add flowers or candles. You only pay in Rupiah."]),
 g("Send food to India", "/food", "food", "india",
   ["send food to india", "order food for someone in india", "send pizza to india", "send dinner to india",
    "food delivery india from abroad"],
   ["Send Food to India", "Hot Food in About 40 Minutes", "Pizza, Burgers, Biryani, Momos", "Hungry? Send Dinner from Here", "Their Favourite Restaurants"],
   ["Pizza, burgers, biryani & momos from favourite restaurants in India, in about 40 minutes.",
    "Someone in India is hungry? Order from Indonesia, pay in Rupiah and it is on its way."]),
 g("Same day to India", "/gifts/same-day", "same-day", "india",
   ["same day gift delivery india", "same day flower delivery india", "last minute gift to india", "send gift today india"],
   ["Same-Day Gifts to India", "Forgot Their Birthday? Relax", "Order Now, Arrives Today", "Flowers & Cakes Today", "Last-Minute Gifts to India"],
   ["Forgot the date? Flowers, cakes and food can arrive today if ordered before the cut-off.",
    "Same-day gifts to India: flowers, cakes, chocolates, hot food in ~40 min. Pay in Rupiah."]),
 g("Birthday gifts India", "/gifts/birthday", "birthday", "india",
   ["birthday gift to india", "send birthday gift to india", "birthday surprise india", "birthday gift for boyfriend in india"],
   ["Birthday Gifts to India", "Plan a Birthday Surprise", "Cake, Flowers & Balloons", "Delivered on the Big Day", "Free Birthday Reminders"],
   ["Birthday surprise in India: cake, flowers and hampers delivered on the day. Pay in Rupiah.",
    "Save the date and we remind you 7, 3, 2 and 1 day before. Never miss a birthday again."]),
 g("Anniversary gifts India", "/gifts/anniversary", "anniversary", "india",
   ["anniversary gift to india", "send anniversary gift to india", "anniversary gift for boyfriend india"],
   ["Anniversary Gifts to India", "Celebrate from Miles Away", "Red Roses & Romantic Cakes", "Romantic Gifts for Him", "Love Letter + Flowers"],
   ["Anniversary but different countries? Send roses, cake and a love letter. Pay in Rupiah.",
    "Romantic anniversary gifts bought in India, delivered to the door. Track it on WhatsApp."]),
 g("Gifts for boyfriend India", "/gifts/boyfriend", "boyfriend", "india",
   ["gift for boyfriend in india", "send gift to boyfriend in india", "gifts for indian boyfriend", "gift for him india"],
   ["Gifts for Him in India", "Make Him Smile Today", "Watches, Perfume, Hoodies", "Gifts He Will Actually Love", "From Indonesia, With Love"],
   ["Gifts for him in India: watches, perfume, hoodies, cakes, flowers. Bought in India.",
    "Make him smile today. Pick a gift, check out, and the AiiDell team delivers it."]),
 g("Long distance India", "/gifts/long-distance", "long-distance", "india",
   ["long distance relationship gifts india", "ldr gift india", "missing you gift india", "gift for long distance boyfriend"],
   ["Long-Distance Gifts to India", "Missing Them? Send a Hug", "Distance Is Not a Barrier", "Handwritten Love Letters", "Gifts That Make Them Cry"],
   ["Indonesia-India LDR? Send a love letter, flowers, cake or their favourite food in Rupiah.",
    "Missing them? Delivered to their door, with a photo when they receive it."]),
 g("Send chocolates to India", "/gifts/chocolates", "chocolates", "india",
   ["send chocolates to india", "chocolate gift to india", "chocolate hamper india"],
   ["Send Chocolates to India", "No Melting, Bought in India", "Premium Chocolate Hampers", "Chocolates + Flowers + Cake", "Sweet Gifts for Loved Ones"],
   ["Chocolates bought locally in India, so nothing melts on the way. Hampers at good prices.",
    "Send chocolates, hampers and flowers to India from Indonesia. Pay in Rupiah, no customs."]),
 g("Send groceries to India", "/send-items", "groceries", "india",
   ["send groceries to india", "order groceries for family in india", "buy from indian online store from indonesia",
    "send groceries to parents in india", "online grocery delivery india from abroad"],
   ["Send Groceries to India", "Send a Link, We Buy It", "Groceries & Daily Essentials", "From Any Indian Online Store", "For Parents & Family in India"],
   ["Send a link from any Indian online store or app. We buy it and deliver it. Pay in Rupiah.",
    "Groceries, milk, rice and daily essentials. Order placed about 20 minutes after you pay."]),
]

# ======================= Competitor terms (optional, keep paused) =======================
# FNP gets traffic from people who type its name. Google allows bidding on other brands' names as KEYWORDS,
# but not using their trademark in the AD TEXT, so these ads are plain AiiDell ads.
# Plain "fnp" is left out on purpose (it also means "family nurse practitioner").
COMP_GROUPS = [
 g("Gift sites India (competitor terms)", "/send-gifts-to-india", "send-gifts", "india",
   ["fnp india", "fnp gifts", "fnp flowers", "fnp cake", "ferns and petals", "ferns n petals", "fernsnpetals",
    "igp gifts", "winni cake", "floweraura"],
   ["Send Gifts to India", "Pay in Rupiah, Not Rupee", "Made for Indonesia to India", "Hampers, Flowers & Cakes", "No International Card Needed"],
   ["Sending from Indonesia? Pay in Rupiah with QRIS, DANA or OVO. Bought locally in India.",
    "Flowers, cakes, hot food & gifts to India. Same-day flowers before cut-off, food ~40 min."]),
]

NEG = ["gratis", "free", "lowongan", "loker", "kerja", "job", "jobs", "visa", "paspor", "passport", "tiket", "pesawat", "flight",
       "kurir", "courier", "cargo", "kargo", "ekspedisi", "jne", "j&t", "dhl", "fedex", "pos indonesia", "cek resi", "tracking",
       "grosir", "wholesale", "supplier", "resep", "recipe", "film", "lagu", "nurse", "franchise", "career", "share price"]

def shared(c):
    if TWO_HOUR: return c["SH"][:-2] + c["TH"]
    return c["SH"]

def check(camps):
    for c in camps:
        for grp in c["groups"]:
            H = grp["H"] + shared(c); D = grp["D"] + c["SD"]
            assert len(H) == 15 and len(D) == 4, (grp["name"], len(H), len(D))
            assert len(set(H)) == 15, ("duplicate headline", grp["name"])
            for h in H: assert len(h) <= 30, (grp["name"], h, len(h))
            for d in D: assert len(d) <= 90, (grp["name"], d, len(d))
            assert len(grp["p1"]) <= 15 and len(grp["p2"]) <= 15, grp["name"]
            for k in grp["kws"]: assert len(k) <= 80 and len(k.split()) <= 10, k

C = [
 dict(name="ID | Kirim ke India | Bahasa", slug="id-india-bahasa", groups=ID_GROUPS, SH=ID_SHARED_H, TH=ID_TWO_HOUR_H, SD=ID_SHARED_D),
 dict(name="ID | Send to India | English", slug="id-india-en", groups=EN_GROUPS, SH=EN_SHARED_H, TH=EN_TWO_HOUR_H, SD=EN_SHARED_D),
 dict(name="ID | Competitor terms | EN", slug="id-india-competitor", groups=COMP_GROUPS, SH=EN_SHARED_H, TH=EN_TWO_HOUR_H, SD=EN_SHARED_D),
]

COLS = ["Campaign", "Campaign Type", "Campaign Status", "Campaign Daily Budget", "Start Date", "End Date", "Bid Strategy Type", "Networks", "Location", "Languages", "Ad Group", "Ad Group Status", "Max CPC", "Keyword", "Criterion Type", "Ad type", "Final URL", "Path 1", "Path 2"] + [f"Headline {i}" for i in range(1, 16)] + [f"Description {i}" for i in range(1, 5)] + ["Status"]

def build(camps, outfile, budget, cpc, start="", end=""):
    check(camps)
    rows = []
    def row(**k):
        r = {c: "" for c in COLS}; r.update(k); rows.append(r)
    for c in camps:
        # Budget and Max CPC are in the Google Ads ACCOUNT currency (this account is INR).
        row(**{"Campaign": c["name"], "Campaign Type": "Search", "Campaign Status": "Paused", "Campaign Daily Budget": budget, "Start Date": start, "End Date": end, "Bid Strategy Type": "Manual CPC", "Networks": "Google search", "Languages": "Indonesian;English"})
        row(**{"Campaign": c["name"], "Location": "Indonesia", "Status": "Enabled"})
        for n in NEG: row(**{"Campaign": c["name"], "Keyword": n, "Criterion Type": "Negative Phrase", "Status": "Enabled"})
        for grp in c["groups"]:
            row(**{"Campaign": c["name"], "Ad Group": grp["name"], "Ad Group Status": "Paused", "Max CPC": cpc})
            for k in grp["kws"]:
                row(**{"Campaign": c["name"], "Ad Group": grp["name"], "Keyword": k, "Criterion Type": "Phrase", "Status": "Enabled"})
                row(**{"Campaign": c["name"], "Ad Group": grp["name"], "Keyword": k, "Criterion Type": "Exact", "Status": "Enabled"})
            ad = {"Campaign": c["name"], "Ad Group": grp["name"], "Ad type": "Responsive search ad", "Final URL": u(grp["path"], c["slug"]), "Path 1": grp["p1"], "Path 2": grp["p2"], "Status": "Enabled"}
            for i, h in enumerate(grp["H"] + shared(c), 1): ad[f"Headline {i}"] = h
            for i, d in enumerate(grp["D"] + c["SD"], 1): ad[f"Description {i}"] = d
            row(**ad)
    with open(outfile, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=COLS); w.writeheader(); w.writerows(rows)
    n_ads = sum(1 for r in rows if r["Ad type"]); n_kw = sum(1 for r in rows if r["Criterion Type"] in ("Phrase", "Exact"))
    print(f"{outfile}: {len(rows)} rows, {n_ads} ads, {n_kw} keyword rows")

if __name__ == "__main__":
    # 1) Everything (3 campaigns, 23 ad groups). Rs 100/day each, max Rs 10 per click (about Rp 1,900). All paused.
    build(C, "aiidell_indonesia_to_india_google_ads.csv", budget=100, cpc=10)
    # 2) Starter that fits the Rs 1,089 credit: ONLY the Bahasa campaign, Rs 100/day for 10 days = Rs 1,000.
    build(C[:1], "starter_inr_1000_indonesia_bahasa.csv", budget=100, cpc=10, start="2026-11-10", end="2026-11-19")
