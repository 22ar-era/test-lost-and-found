/* =========================================================
   Lost & Found FILKOM — Data Store matching Figma High-Fi
   ========================================================= */

const STORAGE_KEY = 'lf_filkom_state_v3';

const DEFAULT_STATE = {
  currentUser: null, // { role: 'mahasiswa' | 'satpam', name, id }

  foundItems: [
    {
      id: 'FND-001',
      name: 'Botol Minum',
      category: 'Alat Minum',
      location: 'Ruang F4.2',
      foundDate: '2026-12-01',
      foundDateDisplay: '1 Desember 2026',
      foundTime: '10:30',
      reception: 'Resepsionis A',
      description: 'Botol minum aluminium warna silver dengan tutup hitam ditemukan di meja Ruang F4.2.',
      secretTrait: 'Ada goresan halus di bagian bawah botol.',
      reporter: 'Dina Kartika (245150200111012)',
      status: 'Disimpan di Resepsionis',
      image: 'assets/botol-minum.png'
    },
    {
      id: 'FND-002',
      name: 'Charger HP',
      category: 'Elektronik',
      location: 'Ruang F4.2',
      foundDate: '2026-11-15',
      foundDateDisplay: '15 November 2026',
      foundTime: '13:15',
      reception: 'Resepsionis B',
      description: 'Adaptor fast charging 33W warna putih ditemukan di dekat stopkontak Ruang F4.2.',
      secretTrait: 'Adaptor 33W putih, ada stiker inisial RS.',
      reporter: 'Rayhan Wicaksono (265455672234111)',
      status: 'Disimpan di Resepsionis',
      image: 'assets/charger-hp.png'
    },
    {
      id: 'FND-003',
      name: 'Payung',
      category: 'Aksesoris',
      location: 'Ruang F3.8',
      foundDate: '2026-11-30',
      foundDateDisplay: '30 November 2026',
      foundTime: '15:40',
      reception: 'Resepsionis A',
      description: 'Payung lipat warna biru navy beserta sarungnya ditemukan tertinggal di Ruang F3.8.',
      secretTrait: 'Ada inisial di sarungnya.',
      reporter: 'Tiara Andini (245340005632112)',
      status: 'Disimpan di Resepsionis',
      image: 'assets/payung.png'
    },
    {
      id: 'FND-004',
      name: 'Laptop',
      category: 'Elektronik',
      location: 'Ruang F11.2',
      foundDate: '2026-11-12',
      foundDateDisplay: '12 November 2026',
      foundTime: '14:10',
      reception: 'Resepsionis A',
      description: 'Laptop warna hitam ditemukan tertinggal di meja kuliah Ruang F11.2.',
      secretTrait: 'Ada stiker kecil di sudut bawah keyboard.',
      reporter: 'Bimo Candika (245245556799001)',
      status: 'Disimpan di Resepsionis',
      image: 'assets/laptop.png'
    },
    {
      id: 'FND-005',
      name: 'Kotak Pensil',
      category: 'Alat Tulis',
      location: 'Ruang F1.2',
      foundDate: '2026-11-11',
      foundDateDisplay: '11 November 2026',
      foundTime: '11:20',
      reception: 'Resepsionis B',
      description: 'Kotak pensil kain warna hitam dengan resleting ditemukan di Ruang F1.2.',
      secretTrait: 'Berisi pulpen biru, tipe-x, dan penggaris besi.',
      reporter: 'Niana Guereo (235577145300018)',
      status: 'Disimpan di Resepsionis',
      image: 'assets/kotak-pensil.png'
    },
    {
      id: 'FND-006',
      name: 'HP Samsung Fold 8',
      category: 'Elektronik',
      location: 'Lab G1.2',
      foundDate: '2026-11-10',
      foundDateDisplay: '10 November 2026',
      foundTime: '16:00',
      reception: 'Resepsionis A',
      description: 'Smartphone lipat warna ungu muda tertinggal di meja praktikum Lab G1.2.',
      secretTrait: 'Wallpaper lockscreen bertema abstrak ungu.',
      reporter: 'Rayhan Wicaksono (265455672234111)',
      status: 'Disimpan di Resepsionis',
      image: 'assets/hp-samsung.png'
    },
    {
      id: 'FND-007',
      name: 'Helm',
      category: 'Aksesoris',
      location: 'Junction',
      foundDate: '2026-11-23',
      foundDateDisplay: '23 November 2026',
      foundTime: '14:20',
      reception: 'Resepsionis B',
      description: 'Helm merk KYT warna hitam ditemukan di Junction pada saat jam 17.30',
      secretTrait: 'Visor bening, ada stiker kecil di bagian belakang helm.',
      reporter: 'David Wijaya (255773822901112)',
      status: 'Disimpan di Resepsionis',
      image: 'assets/helm.png'
    },
    {
      id: 'FND-008',
      name: 'Kunci Motor',
      category: 'Lainnya',
      location: 'Ruang F2.4',
      foundDate: '2026-11-12',
      foundDateDisplay: '12 November 2026',
      foundTime: '09:45',
      reception: 'Resepsionis A',
      description: 'Kunci motor Honda warna hitam ditemukan di sekitar Ruang F2.4.',
      secretTrait: 'Ada goresan kecil pada kepala kunci Honda.',
      reporter: 'Raka A (255150207111076)',
      status: 'Disimpan di Resepsionis',
      image: 'assets/kunci-motor.png'
    }
  ],

  lostReports: [
    {
      id: 'LAP-2026-011',
      itemName: 'Charger hitam Xiaomi',
      category: 'Elektronik',
      lostDate: '10 November 2026',
      location: 'Gedung A Lt. 2',
      secretTrait: 'Charger 33W hitam dengan kabel agak kusam.',
      status: 'Dicari'
    },
    {
      id: 'LAP-2026-015',
      itemName: 'Payung merah',
      category: 'Aksesoris',
      lostDate: '13 November 2026',
      location: 'Gedung F Lt. 1',
      secretTrait: 'Payung lipat warna merah polos.',
      status: 'Dicari'
    },
    {
      id: 'LAP-2026-016',
      itemName: 'Tumbler abu-abu',
      category: 'Alat Minum',
      lostDate: '2 November 2026',
      location: 'Ruang F4.2',
      secretTrait: 'Tumbler abu-abu metalik tutup hitam.',
      status: 'Ada Kecocokan',
      matchedFoundId: 'FND-001'
    },
    {
      id: 'LAP-2026-012',
      itemName: 'Topi UB',
      category: 'Aksesoris',
      lostDate: '11 November 2026',
      location: 'Gedung F Lt. 2',
      secretTrait: 'Topi navy logo UB dengan inisial RS di bagian dalam.',
      status: 'Ada Kecocokan',
      matchedFoundId: 'FND-007'
    }
  ],

  notifications: [
    {
      id: 'NOTIF-01',
      type: 'match',
      title: "Barang temuan 'Topi UB' cocok dengan laporanmu!",
      subtitle: 'Klik untuk melihat detail barang dan mengajukan klaim.',
      time: '17:56',
      isRead: false,
      lostReportId: 'LAP-2026-012',
      foundItemId: 'FND-007',
      matchTitle: 'Topi UB',
      matchCategory: 'Aksesoris',
      matchLocation: 'Gedung F Lt. 2',
      matchTime: '12 November 2026, 10:15 WIB',
      matchReception: 'Resepsionis A'
    },
    {
      id: 'NOTIF-02',
      type: 'info',
      title: 'Ada 2 barang temuan baru',
      subtitle: 'Cek foto dan detailnya untuk melihat apakah salah satunya milikmu.',
      time: '10:25',
      isRead: true
    },
    {
      id: 'NOTIF-03',
      type: 'info',
      title: 'Ada 2 barang temuan baru',
      subtitle: 'Cek foto dan detailnya untuk melihat apakah salah satunya milikmu.',
      time: 'Yesterday 15:20',
      isRead: true
    }
  ],

  claims: [
    {
      id: 'CLM-001',
      foundItemId: 'FND-007',
      itemName: 'Helm',
      itemImage: 'assets/helm.png',
      location: 'Junction',
      reception: 'Resepsionis B',
      claimantName: 'Reyhan Setya',
      claimantNim: '255150207111078',
      claimDate: '23 November 2026',
      secretTrait: 'Helm KYT hitam dengan stiker kecil di bagian belakang.',
      verificationAnswer: 'Helm KYT hitam dof, visor bening, ada stiker kecil di belakang.',
      status: 'Diajukan'
    },
    {
      id: 'CLM-002',
      foundItemId: 'FND-002',
      itemName: 'Charger putih Samsung',
      itemImage: 'assets/charger-hp.png',
      location: 'Gedung F2.4',
      reception: 'Resepsionis B',
      claimantName: 'Reyhan Setya',
      claimantNim: '255150207111078',
      claimDate: '10 November 2026',
      secretTrait: 'Adaptor 33W putih, ada stiker inisial RS.',
      verificationAnswer: 'Charger putih Samsung 33W dengan stiker inisial RS.',
      status: 'Disetujui'
    },
    {
      id: 'CLM-003',
      foundItemId: 'FND-003',
      itemName: 'Payung hitam',
      itemImage: 'assets/payung.png',
      location: 'Gedung F4.2',
      reception: 'Resepsionis A',
      claimantName: 'Reyhan Setya',
      claimantNim: '255150207111078',
      claimDate: '20 November 2026',
      secretTrait: 'Ada inisial di sarungnya.',
      verificationAnswer: 'Payung warna hitam polos tanpa sarung.',
      status: 'Ditolak',
      rejectNote: 'Jawaban verifikasi tidak sesuai dengan ciri barang'
    }
  ],

  // Satpam Kelola Klaim items matching screen 15
  satpamClaims: [
    {
      id: 'SCLM-001',
      itemName: 'Payung',
      itemImage: 'assets/payung.png',
      claimantName: 'Anisa N.',
      claimDate: '14 Nov 2026',
      reception: 'Resepsionis A',
      secretTrait: 'Ada inisial di sarungnya.',
      verificationAnswer: 'Payung ini punya sarung hitam bertuliskan inisial saya, "AN", di bagian dalam.',
      status: 'Diajukan'
    },
    {
      id: 'SCLM-002',
      itemName: 'Botol Minum',
      itemImage: 'assets/botol-minum.png',
      claimantName: 'Dewi L.',
      claimDate: '15 Nov 2026',
      reception: 'Resepsionis A',
      secretTrait: 'Botol silver tutup hitam.',
      verificationAnswer: 'Botol aluminium silver tutup hitam ada goresan halus.',
      status: 'Disetujui'
    },
    {
      id: 'SCLM-003',
      itemName: 'Botol Minum',
      itemImage: 'assets/botol-minum.png',
      claimantName: 'Raka A.',
      claimDate: '09 Nov 2026',
      reception: 'Resepsionis A',
      secretTrait: 'Botol silver polos.',
      verificationAnswer: 'Botol silver polos 600ml.',
      status: 'Dikembalikan'
    }
  ],

  pendingFoundReports: [
    {
      id: 'PND-001',
      name: 'Helm',
      category: 'Aksesoris',
      reporter: 'David Wijaya',
      reporterNim: '255773822901112',
      location: 'Junction',
      foundTime: '23 Nov 2026, 17:30',
      reception: 'Resepsionis A',
      description: 'Merk KYT warna hitam ditemukan di Junction pada saat jam 17.30',
      secretTrait: 'Helm KYT hitam dof visor bening.',
      status: 'Menunggu Verifikasi',
      image: 'assets/helm.png'
    },
    {
      id: 'PND-002',
      name: 'Payung',
      category: 'Aksesoris',
      reporter: 'Tiara Andini',
      reporterNim: '245340005632112',
      location: 'Ruang F3.8',
      foundTime: '30 Nov 2026, 15:40',
      reception: 'Resepsionis A',
      description: 'Payung lipat warna biru tua tertinggal di dekat pintu kelas F3.8.',
      secretTrait: 'Ada inisial di sarungnya.',
      status: 'Menunggu Verifikasi',
      image: 'assets/payung.png'
    },
    {
      id: 'PND-003',
      name: 'Boneka beruang kecil',
      category: 'Lainnya',
      reporter: 'Niana Guereo',
      reporterNim: '235577145300018',
      location: 'Gazebo FILKOM',
      foundTime: '20 Nov 2026, 12:15',
      reception: 'Resepsionis B',
      description: 'Gantungan boneka beruang kecil warna coklat ditemukan di bangku Gazebo.',
      secretTrait: 'Ada pita merah di leher boneka.',
      status: 'Menunggu Verifikasi',
      image: 'assets/kotak-pensil.png'
    },
    {
      id: 'PND-004',
      name: 'Topi UB',
      category: 'Aksesoris',
      reporter: 'Bimo Candika',
      reporterNim: '245245556799001',
      location: 'Gedung F Lt. 2',
      foundTime: '12 Nov 2026, 10:15',
      reception: 'Resepsionis A',
      description: 'Topi warna navy berlogo UB ditemukan di koridor Gedung F lantai 2.',
      secretTrait: 'Ada tulisan inisial RS di bagian dalam topi.',
      status: 'Menunggu Verifikasi',
      image: 'assets/botol-minum.png'
    },
    {
      id: 'PND-005',
      name: 'Charger hitam Samsung',
      category: 'Elektronik',
      reporter: 'Rayhan Wicaksono',
      reporterNim: '265455672234111',
      location: 'Ruang F4.2',
      foundTime: '14 Nov 2026, 13:15',
      reception: 'Resepsionis B',
      description: 'Adaptor fast charging Samsung ditemukan di dekat stopkontak Ruang F4.2.',
      secretTrait: 'Adaptor 33W, ada stiker inisial RS.',
      status: 'Menunggu Verifikasi',
      image: 'assets/charger-hp.png'
    }
  ],

  historyRecords: [
    {
      id: 'LAP-2026-014',
      itemName: 'Charger HP Samsung',
      category: 'Elektronik',
      description: 'Adaptor fast charging 33W warna putih ditemukan di dekat stopkontak Ruang F4.2.',
      reporter: 'Rayhan Wicaksono (265455672234111)',
      claimant: 'Reyhan Setya (255150207111078)',
      claimantShort: 'Reyhan Setya',
      claimantNim: '255150207111078',
      officer: 'Ariq Dwi Anugrah',
      officerFull: 'Ariq Dwi Anugrah (SATPAM-02)',
      locationTime: 'Ruang F4.2 · 14 Nov 2026, 13:15 WIB',
      reception: 'Resepsionis B',
      relatedLostReport: 'LAP-2026-011 (Reyhan Setya)',
      secretTrait: 'Adaptor 33W putih, ada stiker inisial RS',
      claimDate: '15 November 2026, 09:30 WIB',
      verificationAnswer: '"Charger putih 33W ada stiker inisial RS"',
      claimStatusText: 'Disetujui & Barang Diserahkan',
      status: 'Dikembalikan',
      date: '15 November 2026',
      dateShort: '15 Nov 2026',
      image: 'assets/charger-hp.png',
      logs: [
        '14 Nov 2026, 13:15 · Pelaporan Barang Temuan oleh Rayhan Wicaksono',
        '14 Nov 2026, 14:00 · Verifikasi Laporan Temuan oleh Satpam (Ariq Dwi A.)',
        '14 Nov 2026, 14:01 · Pencocokan Otomatis & Notifikasi ke Pemilik Laporan',
        '15 Nov 2026, 09:30 · Pengajuan Klaim Barang oleh Reyhan Setya',
        "15 Nov 2026, 11:20 · Penyerahan Barang & Status Diubah ke 'Dikembalikan'"
      ]
    },
    {
      id: 'LAP-2026-013',
      itemName: 'Topi UB',
      category: 'Aksesoris',
      description: 'Topi Universitas Brawijaya ditemukan di koridor Gedung F lantai 2.',
      reporter: 'Bimo Candika (245245556799001)',
      claimant: 'Tobias Setya (255150200111054)',
      claimantShort: 'Tobias Setya',
      claimantNim: '255150200111054',
      officer: 'Ariq Dwi Anugrah',
      officerFull: 'Ariq Dwi Anugrah (SATPAM-02)',
      locationTime: 'Gedung F Lt. 2 · 14 Nov 2026, 10:15 WIB',
      reception: 'Resepsionis A',
      relatedLostReport: 'LAP-2026-012 (Tobias Setya)',
      secretTrait: 'Ada bordir kecil di bagian dalam topi',
      claimDate: '15 November 2026, 08:40 WIB',
      verificationAnswer: '"Topi UB biru tua ada bordir kecil di bagian dalam"',
      claimStatusText: 'Disetujui & Barang Diserahkan',
      status: 'Dikembalikan',
      date: '15 November 2026',
      dateShort: '15 Nov 2026',
      image: 'assets/helm.png',
      logs: [
        '14 Nov 2026, 10:15 · Pelaporan Barang Temuan oleh Bimo Candika',
        '14 Nov 2026, 11:00 · Verifikasi Laporan Temuan oleh Satpam (Ariq Dwi A.)',
        '15 Nov 2026, 08:40 · Pengajuan Klaim Barang oleh Tobias Setya',
        "15 Nov 2026, 10:05 · Penyerahan Barang & Status Diubah ke 'Dikembalikan'"
      ]
    },
    {
      id: 'LAP-2026-012',
      itemName: 'Payung hitam',
      category: 'Aksesoris',
      description: 'Payung lipat hitam ditemukan di Ruang F4.2.',
      reporter: 'Tiara Andini (245340005632112)',
      claimant: 'Fakhriii (255150207111043)',
      claimantShort: 'Fakhriii',
      claimantNim: '255150207111043',
      officer: 'Ariq Dwi Anugrah',
      officerFull: 'Ariq Dwi Anugrah (SATPAM-02)',
      locationTime: 'Ruang F4.2 · 09 Nov 2026, 15:00 WIB',
      reception: 'Resepsionis A',
      relatedLostReport: '-',
      secretTrait: 'Ada inisial di sarungnya',
      claimDate: '10 November 2026, 11:20 WIB',
      verificationAnswer: '"Payung polos tanpa sarung"',
      claimStatusText: 'Ditolak (Ciri tidak sesuai)',
      status: 'Ditolak',
      date: '10 November 2026',
      dateShort: '10 Nov 2026',
      image: 'assets/payung.png',
      logs: [
        '09 Nov 2026, 15:00 · Pelaporan Barang Temuan oleh Tiara Andini',
        '10 Nov 2026, 11:20 · Pengajuan Klaim Barang oleh Fakhriii',
        "10 Nov 2026, 13:10 · Klaim Ditolak oleh Satpam (Jawaban verifikasi tidak sesuai)"
      ]
    },
    {
      id: 'LAP-2026-011',
      itemName: 'Botol Minum',
      category: 'Alat Minum',
      description: 'Botol minum aluminium silver ditemukan di Ruang F4.2.',
      reporter: 'Dina Kartika (245150200111012)',
      claimant: 'Raka A (255150207111076)',
      claimantShort: 'Raka A',
      claimantNim: '255150207111076',
      officer: 'Ariq Dwi Anugrah',
      officerFull: 'Ariq Dwi Anugrah (SATPAM-02)',
      locationTime: 'Ruang F4.2 · 08 Nov 2026, 14:10 WIB',
      reception: 'Resepsionis A',
      relatedLostReport: '-',
      secretTrait: 'Botol silver tutup hitam',
      claimDate: '09 November 2026, 09:00 WIB',
      verificationAnswer: '"Botol aluminium silver tutup hitam"',
      claimStatusText: 'Disetujui & Barang Diserahkan',
      status: 'Dikembalikan',
      date: '9 November 2026',
      dateShort: '9 Nov 2026',
      image: 'assets/botol-minum.png',
      logs: [
        '08 Nov 2026, 14:10 · Pelaporan Barang Temuan oleh Dina Kartika',
        '09 Nov 2026, 09:00 · Pengajuan Klaim Barang oleh Raka A',
        "09 Nov 2026, 10:15 · Penyerahan Barang & Status Diubah ke 'Dikembalikan'"
      ]
    }
  ]
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    return JSON.parse(raw);
  } catch (err) {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Ignore storage quota errors
  }
}

function resetDemoState() {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(DEFAULT_STATE);
}
