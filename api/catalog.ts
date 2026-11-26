import type { IncomingMessage, ServerResponse } from 'node:http';

interface VercelResponse extends ServerResponse {
  status?: (code: number) => VercelResponse;
  json?: (body: unknown) => void;
}

const EXAMPLE_CATEGORIES = [
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

export default function handler(req: IncomingMessage, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.statusCode = 405;
    res.end();
    return;
  }

  const payload = {
    source: 'example',
    syncedWithGoogleSheets: false,
    note: 'Data ini merupakan contoh kategori solusi untuk tampilan awal website. Katalog produk aktual diakses oleh AI Konsultan melalui tool Katalog_Produk di workflow n8n.',
    items: EXAMPLE_CATEGORIES,
  };

  if (typeof res.status === 'function') {
    const nextRes = res.status(200);
    if (typeof nextRes.json === 'function') {
      nextRes.json(payload);
      return;
    }
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}
