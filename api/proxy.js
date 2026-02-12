// api/proxy.js - CSGOWIN Affiliate Referrals Proxy (fixed for /api/affiliate/external)
const CSGOWIN_API_BASE = 'https://api.csgowin.com/api/affiliate/external';
const API_KEY = 'd1d0fc87e3';  // Your key - move to env var in production
const AFFILIATE_CODE = 'yosoykush';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  try {
    const url = new URL(req.url, 'http://localhost');
    let gt = url.searchParams.get('gt') || new Date('2026-02-01').getTime(); // Contest start
    let lt = url.searchParams.get('lt') || Date.now();                     // Now

    const params = new URLSearchParams({
      code: AFFILIATE_CODE,
      gt: gt.toString(),
      lt: lt.toString(),
      filters: 'wager',
      sort: 'desc',
      take: '20',   // Fetch more than needed
      skip: '0',
      search: ''
    });

    const fullUrl = `${CSGOWIN_API_BASE}?${params.toString()}`;
    console.log('Fetching CSGOWIN:', fullUrl);

    const apiRes = await fetch(fullUrl, {
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'YosoyKush-Leaderboard/1.0'
      }
    });

    const data = await apiRes.json();

    if (!apiRes.ok || data.error) {
      return res.status(apiRes.status || 400).json(data);
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy failed', message: err.message });
  }
}

export const config = {
  api: { bodyParser: true }
};
