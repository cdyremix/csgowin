// api/proxy.js - TEMPORARY: hardcoded API key for testing
export default async function handler(req, res) {
  // For security: only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // ────────────────────────────────────────────────
  // HARDCODED KEY - REPLACE WITH YOUR FULL KEY
  const apiKey = "d1d0fc87e3";
  // ────────────────────────────────────────────────

  if (!apiKey || apiKey === "d1d0fc87e3") {
    return res.status(500).json({ error: 'API key is still missing or placeholder - edit proxy.js' });
  }

  try {
    console.log('Using hardcoded API key (length:', apiKey.length, ')'); // debug log

    const response = await fetch('https://api.csgowin.com/api/leaderboard/yosoykush', {
      method: 'GET',
      headers: {
        'x-apikey': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CSGOWIN upstream error:', response.status, errorText);
      throw new Error(`CSGOWIN API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error.message, error.stack);
    return res.status(500).json({ error: error.message });
  }
}
