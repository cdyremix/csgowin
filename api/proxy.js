// api/proxy.js - CSGOWIN Leaderboard Proxy (using /api/leaderboard/yosoykush)
const CSGOWIN_API = 'https://api.csgowin.com/api/leaderboard/yosoykush';
const API_KEY = 'd1d0fc87e3';  // Your current key - move to env var in production!

export default async function handler(req, res) {
  // Handle CORS preflight (OPTIONS request)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, User-Agent');
    return res.status(204).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: true, msg: 'GET only' });
  }

  // Set CORS and no-cache headers
  res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Cache-Control', 'no-store, max-age=0'); // Always fresh data

  try {
    console.log('CSGOWIN proxy request received - using key length:', API_KEY.length);

    // Optional: accept minTime & maxTime as query params (Unix ms) from frontend
    const url = new URL(req.url, 'http://localhost');
    const minTime = url.searchParams.get('minTime') || '0';           // default: all time
    const maxTime = url.searchParams.get('maxTime') || Date.now().toString();

    const fullUrl = `${CSGOWIN_API}?minTime=${minTime}&maxTime=${maxTime}`;
    console.log('Fetching CSGOWIN:', fullUrl);

    const apiRes = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'YosoyKush-Leaderboard/1.0'
      }
    });

    let data = await apiRes.json();

    // Forward exact response (including any errors from CSGOWIN)
    res.setHeader('Content-Type', 'application/json');

    if (!apiRes.ok || data.error) {
      console.log('CSGOWIN upstream error - status:', apiRes.status, 'response:', JSON.stringify(data));
      return res.status(apiRes.status || 500).json(data);
    }

    // Success - return the data
    console.log('CSGOWIN success - response length:', JSON.stringify(data).length);
    return res.status(200).json(data);

  } catch (err) {
    console.error('Proxy Error:', err.message, err.stack);
    return res.status(500).json({
      error: true,
      msg: 'Proxy failed - check Vercel logs or CSGOWIN status'
    });
  }
}

// Vercel config (optional but good to have)
export const config = {
  api: {
    bodyParser: true
  }
};
