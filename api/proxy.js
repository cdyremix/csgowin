// api/proxy.js
export default async function handler(req, res) {
  // For security: only allow GET
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
        'x-apikey': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CSGOWIN API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Allow CORS from your site (or '*' for testing)
    res.setHeader('Access-Control-Allow-Origin', '*');  // Change to 'https://yosoykush.fun' in production
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
