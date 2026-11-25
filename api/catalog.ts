import type { IncomingMessage, ServerResponse } from 'node:http';
import { SOLUTION_CATEGORIES } from '../src/data/campaignData';

interface VercelResponse extends ServerResponse {
  status?: (code: number) => VercelResponse;
  json?: (body: unknown) => void;
}

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
    items: SOLUTION_CATEGORIES,
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
