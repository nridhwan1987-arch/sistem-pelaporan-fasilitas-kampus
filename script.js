'use strict';
/* Data, konstanta, dan penyimpanan (localStorage) */
const STORAGE_KEY = 'silapor-data-v3';
const AUTH_KEY = 'silapor-auth';
const PREF_KEY = 'silapor-pref';
const ADMIN = { username: 'admin', password: 'admin123' }; // akun demo (tanpa server)

const KATEGORI = [
  { nama: 'AC & Pendingin', ikon: 'bi-snow2', warna: '#1D6F8F' },
  { nama: 'Proyektor & Audio', ikon: 'bi-projector', warna: '#5B4B9A' },
  { nama: 'Kelistrikan & Lampu', ikon: 'bi-lightbulb', warna: '#A8730A' },
  { nama: 'Meja & Kursi', ikon: 'bi-table', warna: '#7A5230' },
  { nama: 'Toilet & Air', ikon: 'bi-droplet', warna: '#1B7F8C' },
  { nama: 'Jaringan Wi-Fi', ikon: 'bi-wifi', warna: '#2F7D4F' },
  { nama: 'Lainnya', ikon: 'bi-three-dots', warna: '#4B5563' }
];
const KAT_LAIN_INDEX = KATEGORI.length - 1;

const GEDUNG = ['Gedung A', 'Gedung F', 'Gedung G', 'Gedung RV', 'Perpustakaan', 'Lab Komputer'];
const STATUS = [
  { label: 'Menunggu Verifikasi', kelas: 'bg-danger', warna: '#DC3545', langkah: 'Laporan diterima' },
  { label: 'Sedang Diperbaiki', kelas: 'bg-warning text-dark', warna: '#FFC107', langkah: 'Diverifikasi dan diproses petugas' },
  { label: 'Selesai Diperbaiki', kelas: 'bg-success', warna: '#198754', langkah: 'Perbaikan selesai' }
];

