// ===== Variants =====
//  men   (default): two Indian men in India send gifts to Indonesia (English captions)
//  women          : two Indonesian women send gifts to India (Bahasa Indonesia captions)
const VARIANT = (typeof window !== 'undefined' && window.VARIANT) || 'men';
const WOMEN = VARIANT === 'women';

// --- extra palettes for the women's version ---
const _clone = o => JSON.parse(JSON.stringify(o));
// Sari: Indonesian woman in a dusty-blue hijab (the hard way)
WPAL.S = Object.assign(_clone(WPAL.H), {
  top: '#7f8fb8', topDark: '#5a6a96', topHi: '#a9b6d8', hijab: '#9fb3dc', hijabDark: '#6e85b9',
  headset: false, badge: false, seed: 21,
});
// Indian woman on the AiiDell team in India (wheatish Indian skin, AiiDell pink)
WPAL.IW = Object.assign(_clone(WPAL.P), {
  skin: PAL.L.skin, light: PAL.L.light, dark: PAL.L.dark, deep: PAL.L.deep, sss: PAL.L.sss, blushC: PAL.L.blushC, lip: '#b85a68',
  top: '#ff6a9e', topDark: '#d8467f', topHi: '#ffa2c4', flower: false, seed: 31,
});
WPAL.IW.face.eye = _clone(WPAL.H.face.eye); WPAL.IW.face.eye.crease = 5; WPAL.IW.face.eye.creaseA = 0.4; WPAL.IW.face.eye.top = 19;
WPAL.IW.face.nose.bridge = 0.45;
// Indian man on the AiiDell team in India
PAL.TI = Object.assign(_clone(PAL.T), {
  skin: PAL.L.skin, light: PAL.L.light, dark: PAL.L.dark, deep: PAL.L.deep, sss: PAL.L.sss, blushC: PAL.L.blushC, lip: PAL.L.lip, seed: 33,
});
PAL.TI.face = _clone(PAL.R.face);

