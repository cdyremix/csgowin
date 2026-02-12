// api/proxy.js - CSGOWIN Affiliate Referrals Proxy (updated for /api/affiliate/external)
const CSGOWIN_API_BASE = 'https://api.csgowin.com/api/affiliate/external';
const API_KEY = 'd1d0fc87e3';          // Your key (move to env var in production!)
const AFFILIATE_CODE = 'yosoykush';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed - use GET' });
  }

  // CORS & no-cache
  res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  try {
    const url = new URL(req.url, 'http://localhost');
    // Use query params from frontend if provided, else fallback
    let gt = url.searchParams.get('gt') || new Date('2026-02-01').getTime(); // Contest start ms
    let lt = url.searchParams.get('lt') || Date.now();                      // Now

    const params = new URLSearchParams({
      code: AFFILIATE_CODE,
      gt: gt.toString(),
      lt: lt.toString(),
      filters: 'wager',    // As per your example
      sort: 'desc',
      take: '20',          // Get top 20 to be safe (frontend slices to 10)
      skip: '0',
      search: ''
    });

    const fullUrl = `${CSGOWIN_API_BASE}?${params.toString()}`;

    console.log('CSGOWIN proxy fetching:', fullUrl);
    console.log('Using API key length:', API_KEY.length);

    const apiRes = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'YosoyKush-Leaderboard-Proxy/1.0'
      }
    });

    let data = await apiRes.json();

    // Log sample for Vercel debugging
    console.log('CSGOWIN upstream status:', apiRes.status);
    console.log('CSGOWIN response sample:', JSON.stringify(data).slice(0, 500));

    if (!apiRes.ok || data.error) {
      return res.status(apiRes.status || 500).json(data || { error: 'Upstream API error' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('CSGOWIN proxy error:', err.message, err.stack);
    res.status(500).json({
      error: true,
      msg: 'Proxy failed - check Vercel logs or CSGOWIN status'
    });
  }
}

// Vercel config
export const config = {
  api: {
    bodyParser: true
  }
};