/* Gambar pengganti (SVG) agar data contoh tidak berupa foto kosong */
function ilustrasi(teks, warna) {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="${warna}"/>` +
    `<rect x="24" y="24" width="352" height="212" rx="10" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-dasharray="8 6"/>` +
    `<text x="200" y="130" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">${teks.replace(/&/g, '&amp;')}</text>` +
    `<text x="200" y="164" font-family="Arial,sans-serif" font-size="16" fill="#fff" fill-opacity=".85" text-anchor="middle">Ilustrasi contoh</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(s);
}
const fotoKategori = (k, teksKustom) => ilustrasi(teksKustom || KATEGORI[k].nama, KATEGORI[k].warna);
const fotoSelesai = () => ilustrasi('Sudah diperbaiki', '#198754');
const hariLalu = n => new Date(Date.now() - n * 864e5).toISOString();

const namaKategoriLaporan = r => {
  const base = KATEGORI[r.kat]?.nama || 'Lainnya';
  return (r.kat === KAT_LAIN_INDEX && r.katLain) ? `${base} (${r.katLain})` : base;
};

const CONTOH = [
  ['Rina Maharani', '2210101234', 'Gedung F', 'Ruang 204', 0, 'AC menyala tetapi tidak dingin dan meneteskan air ke lantai sehingga ruang kelas terasa pengap.', 9, 2, 'Freon diisi ulang dan filter dibersihkan.'],
  ['Dimas Prakoso', '2210105678', 'Gedung A', 'Lantai 2', 4, 'Keran toilet bocor terus-menerus dan lantai tergenang sehingga licin.', 8, 1, 'Teknisi sedang mengganti keran dan sambungan pipa.'],
  ['Salsa Nuraini', '2210102211', 'Perpustakaan', 'Area baca', 5, 'Wi-Fi terputus setiap beberapa menit sehingga sulit mengakses jurnal daring.', 7, 2, 'Access point diganti dan sinyal sudah stabil.'],
  ['Bagas Wicaksono', '2210109090', 'Lab Komputer', 'Lab 3', 2, 'Tiga stop kontak mati sehingga komputer praktikum tidak dapat dinyalakan.', 6, 1, 'Instalasi listrik sedang diperiksa.'],
  ['Putri Anggraini', '2210103344', 'Gedung G', 'Ruang 101', 1, 'Gambar proyektor buram dan pengeras suara tidak berbunyi.', 5, 0, ''],
  ['Fajar Nugroho', '2210104455', 'Gedung A', 'Ruang 305', 3, 'Sepuluh kursi patah pada bagian sandaran dan membahayakan pengguna.', 4, 0, ''],
  ['Anisa Rahma', '2210106677', 'Gedung RV', 'Lantai 1', 2, 'Lampu koridor mati total sehingga area gelap saat kuliah sore.', 3, 1, 'Lampu pengganti sudah dipesan.'],
  ['Yoga Pratama', '2210107788', 'Gedung RV', 'Ruang 210', 0, 'AC berbunyi keras dan mengeluarkan bau tidak sedap.', 2, 0, ''],
  ['Maya Sari', '198507122010', 'Perpustakaan', 'Lantai 2', 3, 'Meja diskusi goyang dan salah satu kakinya hampir lepas.', 1, 0, ''],
  ['Rafi Hakim', '2210108899', 'Gedung A', 'Ruang 102', 1, 'Mikrofon ruang kelas tidak menyala meskipun baterai sudah diganti.', 1, 0, '']
];

function buatDataAwal() {
  return CONTOH.map(([nama, nim, gedung, ruang, kat, desk, hari, status, catatan], i) => {
    const log = [[hariLalu(hari), 0, 'Laporan diterima sistem.']];
    if (status >= 1) log.push([hariLalu(Math.max(hari - 1, .5)), 1, catatan]);
    if (status >= 2) log.push([hariLalu(Math.max(hari - 2, .2)), 2, catatan]);
    return {
      kode: 'TIKET-2026-' + String(80 + i).padStart(3, '0'),
      nama,
      nim,
      kontak: '0812345' + (6000 + i),
      gedung,
      ruang,
      kat,
      katLain: '',
      desk,
      foto: fotoKategori(kat),
      status,
      catatan,
      fotoSelesai: status === 2 ? fotoSelesai() : null,
      tgl: hariLalu(hari),
      log
    };
  });
}

const Store = {
  load() {
    try { const d = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (Array.isArray(d)) return d; } catch (e) { /* abaikan */ }
    const d = buatDataAwal(); this.save(d); return d;
  },
  save(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); return true; } catch (e) { return false; } },
  reset() { const d = buatDataAwal(); this.save(d); return d; }
};

/* Fungsi bantu dan komponen tampilan */
const $ = s => document.querySelector(s);
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtTgl = d => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const fmtWaktu = d => new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const badge = s => `<span class="badge rounded-pill ${STATUS[s].kelas}">${STATUS[s].label}</span>`;
const formatUkuran = b => b < 1048576 ? Math.max(1, Math.round(b / 1024)) + ' KB' : (b / 1048576).toFixed(1) + ' MB';

let toastObj;
function toast(pesan) {
  $('#tm').textContent = pesan;
  (toastObj = toastObj || new bootstrap.Toast('#toast', { delay: 3500 })).show();
}
const modal = id => bootstrap.Modal.getOrCreateInstance(id);

function kartuLaporan(r) {
  const k = KATEGORI[r.kat] || KATEGORI[KAT_LAIN_INDEX];
  const labelKat = namaKategoriLaporan(r);
  return `<div class="col-md-6 col-lg-4"><div class="card gal h-100 shadow-sm" data-t="${r.kode}" tabindex="0" role="link" aria-label="Lihat perkembangan laporan ${r.kode}, ${esc(labelKat)}, ${STATUS[r.status].label}">
    <img src="${r.foto}" alt="Foto kerusakan ${esc(labelKat)} di ${esc(r.gedung)}" loading="lazy">
    <div class="card-body"><div class="d-flex justify-content-between align-items-start gap-2 mb-2"><small class="fw-bold text-secondary">${r.kode}</small>${badge(r.status)}</div>
    <h3 class="h6 fw-bold mb-1"><i class="bi ${k.ikon} me-1 navy" aria-hidden="true"></i>${esc(labelKat)}</h3>
    <div class="small text-secondary"><i class="bi bi-geo-alt me-1" aria-hidden="true"></i>${esc(r.gedung)}, ${esc(r.ruang)}</div>
    <div class="small text-secondary"><i class="bi bi-calendar3 me-1" aria-hidden="true"></i>${fmtTgl(r.tgl)}</div></div></div></div>`;
}

function timeline(r) {
  return `<ol class="tl">${r.log.map(([t, s, c]) => `<li style="--c:${STATUS[s].warna}"><b>${STATUS[s].langkah}</b>
    <div class="small text-secondary">${fmtWaktu(t)}</div>${c ? `<div class="mt-1">Catatan petugas: ${esc(c)}</div>` : ''}</li>`).join('')}</ol>`;
}

function ringkasan(data) {
  const c = [0, 0, 0]; data.forEach(r => c[r.status]++);
  return [['Total laporan masuk', data.length, '#0F2C59'], ['Menunggu verifikasi', c[0], '#DC3545'], ['Sedang diperbaiki', c[1], '#FFC107'], ['Selesai diperbaiki', c[2], '#198754']]
    .map(([l, v, w]) => `<div class="col-6 col-lg-3"><div class="card metric shadow-sm h-100" style="--c:${w}"><div class="card-body"><div class="n">${v}</div><div class="text-secondary small fw-semibold mt-1">${l}</div></div></div></div>`).join('');
}

/* Perkecil gambar sebelum disimpan. Mengembalikan data URL atau null bila gagal. */
function perkecilGambar(file) {
  return new Promise(res => {
    const rd = new FileReader();
    rd.onerror = () => res(null);
    rd.onload = () => {
      const im = new Image();
      im.onerror = () => res(null);
      im.onload = () => {
        const s = Math.min(1, 900 / im.width), c = document.createElement('canvas');
        c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', .75));
      };
      im.src = rd.result;
    };
    rd.readAsDataURL(file);
  });
}

/* Validasi berkas gambar. Mengembalikan pesan galat atau '' bila valid. */
function cekGambar(f) {
  if (!f) return '';
  if (!/^image\/(jpeg|png)$/.test(f.type)) return 'Format foto harus JPG atau PNG.';
  if (f.size > 5 * 1024 * 1024) return 'Ukuran foto melebihi 5 MB.';
  return '';
}

/* Logika utama: routing, formulir, pelacakan, login, dan dashboard admin */
let data = Store.load();
const sudahLogin = () => sessionStorage.getItem(AUTH_KEY) === '1';
const urut = () => [...data].sort((a, b) => new Date(b.tgl) - new Date(a.tgl));
const JUDUL = { home: 'Beranda', galeri: 'Daftar Laporan', lapor: 'Buat Laporan', lacak: 'Cek Status Laporan', login: 'Login Admin', admin: 'Dashboard Admin' };

/* ---------- Aksesibilitas ---------- */
function terapkanPref(p) {
  document.documentElement.classList.remove('t1', 't2');
  if (p.size) document.documentElement.classList.add('t' + p.size);
  document.body.classList.toggle('hc', !!p.hc);
  document.querySelectorAll('[data-size]').forEach(b => b.classList.toggle('on', +b.dataset.size === p.size));
  $('#hcBtn').setAttribute('aria-pressed', !!p.hc); $('#hcBtn').classList.toggle('on', !!p.hc);
}
let pref = { size: 0, hc: false };
try { pref = Object.assign(pref, JSON.parse(localStorage.getItem(PREF_KEY))); } catch (e) { /* abaikan */ }
const simpanPref = () => { terapkanPref(pref); try { localStorage.setItem(PREF_KEY, JSON.stringify(pref)); } catch (e) { /* abaikan */ } };
document.querySelectorAll('[data-size]').forEach(b => b.onclick = () => { pref.size = +b.dataset.size; simpanPref(); });
$('#hcBtn').onclick = () => { pref.hc = !pref.hc; simpanPref(); };
terapkanPref(pref);

/* ---------- Filter Daftar Laporan (Galeri) ---------- */
$('#gFilterStatus').innerHTML += STATUS.map((s, i) => `<option value="${i}">${s.label}</option>`).join('');
$('#gFilterKat').innerHTML += KATEGORI.map((k, i) => `<option value="${i}">${k.nama}</option>`).join('');

function renderGaleri() {
  const fTgl = $('#gFilterTgl').value;
  const fStatus = +$('#gFilterStatus').value;
  const fKat = +$('#gFilterKat').value;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const hasil = urut().filter(r => {
    const cocokStatus = fStatus < 0 || r.status === fStatus;
    const cocokKat = fKat < 0 || r.kat === fKat;
    let cocokTgl = true;
    if (fTgl !== 'all') {
      const waktuLaporan = new Date(r.tgl).getTime();
      if (fTgl === 'today') {
        cocokTgl = waktuLaporan >= startOfToday;
      } else {
        const batasHari = Number(fTgl) * 864e5;
        cocokTgl = (Date.now() - waktuLaporan) <= batasHari;
      }
    }
    return cocokStatus && cocokKat && cocokTgl;
  });

  $('#galCount').textContent = `Menampilkan ${hasil.length} dari ${data.length} laporan`;
  $('#all').innerHTML = hasil.length
    ? hasil.map(kartuLaporan).join('')
    : '<div class="col-12"><div class="alert alert-light border text-center text-secondary py-4">Tidak ada laporan yang sesuai dengan filter yang dipilih.</div></div>';
}

['#gFilterTgl', '#gFilterStatus', '#gFilterKat'].forEach(sel => {
  $(sel).addEventListener('change', renderGaleri);
});

/* ---------- Router ---------- */
const HALAMAN = ['home', 'galeri', 'lapor', 'lacak', 'login', 'admin'];
function route() {
  const bagian = (location.hash.slice(2) || 'home').split('/');
  let p = bagian[0], arg = bagian[1] ? decodeURIComponent(bagian[1]) : '';
  if (!HALAMAN.includes(p)) p = 'home';
  if (p === 'admin' && !sudahLogin()) p = 'login';
  if (p === 'login' && sudahLogin()) p = 'admin';
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + p));
  document.querySelectorAll('.nav-link').forEach(a => {
    const on = a.dataset.r.split(' ').includes(p);
    a.classList.toggle('active', on);
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
  $('#navAdm').textContent = sudahLogin() ? 'Dashboard Admin' : 'Login Admin';
  $('#navAdm').setAttribute('href', sudahLogin() ? '#/admin' : '#/login');
  document.title = JUDUL[p] + ' | SiLapor Kampus';
  if (p === 'home') { $('#stats').innerHTML = ringkasan(data); $('#latest').innerHTML = urut().slice(0, 6).map(kartuLaporan).join(''); }
  if (p === 'galeri') renderGaleri();
  if (p === 'lacak') { $('#lacakOut').innerHTML = ''; $('#tk').value = arg; if (arg) lacak(arg); }
  if (p === 'admin') { $('#aStats').innerHTML = ringkasan(data); tabel(); }
  scrollTo(0, 0); $('#main').focus({ preventScroll: true });
  bootstrap.Collapse.getInstance('#nv')?.hide();
}
addEventListener('hashchange', route);
document.addEventListener('click', e => { const c = e.target.closest('.gal'); if (c) location.hash = '#/lacak/' + encodeURIComponent(c.dataset.t); });
document.addEventListener('keydown', e => { if (e.key === 'Enter') { const c = e.target.closest?.('.gal'); if (c) location.hash = '#/lacak/' + encodeURIComponent(c.dataset.t); } });

/* ---------- Formulir pelaporan ---------- */
$('#gedung').innerHTML = '<option value="">Pilih gedung</option>' + GEDUNG.map(g => `<option>${g}</option>`).join('');
$('#kat').innerHTML = KATEGORI.map((k, i) => `<div class="col-6 col-sm-4 col-md-3 col-lg"><input type="radio" name="kat" id="k${i}" value="${i}"><label for="k${i}"><i class="bi ${k.ikon}" aria-hidden="true"></i>${k.nama}</label></div>`).join('');

function perbaruiInputKatLain() {
  const terpilihKat = document.querySelector('input[name=kat]:checked');
  const isLainnya = terpilihKat && +terpilihKat.value === KAT_LAIN_INDEX;
  const wrap = $('#katLainWrap');
  const inputLain = $('#katLain');
  wrap.classList.toggle('d-none', !isLainnya);
  inputLain.required = !!isLainnya;
  if (!isLainnya) inputLain.value = '';
}

$('#kat').addEventListener('change', () => {
  $('#katErr').classList.add('d-none');
  perbaruiInputKatLain();
});

$('#desk').oninput = e => { $('#cnt').textContent = e.target.value.length + ' / 500 karakter'; };

/* Upload foto: pratinjau, info file, dan tombol hapus */
function kosongkanFoto() {
  $('#foto').value = '';
  $('#prev').removeAttribute('src');
  $('#fotoBox').classList.add('d-none');
  $('#fotoErr').textContent = '';
  $('#fotoErr').classList.add('d-none');
}

$('#foto').onchange = async e => {
  const f = e.target.files[0], err = cekGambar(f);
  $('#fotoErr').textContent = err;
  $('#fotoErr').classList.toggle('d-none', !err);
  if (err) { e.target.value = ''; $('#prev').removeAttribute('src'); $('#fotoBox').classList.add('d-none'); return; }
  if (!f) { kosongkanFoto(); return; }
  const u = await perkecilGambar(f);
  if ($('#foto').files[0] !== f) return; // foto sudah dihapus atau diganti selama diproses
  if (u) {
    $('#prev').src = u;
    $('#fotoNama').textContent = f.name;
    $('#fotoUkuran').textContent = formatUkuran(f.size);
    $('#fotoBox').classList.remove('d-none');
  } else {
    kosongkanFoto();
    $('#fotoErr').textContent = 'Foto tidak dapat dibaca. Coba pilih foto lain.';
    $('#fotoErr').classList.remove('d-none');
  }
};

$('#fotoHapus').onclick = () => {
  kosongkanFoto();
  toast('Foto dihapus. Kamu bisa memilih foto lain.');
  $('#foto').focus();
};

$('#form').onsubmit = async e => {
  e.preventDefault();
  const f = e.target, k = document.querySelector('input[name=kat]:checked');
  $('#katErr').classList.toggle('d-none', !!k);
  if (!f.checkValidity() || !k) {
    f.classList.add('was-validated');
    (f.querySelector(':invalid') || document.querySelector('.kat input'))?.focus();
    return;
  }
  const idxKat = +k.value;
  const teksKatLain = idxKat === KAT_LAIN_INDEX ? $('#katLain').value.trim() : '';
  const file = $('#foto').files[0];
  const foto = file ? (await perkecilGambar(file)) || fotoKategori(idxKat, teksKatLain) : fotoKategori(idxKat, teksKatLain);
  const now = new Date().toISOString();
  const n = Math.max(79, ...data.map(r => +r.kode.split('-')[2])) + 1;
  const kode = 'TIKET-' + new Date().getFullYear() + '-' + String(n).padStart(3, '0');

  data.push({
    kode,
    nama: $('#nama').value.trim(),
    nim: $('#nim').value.trim(),
    kontak: $('#kontak').value.trim(),
    gedung: $('#gedung').value,
    ruang: $('#ruang').value.trim(),
    kat: idxKat,
    katLain: teksKatLain,
    desk: $('#desk').value.trim(),
    foto,
    status: 0,
    catatan: '',
    fotoSelesai: null,
    tgl: now,
    log: [[now, 0, 'Laporan diterima sistem.']]
  });
  if (!Store.save(data)) { data.pop(); toast('Penyimpanan penuh. Gunakan foto berukuran lebih kecil.'); return; }
  f.reset();
  f.classList.remove('was-validated');
  perbaruiInputKatLain();
  kosongkanFoto();
  $('#cnt').textContent = '0 / 500 karakter';
  $('#tkNo').textContent = kode;
  $('#goTrack').href = '#/lacak/' + kode;
  modal('#mTiket').show();
};
$('#cp').onclick = async () => {
  const t = $('#tkNo').textContent;
  try { await navigator.clipboard.writeText(t); } catch (e) { const i = document.createElement('input'); i.value = t; document.body.append(i); i.select(); document.execCommand('copy'); i.remove(); }
  toast('Nomor tiket disalin: ' + t);
};

/* ---------- Pelacakan ---------- */
function lacak(kode) {
  const r = data.find(x => x.kode === kode.trim().toUpperCase()), k = r && (KATEGORI[r.kat] || KATEGORI[KAT_LAIN_INDEX]);
  const labelKat = r ? namaKategoriLaporan(r) : '';
  $('#lacakOut').innerHTML = r ? `<div class="card shadow-sm"><div class="card-body p-4">
    <div class="d-flex justify-content-between flex-wrap gap-2 mb-3"><h2 class="h5 fw-bold mb-0 navy">${r.kode}</h2>${badge(r.status)}</div>
    <div class="row g-3 mb-4"><div class="col-md-5"><img class="img-fluid rounded-3 border" src="${r.foto}" alt="Foto kerusakan ${esc(labelKat)}"></div>
    <div class="col-md-7"><p class="fw-semibold mb-1"><i class="bi ${k.ikon} me-1 navy" aria-hidden="true"></i>${esc(labelKat)}</p><p class="text-secondary small mb-2"><i class="bi bi-geo-alt me-1" aria-hidden="true"></i>${esc(r.gedung)}, ${esc(r.ruang)}</p><p class="mb-0">${esc(r.desk)}</p></div></div>
    <h3 class="h6 fw-bold mb-3">Progres penanganan</h3>${timeline(r)}
    ${r.fotoSelesai ? `<h3 class="h6 fw-bold mt-2">Foto setelah diperbaiki</h3><img class="img-fluid rounded-3 border" style="max-width:320px" src="${r.fotoSelesai}" alt="Foto setelah perbaikan">` : ''}</div></div>`
    : `<div class="alert alert-warning" role="alert">Tiket <b>${esc(kode)}</b> tidak ditemukan. Periksa kembali penulisan nomor tiket.</div>`;
}
$('#fLacak').onsubmit = e => { e.preventDefault(); const v = $('#tk').value.trim(); if (v) location.hash = '#/lacak/' + encodeURIComponent(v.toUpperCase()); };

/* ---------- Login ---------- */
$('#showPw').onchange = e => { $('#pw').type = e.target.checked ? 'text' : 'password'; };
$('#fLogin').onsubmit = e => {
  e.preventDefault();
  if ($('#us').value.trim() === ADMIN.username && $('#pw').value === ADMIN.password) {
    sessionStorage.setItem(AUTH_KEY, '1'); $('#lgErr').classList.add('d-none'); e.target.reset(); $('#pw').type = 'password';
    location.hash = '#/admin'; route(); toast('Berhasil masuk sebagai petugas sarpras.');
  } else { $('#lgErr').classList.remove('d-none'); $('#pw').value = ''; $('#pw').focus(); }
};
$('#logout').onclick = () => { sessionStorage.removeItem(AUTH_KEY); location.hash = '#/'; route(); toast('Anda telah keluar.'); };

/* ---------- Dashboard admin ---------- */
$('#fs').innerHTML += STATUS.map((s, i) => `<option value="${i}">${s.label}</option>`).join('');
$('#fg').innerHTML += GEDUNG.map(g => `<option>${g}</option>`).join('');
$('#us2').innerHTML = STATUS.map((s, i) => `<option value="${i}">${s.label}</option>`).join('');
function tabel() {
  const q = $('#s').value.toLowerCase().trim(), fs = +$('#fs').value, fg = $('#fg').value;
  const rows = urut().filter(r => (fs < 0 || r.status === fs) && (!fg || r.gedung === fg) && (!q || [r.kode, r.nama, r.gedung, r.ruang].join(' ').toLowerCase().includes(q)));
  $('#rowCount').textContent = `Menampilkan ${rows.length} dari ${data.length} laporan`;
  $('#tb').innerHTML = rows.length ? rows.map(r => `<tr><td class="fw-semibold">${r.kode}</td><td><img class="mini" src="${r.foto}" alt="" loading="lazy"></td>
    <td>${esc(r.nama)}<div class="small text-secondary">${esc(r.nim)}</div></td><td>${esc(r.gedung)}<div class="small text-secondary">${esc(r.ruang)}</div></td>
    <td>${esc(namaKategoriLaporan(r))}</td><td>${fmtTgl(r.tgl)}</td><td>${badge(r.status)}</td>
    <td class="text-end text-nowrap"><button class="btn btn-sm btn-outline-navy" data-a="det" data-k="${r.kode}" aria-label="Detail ${r.kode}">Detail</button>
    <button class="btn btn-sm btn-navy" data-a="upd" data-k="${r.kode}" aria-label="Update status ${r.kode}">Update</button>
    <button class="btn btn-sm btn-outline-danger" data-a="del" data-k="${r.kode}" aria-label="Hapus ${r.kode}">Hapus</button></td></tr>`).join('')
    : '<tr><td colspan="8" class="text-center text-secondary py-4">Tidak ada laporan yang sesuai dengan pencarian atau filter.</td></tr>';
}
['#s', '#fs', '#fg'].forEach(i => $(i).addEventListener('input', tabel));
let terpilih = null;
$('#tb').onclick = e => {
  const b = e.target.closest('[data-a]'); if (!b) return; terpilih = data.find(x => x.kode === b.dataset.k); if (!terpilih) return;
  const r = terpilih, labelKat = namaKategoriLaporan(r);
  if (b.dataset.a === 'det') {
    $('#mdT').textContent = 'Detail ' + r.kode;
    $('#mdB').innerHTML = `<div class="row g-3"><div class="col-md-6"><img class="img-fluid rounded-3 border w-100" src="${r.foto}" alt="Foto kerusakan ${esc(labelKat)}"></div>
      <div class="col-md-6"><p class="mb-2">${badge(r.status)}</p><p class="fw-semibold mb-1">${esc(labelKat)}</p><p class="small text-secondary mb-2">${esc(r.gedung)}, ${esc(r.ruang)}</p><p>${esc(r.desk)}</p>
      <p class="small text-secondary mb-0">Pelapor: ${esc(r.nama)} (${esc(r.nim)})<br>Kontak: ${esc(r.kontak)}</p></div></div><hr><h3 class="h6 fw-bold mb-3">Progres penanganan</h3>${timeline(r)}
      ${r.fotoSelesai ? `<img class="img-fluid rounded-3 border" style="max-width:300px" src="${r.fotoSelesai}" alt="Foto setelah perbaikan">` : ''}`;
    modal('#mDet').show();
  }
  if (b.dataset.a === 'upd') { $('#muT').textContent = 'Update ' + r.kode; $('#us2').value = r.status; $('#cat').value = ''; $('#fs2').value = ''; $('#fs2Box').classList.add('d-none'); $('#fUpd').classList.remove('was-validated'); modal('#mUpd').show(); }
  if (b.dataset.a === 'del') { $('#mxB').textContent = `Laporan ${r.kode} dari ${r.nama} akan dihapus permanen. Lanjutkan?`; modal('#mDel').show(); }
};
$('#delOk').onclick = () => {
  const kode = terpilih.kode; data = data.filter(x => x !== terpilih); Store.save(data); modal('#mDel').hide(); tabel(); $('#aStats').innerHTML = ringkasan(data); toast('Laporan ' + kode + ' telah dihapus.');
};

/* Foto setelah diperbaiki (admin): info file dan tombol hapus */
function segarkanFs2() {
  const f = $('#fs2').files[0], err = cekGambar(f);
  if (err) { toast(err); $('#fs2').value = ''; }
  const ada = !err && !!f;
  $('#fs2Box').classList.toggle('d-none', !ada);
  if (ada) $('#fs2Nama').textContent = f.name + ' (' + formatUkuran(f.size) + ')';
}
$('#fs2').addEventListener('change', segarkanFs2);
$('#fs2Hapus').onclick = () => { $('#fs2').value = ''; segarkanFs2(); $('#fs2').focus(); };

$('#fUpd').onsubmit = async e => {
  e.preventDefault(); const f = e.target;
  if (!$('#cat').value.trim()) { f.classList.add('was-validated'); $('#cat').focus(); return; }
  const file = $('#fs2').files[0], err = cekGambar(file); if (err) { toast(err); return; }
  const s = +$('#us2').value, cat = $('#cat').value.trim();
  terpilih.status = s; terpilih.catatan = cat; terpilih.log.push([new Date().toISOString(), s, cat]);
  if (file) terpilih.fotoSelesai = await perkecilGambar(file); else if (s === 2 && !terpilih.fotoSelesai) terpilih.fotoSelesai = fotoSelesai();
  Store.save(data); modal('#mUpd').hide(); tabel(); $('#aStats').innerHTML = ringkasan(data); toast(terpilih.kode + ' kini berstatus ' + STATUS[s].label + '.');
};
$('#resetBtn').onclick = () => { data = Store.reset(); tabel(); $('#aStats').innerHTML = ringkasan(data); toast('Data contoh dikembalikan ke kondisi awal.'); };

route();
