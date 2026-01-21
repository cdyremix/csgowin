// api/proxy.js  (or api/csgowin.js)
export default async function handler(req, res) {
  const apiKey = process.env.CSGOWIN_API_KEY;  // ← store securely in Vercel env vars

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
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
      throw new Error(`CSGOWIN API responded with ${response.status}`);
    }

    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');  // or restrict to 'https://yosoykush.fun'
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
