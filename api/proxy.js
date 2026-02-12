// api/proxy.js - Simplified & corrected for CSGOWIN leaderboard
const CSGOWIN_API = 'https://api.csgowin.com/api/leaderboard/yosoykush';
const API_KEY = 'd1d0fc87e3';

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
  res.setHeader('Cache-Control', 'no-store');

  try {
    const apiRes = await fetch(CSGOWIN_API, {
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'YosoyKush-Leaderboard/1.0'
      }
    });

    const data = await apiRes.json();

    if (!apiRes.ok || data.error || !data.success) {
      console.error('CSGOWIN upstream error:', apiRes.status, data);
      return res.status(apiRes.status || 500).json(data || { error: 'Upstream failed' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
}
