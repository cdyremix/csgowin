export default async function handler(req, res) {
  // Set CORS headers FIRST - so they apply to ALL responses (including errors)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request (some browsers send this)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // For security: only allow GET (after OPTIONS)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.CSGOWIN_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: API key missing' });
  }

  try {
    const response = await fetch('https://api.csgowin.com/api/leaderboard/yosoykush', {
      method: 'GET',
      headers: {
        'x-apikey': d1d0fc87e3,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CSGOWIN API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
