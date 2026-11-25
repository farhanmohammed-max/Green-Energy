export interface NavItem {
  label: string;
  href: string;
}

export interface CoreValue {
  number: string;
  title: string;
  description: string;
}

export interface EducationTip {
  id: string;
  iconName: 'lightbulb' | 'sparkles' | 'power' | 'sliders' | 'sun' | 'shield' | 'wind' | 'thermometer' | 'clock' | 'plug';
  title: string;
  description: string;
  detail: string;
}

export interface GreenTechItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
}

export type CatalogFilterKey = 'semua' | 'pencahayaan' | 'energi-surya' | 'otomasi' | 'peralatan';

export interface SolutionCategoryItem {
  id: string;
  name: string;
  filterKey: Exclude<CatalogFilterKey, 'semua'>;
  categoryLabel: string;
  description: string;
  exampleNote: string;
  aiPrompt: string;
  image: string;
  imageAlt: string;
}

export interface RoadmapStage {
  stage: string;
  title: string;
  description: string;
  focusPoints: string[];
}

export interface BenefitItem {
  id: string;
  iconName: 'eye' | 'zap-off' | 'sun' | 'cpu' | 'leaf';
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export const HERO_IMAGE = {
  src: '/src/assets/images/hero_green_energy_1795581999110.jpg',
  alt: 'Hunian modern ramah lingkungan dengan panel surya di atap yang dikelilingi pepohonan hijau di bawah cahaya matahari pagi',
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Tentang Kampanye', href: '#tentang' },
  { label: 'Edukasi', href: '#edukasi' },
  { label: 'Green Technology', href: '#teknologi' },
  { label: 'Produk', href: '#produk' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'AI Konsultan', href: '#konsultan' },
];

export const HERO_PILLARS = [
  {
    label: 'Fokus Utama',
    title: 'Kebiasaan Hemat Listrik',
    description: 'Langkah praktis sehari-hari untuk mengurangi pemborosan energi di rumah dan ruang kerja.',
  },
  {
    label: 'Teknologi Hijau',
    title: 'Energi Terbarukan & Efisiensi',
    description: 'Pengenalan sistem panel surya, pencahayaan LED, penyimpanan daya, dan kontrol pintar.',
  },
  {
    label: 'Konsultasi Interaktif',
    title: 'AI Konsultan Green Tech',
    description: 'Tanya jawab terarah yang dirancang untuk terhubung dengan AI Agent n8n dan katalog solusi.',
  },
];

export const CORE_VALUES: CoreValue[] = [
  {
    number: '01',
    title: 'Edukasi Energi',
    description:
      'Menyediakan informasi yang jernih dan mudah dipahami agar masyarakat mengenali sumber pemborosan listrik serta menerapkan kebiasaan penggunaan energi secara bijak.',
  },
  {
    number: '02',
    title: 'Inovasi Teknologi Hijau',
    description:
      'Memperkenalkan perkembangan teknologi ramah lingkungan, mulai dari panel surya hingga sistem pengelolaan daya cerdas yang mendukung efisiensi energi modern.',
  },
  {
    number: '03',
    title: 'Aksi Berkelanjutan',
    description:
      'Mendorong langkah nyata yang konsisten dan terukur dari lingkungan rumah tangga hingga komunitas demi membangun kebiasaan energi yang lebih bertanggung jawab.',
  },
];

export const PRIMARY_EDUCATION_TIPS: EducationTip[] = [
  {
    id: 'matikan-lampu',
    iconName: 'lightbulb',
    title: 'Mematikan lampu saat tidak digunakan',
    description: 'Biasakan memadamkan sakelar setiap kali meninggalkan ruangan agar listrik tidak terbuang sia-sia.',
    detail: 'Penerangan yang menyala di ruang kosong menjadi salah satu kebiasaan pemborosan daya paling sering terjadi.',
  },
  {
    id: 'lampu-led',
    iconName: 'sparkles',
    title: 'Menggunakan lampu LED hemat energi',
    description: 'Pilih pencahayaan berbasis LED yang dirancang untuk menghasilkan cahaya optimal dengan konsumsi daya lebih rendah.',
    detail: 'Lampu LED juga memiliki ketahanan pakai yang lebih baik dibandingkan lampu pijar konvensional.',
  },
  {
    id: 'matikan-elektronik',
    iconName: 'power',
    title: 'Mematikan perangkat elektronik ketika tidak digunakan',
    description: 'Cabut steker atau matikan daya utama perangkat seperti televisi, charger, dan komputer saat tidak dipakai.',
    detail: 'Perangkat dalam mode siaga (standby) tetap menarik aliran listrik secara terus-menerus.',
  },
  {
    id: 'peralatan-efisien',
    iconName: 'sliders',
    title: 'Menggunakan peralatan listrik secara efisien',
    description: 'Atur suhu pendingin ruangan secara wajar, cuci pakaian sesuai kapasitas, dan hindari pengoperasian berlebihan.',
    detail: 'Pola pemakaian yang terencana menjaga kinerja perangkat sekaligus menekan beban listrik harian.',
  },
  {
    id: 'pencahayaan-alami',
    iconName: 'sun',
    title: 'Memanfaatkan pencahayaan alami',
    description: 'Buka tirai dan jendela pada siang hari untuk memaksimalkan sinar matahari sebagai sumber cahaya utama.',
    detail: 'Penataan ruangan yang memaksimalkan bukaan cahaya membantu mengurangi ketergantungan pada lampu siang hari.',
  },
  {
    id: 'perangkat-efisien',
    iconName: 'shield',
    title: 'Memilih perangkat dengan efisiensi energi yang baik',
    description: 'Perhatikan label efisiensi energi dan spesifikasi daya sebelum membeli peralatan rumah tangga baru.',
    detail: 'Pemilihan perangkat berefisiensi tinggi memberikan manfaat penggunaan energi yang lebih bijak dalam jangka panjang.',
  },
];

export const EXTRA_EDUCATION_TIPS: EducationTip[] = [
  {
    id: 'ventilasi-alami',
    iconName: 'wind',
    title: 'Optimalkan sirkulasi udara alami',
    description: 'Manfaatkan ventilasi silang di pagi dan sore hari agar ruangan tetap sejuk tanpa terus menyalakan pendingin.',
    detail: 'Udara yang mengalir alami membantu menurunkan panas ruang secara efektif.',
  },
  {
    id: 'perawatan-ac',
    iconName: 'thermometer',
    title: 'Rawat filter pendingin ruangan secara berkala',
    description: 'Filter AC yang bersih membantu sirkulasi udara tetap lancar sehingga kompresor tidak bekerja terlalu berat.',
    detail: 'Perawatan rutin juga menjaga kualitas udara di dalam rumah tetap nyaman.',
  },
  {
    id: 'jadwal-perangkat',
    iconName: 'clock',
    title: 'Jadwalkan penggunaan perangkat berdaya besar',
    description: 'Kelompokkan kegiatan seperti menyetrika atau mencuci dalam satu sesi agar pemanasan ulang tidak berulang.',
    detail: 'Penggunaan terstruktur menghindari lonjakan beban berulang dalam satu hari.',
  },
  {
    id: 'stop-kontak-sakelar',
    iconName: 'plug',
    title: 'Gunakan stop kontak bersakelar atau pengatur waktu',
    description: 'Sakelar individual memudahkan pemutusan arus ke beberapa perangkat sekaligus saat selesai digunakan.',
    detail: 'Solusi praktis untuk meja kerja, ruang keluarga, dan area pengisian daya.',
  },
];

export const GREEN_TECHNOLOGIES: GreenTechItem[] = [
  {
    id: 'solar-panel',
    title: 'Solar Panel',
    category: 'Energi Matahari',
    description:
      'Teknologi pemanfaatan energi matahari melalui modul fotovoltaik untuk mengonversi cahaya surya menjadi energi listrik bersih bagi bangunan maupun rumah tangga.',
    image: '/src/assets/images/tech_solar_panel_1795581999129.jpg',
    imageAlt: 'Panel surya monokristalin terpasang rapi di atap bangunan modern dengan latar pepohonan hijau',
    featured: true,
  },
  {
    id: 'smart-home',
    title: 'Smart Home',
    category: 'Otomasi & Kontrol',
    description:
      'Sistem pengelolaan perangkat rumah secara cerdas yang memudahkan penjadwalan pencahayaan, pendingin ruangan, serta pemantauan beban listrik.',
    image: '/src/assets/images/tech_smart_home_1795582000710.jpg',
    imageAlt: 'Ruang tamu modern dengan panel kontrol pintar dinding untuk pengelolaan energi rumah',
  },
  {
    id: 'energy-storage',
    title: 'Energy Storage',
    category: 'Penyimpanan Daya',
    description:
      'Teknologi penyimpanan energi berbasis baterai modern yang menyimpan kelebihan daya untuk dimanfaatkan saat dibutuhkan, mendukung kemandirian energi.',
    image: '/src/assets/images/tech_energy_storage_1795582000778.jpg',
    imageAlt: 'Unit baterai penyimpanan energi dinding berdesain minimalis pada ruang hunian modern',
  },
  {
    id: 'led-technology',
    title: 'LED Technology',
    category: 'Pencahayaan Efisien',
    description:
      'Teknologi pencahayaan yang efisien menggunakan dioda pemancar cahaya dengan kualitas penerangan stabil, panas rendah, dan daya tahan lebih lama.',
    image: '/src/assets/images/tech_led_lighting_1795582001888.jpg',
    imageAlt: 'Interior ruang keluarga terang hangat menggunakan pencahayaan LED modern dan cahaya alami',
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy',
    category: 'Sumber Terbarukan',
    description:
      'Pemanfaatan sumber energi terbarukan seperti tenaga surya, angin, dan air yang dapat diperbarui secara alami guna mendukung transisi menuju masa depan rendah emisi.',
    image: '/src/assets/images/tech_renewable_energy_1795582001369.jpg',
    imageAlt: 'Turbin angin dan ladang panel surya di perbukitan hijau yang asri saat matahari pagi',
    featured: true,
  },
];

export const CATALOG_FILTERS: { key: CatalogFilterKey; label: string }[] = [
  { key: 'semua', label: 'Semua Kategori' },
  { key: 'pencahayaan', label: 'Pencahayaan' },
  { key: 'energi-surya', label: 'Energi Surya' },
  { key: 'otomasi', label: 'Otomasi & Monitoring' },
  { key: 'peralatan', label: 'Peralatan Rumah' },
];

/**
 * Data kategori contoh untuk tampilan awal website.
 * Katalog produk aktual dikelola di Google Sheets melalui tool Katalog_Produk pada workflow n8n.
 * Struktur ini disiapkan agar mudah dihubungkan ke API katalog n8n di tahap pengembangan berikutnya.
 */
export const SOLUTION_CATEGORIES: SolutionCategoryItem[] = [
  {
    id: 'kat-lampu-led',
    name: 'Lampu LED Hemat Energi',
    filterKey: 'pencahayaan',
    categoryLabel: 'Contoh Kategori · Pencahayaan',
    description:
      'Kategori solusi penerangan rumah dan ruang kerja menggunakan teknologi LED untuk membantu efisiensi konsumsi listrik harian.',
    exampleNote: 'Contoh kategori solusi — bukan penawaran produk aktual.',
    aiPrompt: 'Apa saja pertimbangan memilih lampu LED hemat energi yang sesuai untuk kebutuhan rumah?',
    image: '/src/assets/images/tech_led_lighting_1795582001888.jpg',
    imageAlt: 'Ilustrasi kategori pencahayaan lampu LED hemat energi di ruang modern',
  },
  {
    id: 'kat-panel-surya',
    name: 'Panel Surya',
    filterKey: 'energi-surya',
    categoryLabel: 'Contoh Kategori · Energi Surya',
    description:
      'Kategori sistem fotovoltaik atap dan pendukung energi matahari sebagai alternatif sumber listrik terbarukan untuk hunian maupun usaha.',
    exampleNote: 'Contoh kategori solusi — bukan penawaran produk aktual.',
    aiPrompt: 'Jelaskan manfaat panel surya dan hal yang perlu dipersiapkan sebelum memasangnya di rumah.',
    image: '/src/assets/images/tech_solar_panel_1795581999129.jpg',
    imageAlt: 'Ilustrasi kategori panel surya pada atap bangunan ramah lingkungan',
  },
  {
    id: 'kat-smart-plug',
    name: 'Smart Plug',
    filterKey: 'otomasi',
    categoryLabel: 'Contoh Kategori · Otomasi',
    description:
      'Kategori stop kontak pintar yang memungkinkan penjadwalan daya dan pemutusan arus perangkat elektronik secara praktis dari jarak jauh.',
    exampleNote: 'Contoh kategori solusi — bukan penawaran produk aktual.',
    aiPrompt: 'Bagaimana cara kerja Smart Plug dalam membantu mengurangi pemborosan listrik dari perangkat standby?',
    image: '/src/assets/images/tech_smart_home_1795582000710.jpg',
    imageAlt: 'Ilustrasi kategori perangkat otomasi dan Smart Plug di hunian cerdas',
  },
  {
    id: 'kat-monitoring-energi',
    name: 'Perangkat Monitoring Energi',
    filterKey: 'otomasi',
    categoryLabel: 'Contoh Kategori · Monitoring',
    description:
      'Kategori alat pemantau konsumsi daya listrik secara berkala agar pengguna memahami pola pemakaian dan menentukan prioritas penghematan.',
    exampleNote: 'Contoh kategori solusi — bukan penawaran produk aktual.',
    aiPrompt: 'Bagaimana perangkat monitoring energi membantu saya memahami pola penggunaan listrik di rumah?',
    image: '/src/assets/images/tech_energy_storage_1795582000778.jpg',
    imageAlt: 'Ilustrasi kategori perangkat monitoring dan pengelolaan energi rumah tangga',
  },
  {
    id: 'kat-peralatan-rumah',
    name: 'Peralatan Rumah Tangga Hemat Energi',
    filterKey: 'peralatan',
    categoryLabel: 'Contoh Kategori · Peralatan Rumah',
    description:
      'Kategori perangkat rumah tangga dengan rancangan efisiensi energi seperti pendingin inverter, mesin cuci efisien, dan perlengkapan berlabel hemat daya.',
    exampleNote: 'Contoh kategori solusi — bukan penawaran produk aktual.',
    aiPrompt: 'Rekomendasikan kriteria memilih peralatan rumah tangga hemat energi yang tepat.',
    image: '/src/assets/images/hero_green_energy_1795581999110.jpg',
    imageAlt: 'Ilustrasi hunian modern yang mendukung penggunaan peralatan rumah tangga hemat energi',
  },
];

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    stage: 'TAHAP 1 — EDUKASI',
    title: 'Membangun Pemahaman Dasar',
    description: 'Meningkatkan pemahaman masyarakat mengenai penghematan energi.',
    focusPoints: [
      'Mengenali pola pemborosan listrik di lingkungan rumah tangga.',
      'Memahami prinsip dasar efisiensi daya dan teknologi hijau.',
      'Menyediakan akses tanya jawab edukatif bersama AI Konsultan Green Tech.',
    ],
  },
  {
    stage: 'TAHAP 2 — IMPLEMENTASI',
    title: 'Penerapan Kebiasaan & Solusi',
    description: 'Mengajak masyarakat menerapkan kebiasaan hemat energi dan mengenal teknologi hijau.',
    focusPoints: [
      'Memulai langkah sederhana dari pencahayaan dan perangkat elektronik.',
      'Mengenal kategori solusi seperti LED, Smart Plug, dan energi surya.',
      'Mendorong adopsi bertahap sesuai kebutuhan masing-masing rumah tangga.',
    ],
  },
  {
    stage: 'TAHAP 3 — EVALUASI',
    title: 'Refleksi & Keberlanjutan',
    description: 'Mendorong evaluasi kebiasaan penggunaan energi dan keberlanjutan kampanye.',
    focusPoints: [
      'Meninjau kebiasaan penggunaan listrik secara berkala.',
      'Mengumpulkan umpan balik nyata dari peserta kampanye.',
      'Mengembangkan materi edukasi dan referensi teknologi berkelanjutan.',
    ],
  },
];

