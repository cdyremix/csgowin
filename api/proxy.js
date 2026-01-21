// api/proxy.js - CSGOWIN AFFILIATE LEADERBOARD PROXY (adapted from Upgrader style)
// Hardcoded key for testing - replace with your full key
const CSGOWIN_API = 'https://api.csgowin.com/api/leaderboard/yosoykush';
const API_KEY = 'd1d0fc87e3'; // ← REPLACE WITH YOUR FULL KEY HERE (longer string)

export default async function handler(req, res) {
  // CORS Preflight (fixes OPTIONS blocked error in browser)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, User-Agent');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: true, msg: 'GET only' });
  }

  // CORS for all responses
  res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Cache-Control', 'no-store, max-age=0'); // Always fresh data

  try {
    console.log('CSGOWIN proxy request received - using key length:', API_KEY.length);

    const apiRes = await fetch(CSGOWIN_API, {
      method: 'GET',
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'YosoyKush-Leaderboard/1.0'
      }
    });

    let data = await apiRes.json();

    // Forward exact response from CSGOWIN (including errors)
    res.setHeader('Content-Type', 'application/json');

    if (!apiRes.ok || data.error) {
      return res.status(apiRes.status || 500).json(data);
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Proxy Error:', err.message, err.stack);
    return res.status(500).json({
      error: true,
      msg: 'Proxy failed - check Vercel logs or CSGOWIN status'
    });
  }
}

// Vercel config (ensures body parsing if needed later, though not used here)
export const config = {
  api: {
    bodyParser: true
  }
};