const V = WOMEN ? {
  leftName: 'Sari', rightName: 'Dewi', leftW: 'S', rightW: 'P',
  destFlag: (c, x, y, w) => inFlag(c, x, y, w), rev: true,
  notes: [['?', 360, 900, -0.12, '#ffe27a'], ['Bea cukai?', 470, 930, 0.08, '#ffb0b0'], ['Jastip??', 90, 860, -0.05, '#a8e6ff'], ['Ongkir?', 200, 900, 0.12, '#ffe27a']],
  forms: [['FORM BEA CUKAI', 0], ['NOTA', 1], ['DEKLARASI', 0], ['FOTO KTP', 1], ['FORM 7B', 0], ['STRUK', 1]],
  billAmts: ['Rp 320rb', 'Rp 75rb', 'Rp 50rb'],
  badges1: ['Belum dibalas', 'Dibaca 2 jam lalu', 'Belum dibalas'], badges2: ['Dibaca', 'Belum dibalas'],
  hold: { head: 'Jastip India', sub: 'Menunggu balasan…', label: 'MENUNGGU', quote: '"Nanti dikabari ya, kak"', queue: 'Antrean titipan: 38', icon: 'clock' },
  pipLabel: 'Sari: masih nunggu jastiper…',
  team: { sub: 'di India', flag: (c, x, y, w) => inFlag(c, x, y, w), w: 'IW', m: 'TI', order: 'PESANAN BARU  #IN-2048', item: 'Hampers Cinta  →  Arjun, India', steps: ['Pesanan diterima', 'Kado disiapkan', 'Sedang diantar'] },
  journey: 'Diantar dengan cinta', surprise: 'Kejutan sampai!',
  call: { name: 'Arjun', sub: 'Panggilan video · 02:14' },
  end: { h1: 'Beda negara.', h2a: 'Satu cara mudah', h2b: 'bikin dia tersenyum.', pill: 'Kirim cinta dengan mudah', items: 'Makanan · Kado · Hampers · Kue · Fashion' },
  cards: {
    searchTitle: 'Cari', q: 'jastip kirim kado ke india', results: 'Sekitar 1.240.000 hasil',
    res: [['Jastip Indonesia–India terpercaya?', 'Forum · 214 balasan · "ada yang berangkat?"'],
      ['Cara kirim kado ke India 2026', 'Aturan bea cukai, barang terlarang...'],
      ['Grup jastip India – daftar tunggu', 'Slot penuh sampai bulan depan'],
      ['Ongkir kurir internasional ke India', 'Mulai Rp 900rb · 7–14 hari kerja'],
      ['Bisa titip makanan ke India?', 'Makanan sering ditahan bea cukai...'],
      ['Jastiper berangkat kapan?', 'Belum ada jadwal pasti...']],
    group: 'Grup Jastip India', groupSub: 'Indonesia → India · 248 anggota', seen: 'Dibaca',
    msgs: [['me', 'Ada yang ke India minggu ini?', 0.2], ['me', 'Kak, bisa titip kado? Plis!', 0.9], ['them', 'Maaf kak, koper udah penuh', 1.5], ['me', 'Ada yang lain? Aku bayar!', 2.1], ['me', 'Halo???', 2.6]],
    quoteTitle: 'Jastip Kak Rina', quoteSub: 'Biaya titip · Indonesia → India',
    rows: [['Biaya titip (per kg)', 'Rp 450.000'], ['Bea masuk India', 'Rp 320.000'], ['Packing aman', 'Rp 75.000'], ['Ongkir lokal di India', 'Rp 180.000'], ['Biaya admin', 'Rp 50.000']],
    totalAmt: 'Rp 1.075.000', note1: 'Berangkat: belum pasti', note2: 'Makanan: tidak bisa dititip', stamp1: 'KOPER', stamp2: 'PENUH',
  },
  caps: [
    [0.6, 3.1, 'Kenalin, ini Sari dan Dewi!'],
    [3.2, 6.0, 'Dua-duanya mau kirim kado spesial ke India.'],
    [6.1, 8.3, 'Tapi lihat Sari…'],
    [8.4, 10.6, 'Cari jastiper ke sana kemari, nggak ada yang bisa…'],
    [10.7, 13.0, '…dan ongkosnya mahal banget!'],
    [13.1, 15.0, 'Kalau Dewi?'],
    [15.1, 17.6, 'Cukup sekali klik di AiiDell.com…'],
    [17.7, 19.8, '…murah, bayar pakai Rupiah!'],
    [20.3, 24.3, 'Tim AiiDell di India yang urus semuanya…'],
    [24.6, 27.8, '…sampai ke depan pintunya!'],
    [28.4, 32.9, 'Ada makanan hangat, hampers, kue, sampai fashion…'],
    [33.0, 37.4, '…semua bisa dikirim dari Indonesia ke India!'],
    [38.2, 40.8, 'Yang satu masih cari jastiper…'],
    [40.9, 43.5, '…yang satu lagi sudah senyum bahagia.'],
  ],
  ai: {
    go: 'Buka', hero1: 'Kirim cinta ke', hero2: 'India', shop: 'Belanja kado', chips: ['Makanan', 'Kado', 'Hampers', 'Kue', 'Fashion'],
    items: [['Hampers Cinta', 'Rp 249.000', 'gift'], ['Kue Cokelat', 'Rp 149.000', 'cake'], ['Buket Mawar', 'Rp 199.000', 'bouquet'], ['Camilan India', 'Rp 89.000', 'snacks']],
    prod: 'gift', prodName: 'Hampers Cinta Spesial', prodDesc: 'Cokelat, camilan & kartu ucapan', price: 'Rp 249.000',
    deliv: 'Diantar ke alamat penerima di India', addCart: '+ Keranjang', recip: 'Data penerima', steps: ['Keranjang', 'Data', 'Bayar'],
    fields: [['Nama', 'Arjun', 6.1], ['Negara', 'India', 6.6], ['Tanggal kirim', 'Hari ini', 7.3], ['Pesan', 'Selamat ulang tahun, sayang!', 7.6]],
    checkout: 'Bayar  ·  Rp 249.000', secure: 'Pembayaran aman', toLine: 'Untuk: Arjun · India', delivery: 'Ongkir', included: 'Termasuk', total: 'Total',
    place: 'Pesan Sekarang', confirmed: 'Pesanan Berhasil!', onway: 'Kadomu sedang diantar', toWhom: 'ke Arjun di India',
  },
} : {
  leftName: 'Rahul', rightName: 'Arjun', leftW: null, rightW: null,
  destFlag: (c, x, y, w) => idFlag(c, x, y, w), rev: false,
  notes: [['?', 360, 900, -0.12, '#ffe27a'], ['Customs?', 470, 930, 0.08, '#ffb0b0'], ['Courier??', 90, 860, -0.05, '#a8e6ff'], ['Tax?', 200, 900, 0.12, '#ffe27a']],
  forms: [['CUSTOMS FORM', 0], ['INVOICE', 1], ['DECLARATION', 0], ['ID PROOF', 1], ['FORM 7B', 0], ['TAX SLIP', 1]],
  billAmts: ['₹2,150', '₹940', '₹650'],
  badges1: ['No reply', 'Seen 2h ago', 'No reply'], badges2: ['Seen', 'No reply'],
  hold: { head: 'Courier Helpline', sub: 'Calling…', label: 'ON HOLD', quote: '"Your call is important to us"', queue: 'Position in queue: 38', icon: 'phone' },
  pipLabel: 'Rahul: still on hold…',
  team: { sub: 'in Indonesia', flag: (c, x, y, w) => idFlag(c, x, y, w), w: 'H', m: 'T', order: 'NEW ORDER  #ID-2048', item: 'Blush Rose Bouquet  →  Putri, Indonesia', steps: ['Order received', 'Gift prepared', 'Out for delivery'] },
  journey: 'Delivered with love', surprise: 'Surprise delivered!',
  call: { name: 'Putri', sub: 'Video call · 02:14' },
  end: { h1: 'Different countries.', h2a: 'One simple way to', h2b: 'make someone smile.', pill: 'Send love the easy way', items: 'Flowers · Gifts · Food · Snacks · Cakes' },
  caps: null,
  ai: {
    go: 'Go', hero1: 'Send love to', hero2: 'Indonesia', shop: 'Shop gifts', chips: ['Flowers', 'Gifts', 'Food', 'Snacks', 'Cakes'],
    items: [['Blush Roses', '₹1,999', 'bouquet'], ['Choco Cake', '₹1,499', 'cake'], ['Gift Hamper', '₹2,299', 'gift'], ['Indian Sweets', '₹899', 'snacks']],
    prod: 'bouquet', prodName: 'Blush Rose Bouquet', prodDesc: '12 premium pink roses, hand-tied', price: '₹1,999',
    deliv: 'Delivered anywhere in Indonesia', addCart: 'Add to Cart', recip: 'Recipient details', steps: ['Cart', 'Details', 'Pay'],
    fields: [['Name', 'Putri', 6.1], ['Country', 'Indonesia', 6.6], ['Delivery date', 'Today', 7.3], ['Gift message', 'Happy Birthday, sayang!', 7.6]],
    checkout: 'Checkout  ·  ₹1,999', secure: 'Secure checkout', toLine: 'To: Putri · Indonesia', delivery: 'Delivery', included: 'Included', total: 'Total',
    place: 'Place Order', confirmed: 'Order Confirmed!', onway: 'Your gift is on its way', toWhom: 'to Putri in Indonesia',
  },
};
function prodFn(k) { return { bouquet: drawBouquet, cake: drawCake, gift: drawGiftBox, snacks: drawSnacks }[k]; }

// screen-recording frames for the women's ending (extracted by tools/extract_rec.sh into out/rec/)
const REC = { a: [], b: [] };
const REC_SEG = { a: { from: 0.5, n: 270 }, b: { from: 15.5, n: 195 } };   // 30 fps frames
function loadRecFrames() {
  if (!WOMEN || typeof Image === 'undefined') return Promise.resolve(true);
  const ps = [];
  ['a', 'b'].forEach(k => {
    for (let i = 1; i <= REC_SEG[k].n; i++) {
      const img = new Image();
      ps.push(new Promise(r => { img.onload = r; img.onerror = r; }));
      img.src = `out/rec/${k}_${String(i).padStart(4, '0')}.jpg`;
      REC[k].push(img);
    }
  });
  return Promise.all(ps).then(() => true);
}
