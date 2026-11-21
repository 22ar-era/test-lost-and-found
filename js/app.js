/* =========================================================
   Lost & Found FILKOM — Frontend SPA Application
   100% Faithful to all 18 Figma High-Fidelity Screens
   ========================================================= */

let appState = loadState();

const uiState = {
  view: 'landing',
  selectedFoundId: 'FND-007',
  selectedPendingId: 'PND-001',
  selectedHistoryId: 'LAP-2026-014',
  filters: {
    keyword: '',
    category: 'Semua',
    location: 'Semua',
    date: ''
  },
  cancelContext: null
};

// ---------- Helpers ----------
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTodayIndo() {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const d = new Date();
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatNowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getStatusPill(status) {
  if (status === 'Dicari' || status === 'Menunggu Verifikasi' || status === 'Diajukan') {
    return `<span class="lf-pill lf-pill-yellow">${escapeHtml(status)}</span>`;
  }
  if (status === 'Ada Kecocokan' || status === 'Disetujui' || status === 'Dikembalikan') {
    return `<span class="lf-pill lf-pill-green">${escapeHtml(status)}</span>`;
  }
  if (status === 'Ditolak' || status === 'Dibatalkan') {
    return `<span class="lf-pill lf-pill-coral">${escapeHtml(status)}</span>`;
  }
  return `<span class="lf-pill lf-pill-white">${escapeHtml(status)}</span>`;
}

function showToast(message, variant = 'dark') {
  const container = document.getElementById('toast-container');
  const id = 'toast-' + Date.now();
  const bgClass = variant === 'success' ? 'text-bg-success' : variant === 'danger' ? 'text-bg-danger' : 'text-bg-dark';
  container.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="toast align-items-center ${bgClass} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body fw-medium">${escapeHtml(message)}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `);
  const el = document.getElementById(id);
  const toast = new bootstrap.Toast(el, { delay: 3000 });
  toast.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

// ---------- Navigation ----------
function navigate(view, params = {}) {
  if (params.foundId) uiState.selectedFoundId = params.foundId;
  if (params.historyId) uiState.selectedHistoryId = params.historyId;
  if (params.keyword !== undefined) uiState.filters.keyword = params.keyword;

  const mahasiswaViews = ['dashboard', 'report-lost', 'report-found', 'claim-form', 'my-claims'];
  const authRequiredViews = ['found-list', 'found-detail'];
  const satpamViews = ['satpam-verify', 'satpam-claims', 'satpam-history', 'satpam-history-detail'];

  if (authRequiredViews.includes(view) && !appState.currentUser) {
    uiState.view = 'choose-role';
    showToast('Silakan masuk terlebih dahulu untuk melihat barang temuan.');
  } else if (mahasiswaViews.includes(view) && (!appState.currentUser || appState.currentUser.role !== 'mahasiswa')) {
    uiState.view = 'login-mahasiswa';
    showToast('Silakan login sebagai Mahasiswa terlebih dahulu.');
  } else if (satpamViews.includes(view) && (!appState.currentUser || appState.currentUser.role !== 'satpam')) {
    uiState.view = 'login-satpam';
    showToast('Silakan login sebagai Satpam terlebih dahulu.');
  } else {
    uiState.view = view;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}

function logout() {
  appState.currentUser = null;
  saveState(appState);
  showToast('Berhasil keluar.');
  navigate('landing');
}

// ---------- Navbar ----------
function renderNavbar() {
  const nav = document.getElementById('app-navbar');
  const authViews = ['choose-role', 'login-mahasiswa', 'login-satpam'];

  if (authViews.includes(uiState.view)) {
    nav.innerHTML = '';
    nav.classList.add('d-none');
    return;
  }
  nav.classList.remove('d-none');

  const homeTarget = appState.currentUser
    ? (appState.currentUser.role === 'satpam' ? 'satpam-verify' : 'dashboard')
    : 'landing';

  const brandHtml = `
    <a class="lf-brand" onclick="navigate('${homeTarget}')">
      <span>Lost &amp; Found</span>
      <span><span class="lf-brand-fil">FIL</span><span class="lf-brand-kom">KOM</span></span>
    </a>
  `;

  // Screen 00 · Landing Navbar
  if (!appState.currentUser) {
    nav.innerHTML = `
      <nav class="navbar navbar-expand-lg bg-white py-3">
        <div class="container">
          ${brandHtml}
          <a class="lf-role-pill" style="cursor:pointer;" onclick="navigate('choose-role')">Masuk</a>
        </div>
      </nav>
    `;
    return;
  }

  // Mahasiswa Navbar (Screens 04-12)
  if (appState.currentUser.role === 'mahasiswa') {
    const links = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'report-lost', label: 'Lapor Kehilangan' },
      { id: 'report-found', label: 'Lapor Temuan' },
      { id: 'found-list', label: 'Cari Barang' },
      { id: 'my-claims', label: 'Status Klaim' }
    ];
    nav.innerHTML = `
      <nav class="navbar navbar-expand-lg bg-white py-3">
        <div class="container">
          ${brandHtml}
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mainNav">
            <div class="d-flex flex-wrap justify-content-center gap-2 mx-auto my-2 my-lg-0">
              ${links.map(l => `
                <a class="lf-nav-btn ${uiState.view === l.id || (l.id === 'found-list' && (uiState.view === 'found-detail' || uiState.view === 'claim-form')) ? 'active' : ''}" onclick="navigate('${l.id}')">${l.label}</a>
              `).join('')}
            </div>
            <div class="d-flex align-items-center gap-3">
              <span class="lf-role-pill">Mahasiswa</span>
              <span class="lf-avatar-circle" title="${escapeHtml(appState.currentUser.name)}"></span>
              <a class="text-dark text-decoration-none fw-bold small" style="cursor:pointer;" onclick="logout()">Keluar</a>
            </div>
          </div>
        </div>
      </nav>
    `;
    return;
  }

  // Satpam Navbar (Screens 13-17)
  const satpamLinks = [
    { id: 'satpam-verify', label: 'Verifikasi Laporan' },
    { id: 'satpam-claims', label: 'Kelola Klaim' },
    { id: 'satpam-history', label: 'Riwayat' }
  ];
  nav.innerHTML = `
    <nav class="navbar navbar-expand-lg bg-white py-3">
      <div class="container">
        ${brandHtml}
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <div class="d-flex flex-wrap justify-content-center gap-2 mx-auto my-2 my-lg-0">
            ${satpamLinks.map(l => `
              <a class="lf-nav-btn ${uiState.view === l.id || (l.id === 'satpam-history' && uiState.view === 'satpam-history-detail') ? 'active' : ''}" onclick="navigate('${l.id}')">${l.label}</a>
            `).join('')}
          </div>
          <div class="d-flex align-items-center gap-3">
            <span class="lf-role-pill">Satpam</span>
            <span class="lf-avatar-circle" title="${escapeHtml(appState.currentUser.name)}"></span>
            <a class="text-dark text-decoration-none fw-bold small" style="cursor:pointer;" onclick="logout()">Keluar</a>
          </div>
        </div>
      </div>
    </nav>
  `;
}

// ---------- Screen 00 · Landing Page ----------
function renderLanding() {
  const previewItems = appState.foundItems.slice(0, 4);
  return `
    <!-- Hero & Pencarian -->
    <section class="lf-hero-section">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-7">
            <span class="lf-eyebrow-pill mb-3">LOST &amp; FOUND FILKOM</span>
            <h1 class="lf-hero-heading mb-3">
              Barang hilang?<br />
              <span class="text-accent">Laporkan di Lost &amp; Found.</span>
            </h1>
            <p class="text-secondary mb-4" style="max-width: 520px; font-size: 1.02rem;">
              Laporkan kehilangan, cari barang temuan, dan ajukan klaim.<br />
              Satu tempat untuk membantu barang kembali ke pemiliknya.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <button class="btn lf-btn-blue px-4" onclick="navigate('report-lost')">Lapor Kehilangan</button>
              <button class="btn lf-btn-blue-outline px-4" onclick="navigate('report-found')">Lapor Temuan</button>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="lf-search-box">
              <h4 class="fw-bold mb-1">Cari barangmu</h4>
              <p class="text-secondary small mb-4">Cek barang yang sudah ditemukan di kampus.</p>
              <form id="landingSearchForm">
                <label for="landingSearchInput" class="form-label fw-semibold small mb-2">Nama barang atau lokasi</label>
                <input
                  type="text"
                  id="landingSearchInput"
                  class="form-control lf-input mb-3"
                  style="background:#f8fafc; border-color:#dce2e8;"
                  placeholder="Contoh: charger atau Ruang F4.2"
                />
                <button type="submit" class="btn lf-btn-blue w-100 py-2 mb-3">
                  Cari Barang Temuan &nbsp;&rarr;
                </button>
              </form>
              <p class="text-muted small mb-0">Lihat foto dan detail untuk mengenali barangmu.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Akses Laporan -->
    <section class="py-5 bg-white">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-6">
            <div class="lf-landing-role-card d-flex align-items-center justify-content-between" onclick="navigate('login-mahasiswa')">
              <div>
                <div class="text-uppercase small fw-semibold text-muted mb-1" style="font-size:0.72rem; letter-spacing:0.04em;">MASUK SEBAGAI</div>
                <h5 class="fw-bold mb-1">Mahasiswa</h5>
                <p class="text-secondary small mb-0">Lapor, cari barang, dan ajukan klaim</p>
              </div>
              <span class="fs-4" style="color: var(--lf-blue-text);">&rarr;</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="lf-landing-role-card d-flex align-items-center justify-content-between" onclick="navigate('login-satpam')">
              <div>
                <div class="text-uppercase small fw-semibold text-muted mb-1" style="font-size:0.72rem; letter-spacing:0.04em;">MASUK SEBAGAI</div>
                <h5 class="fw-bold mb-1">Satpam</h5>
                <p class="text-secondary small mb-0">Verifikasi laporan &amp; kelola klaim</p>
              </div>
              <span class="fs-4" style="color: var(--lf-blue-text);">&rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Barang Temuan -->
    <section class="pb-5 bg-white">
      <div class="container">
        <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <div class="text-uppercase fw-bold mb-1" style="color: var(--lf-blue-text); font-size:0.75rem; letter-spacing:0.04em;">BARANG TEMUAN</div>
            <h2 class="fw-bold mb-1">Mungkin salah satunya milikmu.</h2>
            <p class="text-secondary small mb-0">Cek foto dan detailnya untuk mengenali barangmu.</p>
          </div>
          <a class="fw-semibold text-decoration-none small" style="color: var(--lf-blue-text); cursor:pointer;" onclick="navigate('found-list')">
            Lihat semua barang &nbsp;&rarr;
          </a>
        </div>

        <div class="row g-4">
          ${previewItems.map(renderFoundCard).join('')}
        </div>
      </div>
    </section>

    <!-- Alur Klaim -->
    <section class="lf-steps-section">
      <div class="container">
        <div class="text-uppercase fw-bold mb-1" style="color: var(--lf-blue-text); font-size:0.75rem; letter-spacing:0.04em;">BARANGMU SUDAH DITEMUKAN?</div>
        <h2 class="fw-bold mb-5">Kembali ke tangan yang tepat.</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="lf-step-badge mb-3">01</div>
            <h5 class="fw-bold mb-2">Cari barang</h5>
            <p class="text-secondary small mb-0">Lihat foto, lokasi penemuan, dan detail barang untuk mengenali milikmu.</p>
          </div>
          <div class="col-md-4">
            <div class="lf-step-badge mb-3">02</div>
            <h5 class="fw-bold mb-2">Ajukan klaim</h5>
            <p class="text-secondary small mb-0">Jawab pertanyaan verifikasi untuk membuktikan kepemilikan barang.</p>
          </div>
          <div class="col-md-4">
            <div class="lf-step-badge mb-3">03</div>
            <h5 class="fw-bold mb-2">Ambil barang</h5>
            <p class="text-secondary small mb-0">Pantau status klaim. Setelah disetujui, lanjutkan serah terima dengan satpam.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFoundCard(item) {
  return `
    <div class="col-sm-6 col-lg-3">
      <div class="lf-found-card h-100 d-flex flex-column" onclick="navigate('found-detail', { foundId: '${item.id}' })">
        <div class="lf-found-card-img-wrap">
          <img src="${item.image}" alt="${escapeHtml(item.name)}" />
        </div>
        <div class="lf-found-card-body d-flex flex-column flex-grow-1">
          <div class="lf-found-card-title">${escapeHtml(item.name)}</div>
          <div class="lf-found-card-sub">${escapeHtml(item.location)} - ${escapeHtml(item.foundDateDisplay)}</div>
          <div class="mt-auto">
            <span class="lf-found-card-pill">${escapeHtml(item.reception)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---------- Screen 01 · Pilih Peran ----------
function renderChooseRole() {
  return `
    <div class="container">
      <div class="row justify-content-center align-items-center" style="min-height: 92vh;">
        <div class="col-md-8 col-lg-5" style="max-width: 560px;">
          <div class="mb-4">
            <div class="lf-brand fs-2 mb-2" onclick="navigate('landing')">
              <span>Lost &amp; Found</span>
              <span><span class="lf-brand-fil">FIL</span><span class="lf-brand-kom">KOM</span></span>
            </div>
            <p class="text-secondary mb-0">Pilih peran untuk masuk</p>
          </div>

          <div class="d-flex flex-column gap-3 mb-4">
            <div class="lf-role-select-card d-flex align-items-center gap-3" onclick="navigate('login-mahasiswa')">
              <div class="lf-role-select-icon"><i class="bi bi-person"></i></div>
              <div class="flex-grow-1">
                <h5 class="fw-bold mb-1">Mahasiswa</h5>
                <div class="small" style="opacity:0.95;">Lapor, cari barang, dan ajukan klaim</div>
              </div>
              <span class="fs-4 text-dark">&rarr;</span>
            </div>

            <div class="lf-role-select-card d-flex align-items-center gap-3" onclick="navigate('login-satpam')">
              <div class="lf-role-select-icon"><i class="bi bi-shield"></i></div>
              <div class="flex-grow-1">
                <h5 class="fw-bold mb-1">Satpam</h5>
                <div class="small" style="opacity:0.95;">Verifikasi laporan &amp; kelola klaim</div>
              </div>
              <span class="fs-4 text-dark">&rarr;</span>
            </div>
          </div>

          <p class="text-secondary small text-center mb-0">Setiap peran punya halaman login &amp; alur sendiri-sendiri</p>
        </div>
      </div>
    </div>
  `;
}

// ---------- Screen 02 · Login Mahasiswa ----------
function renderLoginMahasiswa() {
  return `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-5" style="max-width: 560px;">
          <div class="mb-3">
            <a class="lf-back-link d-block mb-3" onclick="navigate('choose-role')">&larr; Pilih peran lain</a>
            <span class="lf-role-pill">Mahasiswa</span>
          </div>

          <div class="lf-sky-panel p-4 p-md-5 mt-4">
            <h3 class="fw-bold text-white mb-4">Login Mahasiswa</h3>
            <form id="formLoginMahasiswa">
              <div class="mb-3">
                <div class="input-group">
                  <span class="input-group-text bg-white border-end-0" style="border-color:#9a9a9a; border-radius:8px 0 0 8px;">
                    <i class="bi bi-envelope text-secondary"></i>
                  </span>
                  <input type="text" id="mhsEmail" class="form-control lf-input border-start-0" style="border-radius:0 8px 8px 0;" placeholder="mahasiswa@gmail.com" value="mahasiswa@gmail.com" required />
                </div>
              </div>
              <div class="mb-4">
                <div class="input-group">
                  <span class="input-group-text bg-white border-end-0" style="border-color:#9a9a9a; border-radius:8px 0 0 8px;">
                    <i class="bi bi-lock text-secondary"></i>
                  </span>
                  <input type="password" id="mhsPass" class="form-control lf-input border-start-0" style="border-radius:0 8px 8px 0;" placeholder="••••••••" value="12345678" required />
                </div>
              </div>
              <button type="submit" class="btn lf-btn-blue w-100 py-2">Login</button>
            </form>

            <div class="d-flex align-items-center gap-3 my-4 text-white small">
              <hr class="flex-grow-1 border-white opacity-100" />
              <span class="fw-semibold">Atau</span>
              <hr class="flex-grow-1 border-white opacity-100" />
            </div>

            <button class="btn lf-btn-ub w-100 py-2" onclick="quickLoginMahasiswa()">
              Masuk dengan Akun UB
            </button>
          </div>

          <div class="text-center mt-4">
            <a class="text-dark small fw-medium" style="cursor:pointer;" onclick="navigate('login-satpam')">
              Login sebagai Satpam?
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---------- Screen 03 · Login Satpam ----------
function renderLoginSatpam() {
  return `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-5" style="max-width: 560px;">
          <div class="mb-3">
            <a class="lf-back-link d-block mb-3" onclick="navigate('choose-role')">&larr; Pilih peran lain</a>
            <span class="lf-role-pill">Satpam</span>
          </div>

          <div class="lf-sky-panel p-4 p-md-5 mt-4">
            <h3 class="fw-bold text-white mb-1">Login Satpam</h3>
            <p class="text-white small mb-4" style="opacity:0.95;">Gunakan akun petugas keamanan FILKOM</p>
            <form id="formLoginSatpam">
              <div class="mb-3">
                <label class="form-label text-white small fw-medium">ID Petugas</label>
                <div class="input-group">
                  <span class="input-group-text bg-white border-end-0" style="border-color:#9a9a9a; border-radius:8px 0 0 8px;">
                    <i class="bi bi-envelope text-secondary"></i>
                  </span>
                  <input type="text" id="satpamId" class="form-control lf-input border-start-0" style="border-radius:0 8px 8px 0;" placeholder="satpam@gmail.com" value="satpam@gmail.com" required />
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label text-white small fw-medium">Password</label>
                <div class="input-group">
                  <span class="input-group-text bg-white border-end-0" style="border-color:#9a9a9a; border-radius:8px 0 0 8px;">
                    <i class="bi bi-lock text-secondary"></i>
                  </span>
                  <input type="password" id="satpamPass" class="form-control lf-input border-start-0" style="border-radius:0 8px 8px 0;" placeholder="••••••••" value="12345678" required />
                </div>
              </div>
              <button type="submit" class="btn lf-btn-blue w-100 py-2">Masuk</button>
            </form>
          </div>

          <div class="text-center mt-4">
            <a class="text-dark small fw-medium" style="cursor:pointer;" onclick="navigate('login-mahasiswa')">
              Login sebagai Mahasiswa?
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---------- Screen 04 · Dashboard Mahasiswa (+ Screen 05 Modal) ----------
function renderDashboardMahasiswa() {
  const recentItems = appState.foundItems.slice(0, 6);
  return `
    <div class="container py-4">
      <h2 class="fw-bold mb-4">Dashboard</h2>

      <div class="d-flex flex-wrap gap-3 mb-4">
        <button class="btn lf-btn-white px-4" onclick="navigate('report-lost')">Lapor Kehilangan</button>
        <button class="btn lf-btn-white px-4" onclick="navigate('report-found')">Lapor Temuan</button>
        <button class="btn lf-btn-white px-4" onclick="navigate('found-list')">Cari Barang Temuan</button>
      </div>

      <div class="row g-4">
        <!-- Left: Barang Temuan Terbaru -->
        <div class="col-lg-7">
          <div class="lf-sky-panel p-4 h-100 d-flex flex-column">
            <h5 class="fw-bold text-white mb-4">Barang Temuan Terbaru</h5>
            <div class="d-flex flex-column gap-3 flex-grow-1">
              ${recentItems.map(item => `
                <div class="lf-dash-row d-flex align-items-center justify-content-between gap-3" onclick="navigate('found-detail', { foundId: '${item.id}' })">
                  <div class="d-flex align-items-center gap-3">
                    <div class="lf-thumb-box">
                      <img src="${item.image}" alt="${escapeHtml(item.name)}" />
                    </div>
                    <div>
                      <div class="fw-semibold small">${escapeHtml(item.name)}</div>
                      <div class="text-secondary" style="font-size:0.78rem;">${escapeHtml(item.location)} - ${escapeHtml(item.foundDateDisplay)}</div>
                    </div>
                  </div>
                  <span class="lf-pill lf-pill-white d-none d-sm-inline-flex">Resepsionis</span>
                </div>
              `).join('')}
            </div>
            <hr class="lf-sky-divider mt-4 mb-3" />
            <button class="btn lf-btn-blue w-100 py-2" onclick="navigate('found-list')">Lihat semua</button>
          </div>
        </div>

        <!-- Right: Notifikasi & Status Laporan Kehilangan Saya -->
        <div class="col-lg-5 d-flex flex-column gap-4">
          <!-- Notifikasi -->
          <div class="lf-sky-panel p-4">
            <h5 class="fw-bold text-white mb-3">Notifikasi</h5>
            ${appState.notifications.map((n, idx) => `
              <div class="py-2" style="cursor:pointer;" onclick="handleNotificationClick('${n.id}')">
                <div class="d-flex justify-content-between align-items-start gap-2 mb-1">
                  <div class="fw-semibold small text-white">${escapeHtml(n.title)}</div>
                  <span class="small text-white text-nowrap" style="opacity:0.9; font-size:0.78rem;">${escapeHtml(n.time)}</span>
                </div>
                <div class="small text-white" style="opacity:0.92;">${escapeHtml(n.subtitle)}</div>
              </div>
              ${idx < appState.notifications.length - 1 ? '<hr class="lf-sky-divider" />' : ''}
            `).join('')}
          </div>

          <!-- Status Laporan Kehilangan Saya -->
          <div class="lf-sky-panel p-4 flex-grow-1">
            <h5 class="fw-bold text-white mb-3">Status Laporan Kehilangan Saya</h5>
            ${appState.lostReports.map((rep, idx) => `
              <div class="d-flex align-items-center justify-content-between gap-2 py-2">
                <div>
                  <div class="fw-semibold small text-white">${escapeHtml(rep.itemName)}</div>
                  <div class="text-white" style="opacity:0.9; font-size:0.78rem;">${escapeHtml(rep.lostDate)}</div>
                </div>
                <div class="d-flex align-items-center gap-2">
                  ${getStatusPill(rep.status)}
                </div>
              </div>
              ${idx < appState.lostReports.length - 1 ? '<hr class="lf-sky-divider" />' : ''}
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---------- Screen 06 · Form Lapor Kehilangan ----------
function renderReportLost() {
  return `
    <div class="container py-4">
      <div class="mx-auto" style="max-width: 900px;">
        <h2 class="fw-bold mb-4">Form Lapor Kehilangan</h2>
        <div class="lf-sky-panel p-4 p-md-5">
          <form id="formReportLost">
            <div class="mb-3">
              <label class="form-label text-white small fw-medium">Nama Barang</label>
              <input type="text" id="lostName" class="form-control lf-input" placeholder="cth. Dompet kulit coklat" required />
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label text-white small fw-medium">Kategori</label>
                <select id="lostCategory" class="form-select lf-input" required>
                  <option value="">Pilih kategori</option>
                  <option value="Elektronik">Elektronik</option>
                  <option value="Aksesoris">Aksesoris</option>
                  <option value="Alat Minum">Alat Minum</option>
                  <option value="Alat Tulis">Alat Tulis</option>
                  <option value="Dokumen">Dokumen</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label text-white small fw-medium">Waktu Kehilangan</label>
                <input type="datetime-local" id="lostDateTime" class="form-control lf-input" required />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label text-white small fw-medium">Lokasi Terakhir Terlihat</label>
              <input type="text" id="lostLocation" class="form-control lf-input" placeholder="cth. Gedung A lantai 2" required />
            </div>

            <div class="mb-3">
              <label class="form-label text-white small fw-medium">Ciri-ciri Khusus</label>
              <textarea id="lostTrait" class="form-control lf-input" rows="4" placeholder="Jelaskan ciri khusus barang..." required></textarea>
            </div>

            <div class="mb-4">
              <label class="form-label text-white small fw-medium">Foto Pendukung (opsional)</label>
              <label class="lf-upload-box d-block" for="lostPhotoInput">
                <i class="bi bi-image fs-4 d-block mb-1"></i>
                <span class="small" id="lostPhotoLabel">Unggah foto (opsional)</span>
                <input type="file" id="lostPhotoInput" class="d-none" accept="image/*" />
              </label>
            </div>

            <div class="d-flex justify-content-end gap-3">
              <button type="button" class="btn lf-btn-white px-4" onclick="navigate('dashboard')">Batal</button>
              <button type="submit" class="btn lf-btn-blue px-4">Kirim Laporan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

// ---------- Screen 07 · Form Lapor Temuan ----------
function renderReportFound() {
  return `
    <div class="container py-4">
      <div class="mx-auto" style="max-width: 900px;">
        <h2 class="fw-bold mb-4">Form Lapor Temuan</h2>
        <div class="lf-sky-panel p-4 p-md-5">
          <form id="formReportFound">
            <div class="mb-3">
              <label class="form-label text-white small fw-medium">Foto Barang Temuan *</label>
              <label class="lf-upload-box d-block" for="foundPhotoInput">
                <i class="bi bi-image fs-4 d-block mb-1"></i>
                <span class="small" id="foundPhotoLabel">Unggah foto</span>
                <input type="file" id="foundPhotoInput" class="d-none" accept="image/*" />
                <img id="foundPhotoPreview" class="mt-3 rounded d-none" style="max-height:140px;" alt="Preview" />
              </label>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label text-white small fw-medium">Nama Barang *</label>
                <input type="text" id="foundName" class="form-control lf-input" placeholder="cth. Payung lipat hitam" required />
              </div>
              <div class="col-md-6">
                <label class="form-label text-white small fw-medium">Kategori *</label>
                <select id="foundCategory" class="form-select lf-input" required>
                  <option value="">Pilih kategori</option>
                  <option value="Elektronik">Elektronik</option>
                  <option value="Aksesoris">Aksesoris</option>
                  <option value="Alat Minum">Alat Minum</option>
                  <option value="Alat Tulis">Alat Tulis</option>
                  <option value="Dokumen">Dokumen</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label text-white small fw-medium">Deskripsi</label>
              <textarea id="foundDesc" class="form-control lf-input" rows="4" placeholder="Deskripsi singkat barang..." required></textarea>
            </div>

            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label text-white small fw-medium">Lokasi &amp; Waktu Penemuan *</label>
                <input type="text" id="foundLocationTime" class="form-control lf-input" placeholder="cth. Perpustakaan, 10/11 14:20" required />
              </div>
              <div class="col-md-6">
                <label class="form-label text-white small fw-medium">Tempat Barang Dititipkan *</label>
                <input type="text" id="foundReception" class="form-control lf-input" placeholder="cth. Resepsionis Gedung A" value="Resepsionis A" required />
              </div>
            </div>

            <div class="d-flex justify-content-end gap-3">
              <button type="button" class="btn lf-btn-white px-4" onclick="navigate('dashboard')">Batal</button>
              <button type="submit" class="btn lf-btn-blue px-4">Kirim Laporan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

// ---------- Screen 08 · Daftar Barang Temuan ----------
function renderFoundList() {
  const categories = ['Semua', ...new Set(appState.foundItems.map(i => i.category))];
  const locations = ['Semua', ...new Set(appState.foundItems.map(i => i.location))];

  const filtered = appState.foundItems.filter(item => {
    const kw = uiState.filters.keyword.trim().toLowerCase();
    const matchKw = !kw || item.name.toLowerCase().includes(kw) || item.location.toLowerCase().includes(kw) || item.description.toLowerCase().includes(kw);
    const matchCat = uiState.filters.category === 'Semua' || item.category === uiState.filters.category;
    const matchLoc = uiState.filters.location === 'Semua' || item.location === uiState.filters.location;
    const matchDate = !uiState.filters.date || item.foundDate === uiState.filters.date;
    return matchKw && matchCat && matchLoc && matchDate;
  });

  return `
    <div class="container py-4">
      <h2 class="fw-bold mb-4">Daftar Barang Temuan</h2>

      <!-- Sky-Blue Filter Bar -->
      <div class="lf-sky-panel p-4 mb-4">
        <form id="filterFoundForm" class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="form-label text-white small fw-medium">Kategori</label>
            <select id="filterCategory" class="form-select lf-input">
              ${categories.map(c => `<option value="${escapeHtml(c)}" ${uiState.filters.category === c ? 'selected' : ''}>${c === 'Semua' ? 'Semua kategori' : escapeHtml(c)}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label text-white small fw-medium">Lokasi</label>
            <select id="filterLocation" class="form-select lf-input">
              ${locations.map(l => `<option value="${escapeHtml(l)}" ${uiState.filters.location === l ? 'selected' : ''}>${l === 'Semua' ? 'Semua lokasi' : escapeHtml(l)}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label text-white small fw-medium">Tanggal</label>
            <input type="date" id="filterDate" class="form-control lf-input" value="${escapeHtml(uiState.filters.date)}" />
          </div>
          <div class="col-md-3 d-flex gap-2">
            <button type="submit" class="btn lf-btn-blue flex-grow-1">Terapkan Filter</button>
            <button type="button" class="btn lf-btn-white px-3" onclick="resetFilters()">Reset</button>
          </div>
        </form>
      </div>

      ${uiState.filters.keyword ? `
        <div class="mb-3 small text-secondary">
          Hasil pencarian untuk: <strong>"${escapeHtml(uiState.filters.keyword)}"</strong>
          <a class="ms-2 text-primary" style="cursor:pointer;" onclick="resetFilters()">Hapus pencarian</a>
        </div>
      ` : ''}

      <div class="row g-4">
        ${filtered.length === 0 ? `
          <div class="col-12 text-center py-5 text-secondary">
            Tidak ada barang temuan yang cocok dengan filter.
          </div>
        ` : filtered.map(renderFoundCard).join('')}
      </div>
    </div>
  `;
}

// ---------- Screen 09 · Detail Barang Temuan ----------
function renderFoundDetail() {
  const item = appState.foundItems.find(i => i.id === uiState.selectedFoundId) || appState.foundItems[0];
  if (!item) return '';

  return `
    <div class="container py-4">
      <a class="lf-back-link mb-4" onclick="navigate('found-list')">&larr; Kembali ke daftar barang</a>

      <div class="row g-4 mb-4">
        <div class="col-lg-5">
          <div class="lf-detail-photo-frame">
            <img src="${item.image}" alt="${escapeHtml(item.name)}" />
          </div>
        </div>
        <div class="col-lg-7">
          <div class="mb-3"><span class="lf-pill lf-pill-white">${escapeHtml(item.status)}</span></div>
          <h2 class="fw-bold mb-1">${escapeHtml(item.name)}</h2>
          <p class="text-secondary small mb-4">${escapeHtml(item.category)} &middot; ${escapeHtml(item.location)}</p>

          <div class="lf-sky-panel p-4 mb-4">
            <div class="d-flex justify-content-between gap-3 py-1 small">
              <span>Lokasi ditemukan</span>
              <span class="fw-medium text-end">${escapeHtml(item.location)}</span>
            </div>
            <hr class="lf-sky-divider" />
            <div class="d-flex justify-content-between gap-3 py-1 small">
              <span>Waktu ditemukan</span>
              <span class="fw-medium text-end">${escapeHtml(item.foundDateDisplay)}, ${escapeHtml(item.foundTime)}</span>
            </div>
            <hr class="lf-sky-divider" />
            <div class="d-flex justify-content-between gap-3 py-1 small">
              <span>Dititipkan di</span>
              <span class="fw-medium text-end">${escapeHtml(item.reception)}</span>
            </div>
            <hr class="lf-sky-divider" />
            <div class="d-flex justify-content-between gap-3 py-1 small">
              <span>Ciri khusus</span>
              <span class="text-end" style="opacity:0.95;">Disembunyikan - hanya pertanyaan verifikasi saat klaim</span>
            </div>
          </div>

          <button class="btn lf-btn-blue w-100 py-2" onclick="navigate('claim-form', { foundId: '${item.id}' })">
            Ajukan Klaim
          </button>
        </div>
      </div>

      <div class="lf-sky-panel p-4">
        <h5 class="fw-bold text-white mb-2">Deskripsi</h5>
        <p class="text-white small mb-0" style="opacity:0.95;">${escapeHtml(item.description)}</p>
      </div>
    </div>
  `;
}

// ---------- Screen 10 · Ajukan Klaim ----------
function renderClaimForm() {
  const item = appState.foundItems.find(i => i.id === uiState.selectedFoundId) || appState.foundItems[0];
  if (!item) return '';

  return `
    <div class="container py-4">
      <div class="mx-auto" style="max-width: 660px;">
        <h2 class="fw-bold mb-4">Ajukan Klaim</h2>

        <div class="lf-sky-panel p-3 mb-4 d-flex align-items-center gap-3">
          <div class="lf-thumb-sq">
            <img src="${item.image}" alt="${escapeHtml(item.name)}" />
          </div>
          <div>
            <div class="fw-bold text-white">${escapeHtml(item.name)}</div>
            <div class="small text-white" style="opacity:0.92;">${escapeHtml(item.location)} - ${escapeHtml(item.foundDateDisplay)}</div>
          </div>
        </div>

        <form id="formSubmitClaim" data-found-id="${item.id}">
          <h6 class="fw-bold mb-1">Pertanyaan Verifikasi</h6>
          <p class="text-secondary small mb-3">Jelaskan ciri khusus barang ini untuk membuktikan kepemilikan</p>
          <textarea
            id="claimAnswerInput"
            class="form-control lf-input mb-5"
            rows="5"
            placeholder="Tuliskan jawaban kamu di sini..."
            required
          ></textarea>

          <div class="d-flex justify-content-end gap-3">
            <button type="button" class="btn lf-btn-white px-4" onclick="navigate('found-detail', { foundId: '${item.id}' })">Batal</button>
            <button type="submit" class="btn lf-btn-blue px-4">Kirim Klaim</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// ---------- Screen 11 · Status Klaim Saya (+ Screen 12 Batal Modal) ----------
function renderMyClaims() {
  return `
    <div class="container py-4">
      <div class="mx-auto" style="max-width: 820px;">
        <h2 class="fw-bold mb-4">Status Klaim Saya</h2>

        <div class="d-flex flex-column gap-3">
          ${appState.claims.length === 0 ? `
            <div class="lf-sky-panel p-4 text-center">Belum ada pengajuan klaim.</div>
          ` : appState.claims.map(c => `
            <div class="lf-sky-panel p-3 p-md-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div class="d-flex align-items-center gap-3">
                <div class="lf-thumb-sq">
                  <img src="${c.itemImage}" alt="${escapeHtml(c.itemName)}" />
                </div>
                <div>
                  <div class="fw-bold text-white">${escapeHtml(c.itemName)}</div>
                  <div class="small text-white" style="opacity:0.92;">${escapeHtml(c.location)} - ${escapeHtml(c.claimDate)}</div>
                  ${c.rejectNote ? `<div class="small fw-semibold text-white mt-1">Alasan : ${escapeHtml(c.rejectNote)}</div>` : ''}
                </div>
              </div>
              <div class="d-flex align-items-center gap-2">
                ${c.status === 'Diajukan' ? `
                  <button class="btn lf-btn-white btn-sm px-3" onclick="openCancelModal('claim', '${c.id}')">Batalkan</button>
                ` : ''}
                ${getStatusPill(c.status)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ---------- Screen 13 · Verifikasi Laporan Temuan (+ Screen 14 Modal) ----------
function renderSatpamVerify() {
  const queue = appState.pendingFoundReports;
  if (!uiState.selectedPendingId || !queue.find(q => q.id === uiState.selectedPendingId)) {
    uiState.selectedPendingId = queue[0]?.id || null;
  }
  const selected = queue.find(q => q.id === uiState.selectedPendingId);

  return `
    <div class="container py-4">
      <h2 class="fw-bold mb-4">Verifikasi Laporan Temuan</h2>
      <div class="row g-4">
        <!-- Left: Menunggu Verifikasi -->
        <div class="col-lg-6">
          <div class="lf-sky-panel p-4 h-100">
            <h5 class="fw-bold text-white mb-4">Menunggu Verifikasi</h5>
            ${queue.length === 0 ? `
              <p class="text-white small">Semua laporan temuan sudah diverifikasi.</p>
            ` : `
              <div class="lf-satpam-grid-header small fw-semibold text-white mb-2">
                <div>Barang</div>
                <div>Pelapor</div>
                <div class="text-center">Status</div>
              </div>
              <div class="d-flex flex-column gap-3">
                ${queue.map(item => `
                  <div class="lf-satpam-row ${item.id === uiState.selectedPendingId ? 'active' : ''}" onclick="selectPendingReport('${item.id}')">
                    <div class="fw-semibold small">${escapeHtml(item.name)}</div>
                    <div style="font-size:0.78rem;">
                      <div>${escapeHtml(item.reporter)}</div>
                      <div class="text-secondary">${escapeHtml(item.reporterNim)}</div>
                    </div>
                    <div class="text-center">
                      <span class="lf-pill lf-pill-yellow">Menunggu Verifikasi</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- Right: Detail Laporan Temuan -->
        <div class="col-lg-6">
          <div class="lf-sky-panel p-4 h-100 d-flex flex-column">
            <h5 class="fw-bold text-white mb-4">Detail Laporan Temuan</h5>
            ${!selected ? `
              <p class="text-white small">Pilih laporan di sebelah kiri untuk melihat detail.</p>
            ` : `
              <div class="d-flex gap-3 mb-4">
                <div class="lf-thumb-sq-lg">
                  <img src="${selected.image}" alt="${escapeHtml(selected.name)}" />
                </div>
                <div>
                  <h5 class="fw-bold text-white mb-1">${escapeHtml(selected.name)}</h5>
                  <div class="small text-white">Deskripsi :</div>
                  <div class="small text-white" style="opacity:0.95;">${escapeHtml(selected.description)}</div>
                </div>
              </div>

              <div class="d-flex justify-content-between small py-1">
                <span>Lokasi ditemukan</span>
                <span class="fw-medium">${escapeHtml(selected.location)}</span>
              </div>
              <hr class="lf-sky-divider" />
              <div class="d-flex justify-content-between small py-1">
                <span>Dititipkan di</span>
                <span class="fw-medium">${escapeHtml(selected.reception)}</span>
              </div>
              <hr class="lf-sky-divider" />
              <div class="d-flex justify-content-between align-items-center small py-1 mb-4">
                <span>Barang fisik diterima?</span>
                <div class="form-check mb-0">
                  <input class="form-check-input" type="checkbox" id="chkPhysicalReceived" />
                  <label class="form-check-label text-white" for="chkPhysicalReceived">Ya, cocok dengan data</label>
                </div>
              </div>

              <div class="d-flex gap-3 mt-auto">
                <button class="btn lf-btn-coral px-4" onclick="openRejectFoundModal('${selected.id}')">Tolak</button>
                <button class="btn lf-btn-green flex-grow-1" onclick="verifyAndSaveFound('${selected.id}')">
                  Verifikasi &amp; Simpan ke Resepsionis
                </button>
              </div>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---------- Screen 15 · Kelola Klaim dan Serah Terima ----------
function renderSatpamClaims() {
  const submitted = appState.satpamClaims.filter(c => c.status === 'Diajukan');
  const approved = appState.satpamClaims.filter(c => c.status === 'Disetujui');
  const returned = appState.satpamClaims.filter(c => c.status === 'Dikembalikan');

  return `
    <div class="container py-4">
      <h2 class="fw-bold mb-4">Kelola Klaim &amp; Serah Terima Barang</h2>

      <!-- Section 1: Klaim Diajukan -->
      <div class="lf-sky-panel p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold text-white mb-0">Klaim Diajukan</h5>
          <span class="lf-pill lf-pill-white">Diajukan</span>
        </div>
        <hr class="lf-sky-divider" />
        ${submitted.length === 0 ? '<p class="text-white small mb-0">Tidak ada klaim yang perlu ditinjau.</p>' : submitted.map(c => `
          <div class="mb-3">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="lf-thumb-box"><img src="${c.itemImage}" alt="${escapeHtml(c.itemName)}" /></div>
              <div>
                <div class="fw-bold text-white small">${escapeHtml(c.itemName)}</div>
                <div class="text-white" style="opacity:0.9; font-size:0.8rem;">Pengklaim: ${escapeHtml(c.claimantName)} &middot; ${escapeHtml(c.claimDate)}</div>
              </div>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <div class="lf-white-box h-100">
                  <div class="small text-secondary mb-2">Ciri khusus tersimpan (dari laporan temuan)</div>
                  <div class="small fw-medium">${escapeHtml(c.secretTrait)}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="lf-white-box h-100">
                  <div class="small text-secondary mb-2">Jawaban verifikasi pengklaim</div>
                  <div class="small fw-medium">${escapeHtml(c.verificationAnswer)}</div>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-end gap-2">
              <button class="btn lf-btn-coral px-4" onclick="updateSatpamClaim('${c.id}', 'Ditolak')">Tolak Klaim</button>
              <button class="btn lf-btn-green px-4" onclick="updateSatpamClaim('${c.id}', 'Disetujui')">Setujui Klaim</button>
            </div>
          </div>
        `).join('<hr class="lf-sky-divider" />')}
      </div>

      <!-- Section 2: Klaim Disetujui -->
      <div class="lf-sky-panel p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold text-white mb-0">Klaim Disetujui</h5>
          <span class="lf-pill lf-pill-yellow">Disetujui</span>
        </div>
        <hr class="lf-sky-divider" />
        ${approved.length === 0 ? '<p class="text-white small mb-0">Tidak ada klaim siap diserahkan.</p>' : approved.map(c => `
          <div class="mb-2">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="lf-thumb-box"><img src="${c.itemImage}" alt="${escapeHtml(c.itemName)}" /></div>
              <div>
                <div class="fw-bold text-white small">${escapeHtml(c.itemName)}</div>
                <div class="text-white" style="opacity:0.9; font-size:0.8rem;">Pengklaim: ${escapeHtml(c.claimantName)} &middot; ${escapeHtml(c.claimDate)}</div>
              </div>
            </div>
            <div class="row g-3 align-items-center">
              <div class="col-md-7">
                <div class="lf-white-box py-2 small">
                  Mahasiswa sudah dinotifikasi untuk datang ke resepsionis
                </div>
              </div>
              <div class="col-md-5 text-md-end">
                <button class="btn lf-btn-blue w-100" onclick="completeSatpamHandover('${c.id}')">
                  Verifikasi Identitas &amp; Serahkan Barang
                </button>
              </div>
            </div>
          </div>
        `).join('<hr class="lf-sky-divider" />')}
      </div>

      <!-- Section 3: Klaim Dikembalikan -->
      <div class="lf-sky-panel-faded p-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold text-white mb-0">Klaim Dikembalikan</h5>
          <span class="lf-pill lf-pill-green-soft">Dikembalikan</span>
        </div>
        <hr class="lf-sky-divider" />
        ${returned.length === 0 ? '<p class="text-white small mb-0">Belum ada klaim selesai.</p>' : returned.map(c => `
          <div class="d-flex align-items-center gap-3 py-1">
            <div class="lf-thumb-box" style="opacity:0.8;"><img src="${c.itemImage}" alt="${escapeHtml(c.itemName)}" /></div>
            <div>
              <div class="fw-bold text-white small">${escapeHtml(c.itemName)}</div>
              <div class="text-white" style="opacity:0.9; font-size:0.8rem;">Pengklaim: ${escapeHtml(c.claimantName)} &middot; ${escapeHtml(c.claimDate)}</div>
            </div>
          </div>
        `).join('<hr class="lf-sky-divider" />')}
      </div>
    </div>
  `;
}

// ---------- Screen 16 · Riwayat Laporan & Penyerahan ----------
function renderSatpamHistory() {
  return `
    <div class="container py-4">
      <h2 class="fw-bold mb-4">Riwayat Laporan &amp; Penyerahan Barang</h2>

      <div class="lf-sky-panel p-4">
        <div class="table-responsive">
          <table class="lf-history-table">
            <thead>
              <tr>
                <th>Barang</th>
                <th>Pelapor / Pengklaim</th>
                <th>Petugas</th>
                <th>Status</th>
                <th class="text-end">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              ${appState.historyRecords.map(rec => `
                <tr onclick="navigate('satpam-history-detail', { historyId: '${rec.id}' })">
                  <td class="fw-semibold">${escapeHtml(rec.itemName)}</td>
                  <td>
                    <div class="fw-medium">${escapeHtml(rec.claimantShort || rec.claimant)}</div>
                    ${rec.claimantNim ? `<div style="opacity:0.9; font-size:0.8rem;">${escapeHtml(rec.claimantNim)}</div>` : ''}
                  </td>
                  <td>${escapeHtml(rec.officer)}</td>
                  <td>${getStatusPill(rec.status)}</td>
                  <td class="text-end text-nowrap">${escapeHtml(rec.date)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ---------- Screen 17 · Detail Riwayat Laporan & Penyerahan ----------
function renderSatpamHistoryDetail() {
  const rec = appState.historyRecords.find(r => r.id === uiState.selectedHistoryId) || appState.historyRecords[0];
  if (!rec) return '';

  return `
    <div class="container py-4">
      <a class="lf-back-link mb-2" onclick="navigate('satpam-history')">&larr; Kembali ke daftar riwayat</a>
      <h2 class="fw-bold mb-4">Detail Riwayat Laporan &amp; Penyerahan Barang</h2>

      <div class="row g-4">
        <!-- Left Card: Detail Laporan & Barang -->
        <div class="col-lg-6">
          <div class="lf-sky-panel p-4 h-100">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold text-white mb-0">Detail Laporan &amp; Barang</h5>
              ${getStatusPill(rec.status)}
            </div>

            <div class="d-flex gap-3 mb-4">
              <div class="lf-thumb-sq-lg">
                <img src="${rec.image}" alt="${escapeHtml(rec.itemName)}" />
              </div>
              <div>
                <h5 class="fw-bold text-white mb-1">${escapeHtml(rec.itemName)}</h5>
                <div class="small text-white mb-2" style="opacity:0.95;">Kategori: ${escapeHtml(rec.category)} &middot; ID Laporan: ${escapeHtml(rec.id)}</div>
                <div class="small text-white" style="opacity:0.95;">Deskripsi: ${escapeHtml(rec.description)}</div>
              </div>
            </div>

            <div class="d-flex justify-content-between gap-3 small py-1">
              <span>Pelapor Temuan</span>
              <span class="fw-semibold text-end">${escapeHtml(rec.reporter)}</span>
            </div>
            <hr class="lf-sky-divider" />
            <div class="d-flex justify-content-between gap-3 small py-1">
              <span>Lokasi &amp; Waktu Ditemukan</span>
              <span class="fw-semibold text-end">${escapeHtml(rec.locationTime)}</span>
            </div>
            <hr class="lf-sky-divider" />
            <div class="d-flex justify-content-between gap-3 small py-1">
              <span>Tempat Dititipkan</span>
              <span class="fw-semibold text-end">${escapeHtml(rec.reception)}</span>
            </div>
            <hr class="lf-sky-divider" />
            <div class="d-flex justify-content-between gap-3 small py-1">
              <span>Laporan Kehilangan Terkait</span>
              <span class="fw-semibold text-end">${escapeHtml(rec.relatedLostReport)}</span>
            </div>
            <hr class="lf-sky-divider" />
            <div class="d-flex justify-content-between gap-3 small py-1">
              <span>Ciri Khusus Tersimpan</span>
              <span class="fw-semibold text-end">${escapeHtml(rec.secretTrait)}</span>
            </div>
            <hr class="lf-sky-divider" />
            <div class="d-flex justify-content-between gap-3 small py-1">
              <span>Status Akhir Laporan</span>
              <span class="fw-semibold text-end">Selesai / ${escapeHtml(rec.status)} (${escapeHtml(rec.dateShort || rec.date)})</span>
            </div>
          </div>
        </div>

        <!-- Right Card: Detail Klaim & Riwayat Aktivitas -->
        <div class="col-lg-6">
          <div class="lf-sky-panel p-4 h-100">
            <h5 class="fw-bold text-white mb-4">Detail Klaim &amp; Riwayat Aktivitas</h5>

            <div class="d-flex justify-content-between gap-3 small py-1">
              <span>Pengklaim / Pemilik</span>
              <span class="fw-semibold text-end">${escapeHtml(rec.claimant)}</span>
            </div>
            <hr class="lf-sky-divider" />
            <div class="d-flex justify-content-between gap-3 small py-1">
              <span>Tanggal Pengajuan Klaim</span>
              <span class="fw-semibold text-end">${escapeHtml(rec.claimDate)}</span>
            </div>
            <hr class="lf-sky-divider" />
            <div class="d-flex justify-content-between gap-3 small py-1">
              <span>Jawaban Verifikasi</span>
              <span class="fw-semibold text-end">${escapeHtml(rec.verificationAnswer)}</span>
            </div>
            <hr class="lf-sky-divider" />
            <div class="d-flex justify-content-between gap-3 small py-1">
              <span>Petugas Verifikasi &amp; Serah Terima</span>
              <span class="fw-semibold text-end">${escapeHtml(rec.officerFull || rec.officer)}</span>
            </div>
            <hr class="lf-sky-divider" />
            <div class="d-flex justify-content-between gap-3 small py-1 mb-4">
              <span>Status Klaim</span>
              <span class="fw-semibold text-end">${escapeHtml(rec.claimStatusText)}</span>
            </div>

            <div class="fw-bold small text-white mb-2">Log Riwayat Aktivitas (RiwayatAktivitas)</div>
            <div class="lf-white-box">
              ${rec.logs.map((log, i) => `
                <div class="small ${i === rec.logs.length - 1 ? 'fw-bold text-dark' : 'text-dark'} ${i < rec.logs.length - 1 ? 'mb-2' : ''}">
                  ${escapeHtml(log)}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---------- Actions ----------
function quickLoginMahasiswa() {
  appState.currentUser = { role: 'mahasiswa', name: 'Reyhan Setya', id: '255150207111078' };
  saveState(appState);
  showToast('Berhasil masuk sebagai Mahasiswa!', 'success');
  navigate('dashboard');
}

function handleNotificationClick(notifId) {
  const notif = appState.notifications.find(n => n.id === notifId);
  if (!notif) return;
  notif.isRead = true;
  saveState(appState);

  const item = appState.foundItems.find(i => i.id === notif.foundItemId) || appState.foundItems[6];
  const body = document.getElementById('modalMatchDetailBody');
  body.innerHTML = `
    <h4 class="fw-bold text-dark mb-2">Barang Temuan Cocok dengan Laporanmu!</h4>
    <p class="text-secondary small mb-3">
      Sistem mencocokkan laporan kehilangan <strong>${escapeHtml(notif.matchTitle || 'Topi UB')}</strong> (11 Nov 2026) milikmu
      dengan barang temuan yang baru diverifikasi oleh Satpam:
    </p>
    <div class="lf-sky-panel p-3 d-flex align-items-center justify-content-between gap-3">
      <div class="d-flex align-items-center gap-3">
        <div class="lf-thumb-sq" style="width:76px;height:76px;">
          <span class="small text-secondary fw-semibold">Foto Topi</span>
        </div>
        <div>
          <div class="fw-bold text-white mb-1">${escapeHtml(notif.matchTitle || item.name)}</div>
          <div class="text-white" style="font-size:0.8rem; opacity:0.95;">Kategori: ${escapeHtml(notif.matchCategory || item.category)} &middot; Lokasi ditemukan: ${escapeHtml(notif.matchLocation || item.location)}</div>
          <div class="text-white" style="font-size:0.8rem; opacity:0.95;">Waktu ditemukan: ${escapeHtml(notif.matchTime || item.foundDateDisplay)}</div>
        </div>
      </div>
      <span class="lf-pill lf-pill-yellow align-self-start">${escapeHtml(notif.matchReception || item.reception)}</span>
    </div>
  `;

  document.getElementById('btnMatchGoToItem').onclick = () => {
    bootstrap.Modal.getInstance(document.getElementById('modalMatchDetail')).hide();
    navigate('found-detail', { foundId: item.id });
  };

  new bootstrap.Modal(document.getElementById('modalMatchDetail')).show();
  renderApp();
}

function openCancelModal(type, id) {
  uiState.cancelContext = { type, id };
  document.getElementById('modalCancelConfirmLabel').textContent =
    type === 'lost' ? 'Batalkan laporan kehilangan?' : 'Batalkan laporan kehilangan?';
  document.getElementById('modalCancelConfirmText').textContent =
    'Laporan akan ditutup dan tidak lagi dicocokkan dengan barang temuan.';
  new bootstrap.Modal(document.getElementById('modalCancelConfirm')).show();
}

document.getElementById('btnConfirmCancelAction').addEventListener('click', () => {
  if (!uiState.cancelContext) return;
  const { type, id } = uiState.cancelContext;
  if (type === 'claim') {
    appState.claims = appState.claims.filter(c => c.id !== id);
    showToast('Pengajuan berhasil dibatalkan.');
  } else if (type === 'lost') {
    appState.lostReports = appState.lostReports.filter(l => l.id !== id);
    showToast('Laporan kehilangan berhasil dibatalkan.');
  }
  saveState(appState);
  bootstrap.Modal.getInstance(document.getElementById('modalCancelConfirm')).hide();
  renderApp();
});

function selectPendingReport(id) {
  uiState.selectedPendingId = id;
  renderApp();
}

function verifyAndSaveFound(pendingId) {
  const chk = document.getElementById('chkPhysicalReceived');
  if (!chk || !chk.checked) {
    showToast('Centang "Ya, cocok dengan data" terlebih dahulu.', 'danger');
    return;
  }
  const idx = appState.pendingFoundReports.findIndex(p => p.id === pendingId);
  if (idx === -1) return;
  const item = appState.pendingFoundReports.splice(idx, 1)[0];

  appState.foundItems.unshift({
    id: 'FND-' + String(Date.now()).slice(-4),
    name: item.name,
    category: item.category,
    location: item.location,
    foundDate: new Date().toISOString().slice(0, 10),
    foundDateDisplay: formatTodayIndo(),
    foundTime: formatNowTime(),
    reception: item.reception,
    description: item.description,
    secretTrait: item.secretTrait,
    reporter: `${item.reporter} (${item.reporterNim})`,
    status: 'Disimpan di Resepsionis',
    image: item.image
  });

  saveState(appState);
  showToast(`"${item.name}" diverifikasi & disimpan di ${item.reception}.`, 'success');
  renderApp();
}

let rejectPendingTargetId = null;
function openRejectFoundModal(pendingId) {
  rejectPendingTargetId = pendingId;
  const input = document.getElementById('rejectReasonInput');
  input.value = '';
  input.classList.remove('is-invalid');
  new bootstrap.Modal(document.getElementById('modalRejectFound')).show();
}

document.getElementById('btnConfirmRejectFound').addEventListener('click', () => {
  const input = document.getElementById('rejectReasonInput');
  const reason = input.value.trim();
  if (!reason) {
    input.classList.add('is-invalid');
    return;
  }
  const idx = appState.pendingFoundReports.findIndex(p => p.id === rejectPendingTargetId);
  if (idx !== -1) {
    const item = appState.pendingFoundReports.splice(idx, 1)[0];
    appState.historyRecords.unshift({
      id: 'LAP-2026-' + String(Math.floor(100 + Math.random() * 900)),
      itemName: item.name,
      category: item.category,
      description: item.description,
      reporter: `${item.reporter} (${item.reporterNim})`,
      claimant: '-',
      claimantShort: item.reporter,
      claimantNim: item.reporterNim,
      officer: appState.currentUser.name,
      officerFull: `${appState.currentUser.name} (SATPAM-02)`,
      locationTime: `${item.location} · ${item.foundTime}`,
      reception: item.reception,
      relatedLostReport: '-',
      secretTrait: item.secretTrait,
      claimDate: '-',
      verificationAnswer: '-',
      claimStatusText: `Ditolak (${reason})`,
      status: 'Ditolak',
      date: formatTodayIndo(),
      dateShort: formatTodayIndo(),
      image: item.image,
      logs: [
        `${item.foundTime} · Pelaporan Barang Temuan oleh ${item.reporter}`,
        `${formatTodayIndo()}, ${formatNowTime()} · Laporan Ditolak oleh Satpam (${reason})`
      ]
    });
    saveState(appState);
    showToast(`Laporan "${item.name}" telah ditolak.`, 'danger');
  }
  bootstrap.Modal.getInstance(document.getElementById('modalRejectFound')).hide();
  renderApp();
});

function updateSatpamClaim(id, newStatus) {
  const c = appState.satpamClaims.find(x => x.id === id);
  if (!c) return;
  c.status = newStatus;
  saveState(appState);
  showToast(`Klaim "${c.itemName}" diubah menjadi ${newStatus}.`, newStatus === 'Disetujui' ? 'success' : 'danger');
  renderApp();
}

function completeSatpamHandover(id) {
  const c = appState.satpamClaims.find(x => x.id === id);
  if (!c) return;
  c.status = 'Dikembalikan';
  appState.historyRecords.unshift({
    id: 'LAP-2026-' + String(Math.floor(100 + Math.random() * 900)),
    itemName: c.itemName,
    category: 'Barang Temuan',
    description: `Serah terima ${c.itemName} di ${c.reception}.`,
    reporter: 'Pelapor FILKOM',
    claimant: c.claimantName,
    claimantShort: c.claimantName,
    claimantNim: '',
    officer: appState.currentUser.name,
    officerFull: `${appState.currentUser.name} (SATPAM-02)`,
    locationTime: `${c.reception} · ${c.claimDate}`,
    reception: c.reception,
    relatedLostReport: '-',
    secretTrait: c.secretTrait,
    claimDate: c.claimDate,
    verificationAnswer: `"${c.verificationAnswer}"`,
    claimStatusText: 'Disetujui & Barang Diserahkan',
    status: 'Dikembalikan',
    date: formatTodayIndo(),
    dateShort: formatTodayIndo(),
    image: c.itemImage,
    logs: [
      `${c.claimDate} · Pengajuan Klaim Barang oleh ${c.claimantName}`,
      `${formatTodayIndo()}, ${formatNowTime()} · Penyerahan Barang & Status Diubah ke 'Dikembalikan'`
    ]
  });
  saveState(appState);
  showToast(`"${c.itemName}" telah diserahkan & masuk ke Riwayat.`, 'success');
  renderApp();
}

function resetFilters() {
  uiState.filters = { keyword: '', category: 'Semua', location: 'Semua', date: '' };
  renderApp();
}

// ---------- Bind Events ----------
function bindViewEvents() {
  const landingSearch = document.getElementById('landingSearchForm');
  if (landingSearch) {
    landingSearch.addEventListener('submit', e => {
      e.preventDefault();
      const kw = document.getElementById('landingSearchInput').value;
      navigate('found-list', { keyword: kw });
    });
  }

  const formLoginMhs = document.getElementById('formLoginMahasiswa');
  if (formLoginMhs) {
    formLoginMhs.addEventListener('submit', e => {
      e.preventDefault();
      appState.currentUser = { role: 'mahasiswa', name: 'Reyhan Setya', id: '255150207111078' };
      saveState(appState);
      showToast('Berhasil masuk sebagai Mahasiswa!', 'success');
      navigate('dashboard');
    });
  }

  const formLoginSatpam = document.getElementById('formLoginSatpam');
  if (formLoginSatpam) {
    formLoginSatpam.addEventListener('submit', e => {
      e.preventDefault();
      appState.currentUser = { role: 'satpam', name: 'Ariq Dwi Anugrah', id: 'SATPAM-02' };
      saveState(appState);
      showToast('Berhasil masuk sebagai Satpam!', 'success');
      navigate('satpam-verify');
    });
  }

  const formLost = document.getElementById('formReportLost');
  if (formLost) {
    document.getElementById('lostPhotoInput')?.addEventListener('change', e => {
      const f = e.target.files[0];
      if (f) document.getElementById('lostPhotoLabel').textContent = `File dipilih: ${f.name}`;
    });
    formLost.addEventListener('submit', e => {
      e.preventDefault();
      appState.lostReports.unshift({
        id: 'LAP-2026-' + String(Date.now()).slice(-3),
        itemName: document.getElementById('lostName').value.trim(),
        category: document.getElementById('lostCategory').value,
        lostDate: formatTodayIndo(),
        location: document.getElementById('lostLocation').value.trim(),
        secretTrait: document.getElementById('lostTrait').value.trim(),
        status: 'Dicari'
      });
      saveState(appState);
      showToast('Laporan kehilangan berhasil dikirim!', 'success');
      navigate('dashboard');
    });
  }

  const formFound = document.getElementById('formReportFound');
  if (formFound) {
    let uploadedDataUrl = null;
    document.getElementById('foundPhotoInput')?.addEventListener('change', e => {
      const f = e.target.files[0];
      if (!f) return;
      document.getElementById('foundPhotoLabel').textContent = `File dipilih: ${f.name}`;
      const reader = new FileReader();
      reader.onload = ev => {
        uploadedDataUrl = ev.target.result;
        const prev = document.getElementById('foundPhotoPreview');
        prev.src = uploadedDataUrl;
        prev.classList.remove('d-none');
      };
      reader.readAsDataURL(f);
    });

    formFound.addEventListener('submit', e => {
      e.preventDefault();
      appState.pendingFoundReports.unshift({
        id: 'PND-' + String(Date.now()).slice(-4),
        name: document.getElementById('foundName').value.trim(),
        category: document.getElementById('foundCategory').value,
        reporter: appState.currentUser.name,
        reporterNim: appState.currentUser.id,
        location: document.getElementById('foundLocationTime').value.trim(),
        foundTime: `${formatTodayIndo()}, ${formatNowTime()}`,
        reception: document.getElementById('foundReception').value.trim(),
        description: document.getElementById('foundDesc').value.trim(),
        secretTrait: document.getElementById('foundDesc').value.trim(),
        status: 'Menunggu Verifikasi',
        image: uploadedDataUrl || 'assets/botol-minum.png'
      });
      saveState(appState);
      showToast('Laporan temuan berhasil dikirim! Menunggu verifikasi Satpam.', 'success');
      navigate('dashboard');
    });
  }

  const filterForm = document.getElementById('filterFoundForm');
  if (filterForm) {
    filterForm.addEventListener('submit', e => {
      e.preventDefault();
      uiState.filters.category = document.getElementById('filterCategory').value;
      uiState.filters.location = document.getElementById('filterLocation').value;
      uiState.filters.date = document.getElementById('filterDate').value;
      renderApp();
    });
  }

  const claimForm = document.getElementById('formSubmitClaim');
  if (claimForm) {
    claimForm.addEventListener('submit', e => {
      e.preventDefault();
      const foundId = claimForm.getAttribute('data-found-id');
      const item = appState.foundItems.find(i => i.id === foundId);
      const answer = document.getElementById('claimAnswerInput').value.trim();
      if (!item || !answer) return;

      appState.claims.unshift({
        id: 'CLM-' + String(Date.now()).slice(-4),
        foundItemId: item.id,
        itemName: item.name,
        itemImage: item.image,
        location: item.location,
        reception: item.reception,
        claimantName: appState.currentUser.name,
        claimantNim: appState.currentUser.id,
        claimDate: formatTodayIndo(),
        secretTrait: item.secretTrait,
        verificationAnswer: answer,
        status: 'Diajukan'
      });
      appState.satpamClaims.unshift({
        id: 'SCLM-' + String(Date.now()).slice(-4),
        itemName: item.name,
        itemImage: item.image,
        claimantName: appState.currentUser.name,
        claimDate: formatTodayIndo(),
        reception: item.reception,
        secretTrait: item.secretTrait,
        verificationAnswer: answer,
        status: 'Diajukan'
      });
      saveState(appState);
      showToast('Klaim berhasil dikirim!', 'success');
      navigate('my-claims');
    });
  }
}

// ---------- Main Render ----------
function renderApp() {
  renderNavbar();
  const main = document.getElementById('app-main');

  const views = {
    'landing': renderLanding,
    'choose-role': renderChooseRole,
    'login-mahasiswa': renderLoginMahasiswa,
    'login-satpam': renderLoginSatpam,
    'dashboard': renderDashboardMahasiswa,
    'report-lost': renderReportLost,
    'report-found': renderReportFound,
    'found-list': renderFoundList,
    'found-detail': renderFoundDetail,
    'claim-form': renderClaimForm,
    'my-claims': renderMyClaims,
    'satpam-verify': renderSatpamVerify,
    'satpam-claims': renderSatpamClaims,
    'satpam-history': renderSatpamHistory,
    'satpam-history-detail': renderSatpamHistoryDetail
  };

  main.innerHTML = (views[uiState.view] || renderLanding)();
  bindViewEvents();
}

window.resetDemo = function () {
  appState = resetDemoState();
  showToast('Data demo dikembalikan ke kondisi awal.');
  navigate('landing');
};

document.addEventListener('DOMContentLoaded', renderApp);
