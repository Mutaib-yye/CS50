# AiiDell: Indonesia → India Google Search ads (FNP playbook)

People **in Indonesia** search "kirim bunga ke india", "kirim kue ke india", "kado untuk pacar di india" and so on. They see AiiDell, pay in **Rupiah** (QRIS, DANA, OVO, ShopeePay, BCA VA), and AiiDell delivers food, flowers, cakes, gifts and groceries **in India**.

Everything imports **PAUSED**. Nothing spends until you switch it on.

## What we copied from FNP

| FNP does (fnp.com) | AiiDell version |
|---|---|
| Speed first: "60 Mins Delivery", "under 2 hours" | **"Makanan Sampai 40 Menit"** / "Food Delivered in 40 Mins" (true: /food) |
| "Same-Day Delivery" | **"Same Day Delivery ke India"** (flowers and cakes before the daily cut-off) |
| One page per product, occasion, recipient and feeling | **11 ad groups per language**, each going to its own matching AiiDell page |
| Flowers, Cakes, Same Day, Birthday, Anniversary, Boyfriend, Miss You, Chocolates | Same 11 themes, plus **Food** and **Groceries** (FNP has neither) |
| Shoppers pay in Rupee | **Our advantage:** pay in Rupiah with QRIS, DANA or OVO, no international card |

**Not copied, on purpose:**
- The FNP name in ad text: Google disapproves ads that use another brand's trademark.
- "Free Shipping" and "Midnight Delivery": AiiDell doesn't offer these.
- FNP's "8 million customers": that number belongs to FNP.

FNP's name is used only as a **keyword** in the optional "Competitor terms" campaign. Google allows that.

## The campaigns

| Campaign | Ad groups → landing page |
|---|---|
| **ID \| Kirim ke India \| Bahasa** | Kirim hadiah → /kirim-hadiah-ke-india · Bunga → /kirim-bunga-ke-india · Kue → /gifts/cakes · Makanan → /food · Same day → /gifts/same-day · Ulang tahun → /gifts/birthday · Anniversary → /gifts/anniversary · Pacar → /gifts/boyfriend · LDR → /gifts/long-distance · Cokelat → /gifts/chocolates · Groceries → /send-items |
| **ID \| Send to India \| English** | The same 11 themes in English |
| **ID \| Competitor terms \| EN** (optional) | fnp india, ferns n petals, igp gifts, winni cake, floweraura → /send-gifts-to-india |

- **Targeting:** location Indonesia. Languages Indonesian and English. Google Search only (no Display, no search partners). Manual CPC. Phrase and exact match only.
- **Negatives:** 36 per campaign (jobs, visa, courier, JNE, J&T, DHL, cek resi, gratis…).
- **Ads:** 23 responsive search ads, 15 headlines and 4 descriptions each. The script checks every limit.
- **Tracking:** every link carries `utm_source=google&utm_medium=cpc&utm_campaign=…`. Paid IDR orders already fire the Google Ads purchase conversion (`AW-621723520`) with `currency: IDR`.

## Files

- `starter_inr_1000_indonesia_bahasa.csv`: **start with this one.** It is only the Bahasa campaign at Rs 100/day, max Rs 10 per click (about Rp 1,900), running 10–19 Nov. That is about Rs 1,000, which fits your Rs 1,089 credit.
- `aiidell_indonesia_to_india_google_ads.csv`: all 3 campaigns.
- `build_indonesia_campaigns.py`: edit copy or keywords here, then run `python3 build_indonesia_campaigns.py`.

### "Delivered in 2 hours"

The site promises **food in about 40 minutes**. For flowers and cakes it only says **same day**, not 2 hours. If the team can really deliver flowers and cakes within 2 hours, set `TWO_HOUR = True` in the script and re-run. That swaps in "Bunga & Kue Sampai 2 Jam" / "Flowers & Cakes in 2 Hours". If you advertise 2 hours and miss it, you risk complaints and Google flagging the ad as misleading.

## How to publish (about 10 minutes)

**Option A: Google Ads Editor (free, most reliable)**
1. Open Google Ads Editor and sign in to the AiiDell account (390-807-7586).
2. Account → Import → From file → choose `starter_inr_1000_indonesia_bahasa.csv`. Check the preview.
3. Confirm: location Indonesia (presence), languages Indonesian and English, status Paused.
4. Post changes. In Google Ads, enable the campaign **and** its ad groups.

**Option B: from Chrome, with the Claude in Chrome extension.** Open ads.google.com while logged in and paste the prompt in `chrome_prompt.md`.

## Rules after launch
- Check Keyword Planner volume first. Pause ad groups with almost no searches.
- After about 10 days and a few dozen clicks: if one order costs more than it earns, pause it.
- Do not turn on Display, search partners or broad match. Do not raise the budget until orders are profitable.
- Then copy FNP's next step: add city ad groups ("kirim bunga ke delhi / mumbai / bangalore"). The landing pages already exist: /send-gifts-to-delhi, /send-gifts-to-mumbai, /send-gifts-to-bangalore.
