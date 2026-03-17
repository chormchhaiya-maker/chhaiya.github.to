export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // just in case

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    const xaiRes = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-4.20-beta-0309-non-reasoning",   // ← Try this model (very stable)
        messages: messages,
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    const data = await xaiRes.json();

    if (!xaiRes.ok) {
      console.error("xAI returned error:", data);
      return res.status(500).json({ 
        error: "xAI API Error", 
        details: data 
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("Full server error:", err);
    return res.status(500).json({ 
      error: "Server Error", 
      message: err.message 
    });
  }
}