export const BENEFITS_LIST: BenefitItem[] = [
  {
    id: 'kesadaran',
    iconName: 'eye',
    title: 'Meningkatkan kesadaran penggunaan energi',
    description: 'Membantu masyarakat lebih peka terhadap cara dan waktu penggunaan listrik sehari-hari.',
  },
  {
    id: 'kurangi-pemborosan',
    iconName: 'zap-off',
    title: 'Mengurangi kebiasaan pemborosan listrik',
    description: 'Mendorong perubahan kebiasaan kecil yang konsisten untuk mencegah energi terbuang percuma.',
  },
  {
    id: 'energi-terbarukan',
    iconName: 'sun',
    title: 'Memahami teknologi energi terbarukan',
    description: 'Memperkenalkan cara kerja energi surya, penyimpanan daya, dan sumber bersih lainnya secara jelas.',
  },
  {
    id: 'solusi-ramah',
    iconName: 'cpu',
    title: 'Mengenal solusi teknologi ramah lingkungan',
    description: 'Memberikan gambaran kategori perangkat hemat energi sebagai bahan pertimbangan yang objektif.',
  },
  {
    id: 'gaya-hidup',
    iconName: 'leaf',
    title: 'Mendorong gaya hidup berkelanjutan',
    description: 'Menumbuhkan budaya penggunaan sumber daya yang lebih bertanggung jawab untuk masa depan bersama.',
  },
];

/**
 * Struktur data testimonial disiapkan untuk menampung testimoni peserta asli di masa mendatang.
 * Sengaja dibiarkan kosong hingga ada testimoni terverifikasi.
 */
export const TESTIMONIALS: TestimonialItem[] = [];

export const QUICK_CONSULTATION_QUESTIONS: string[] = [
  'Bagaimana cara menghemat listrik di rumah?',
  'Apa manfaat menggunakan panel surya?',
  'Apa saja teknologi hemat energi?',
  'Rekomendasikan solusi hemat energi.',
  'Bagaimana cara menghitung estimasi penghematan listrik?',
];

export const AI_WELCOME_MESSAGE =
  'Halo! Saya AI Konsultan Green Tech. Saya siap membantu kamu memahami cara menghemat energi dan menemukan solusi teknologi ramah lingkungan. Ada yang ingin kamu tanyakan?';
