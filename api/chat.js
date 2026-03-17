export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-4.20-beta-0309-non-reasoning",   // This is the most stable one right now
        messages: messages,
        temperature: 0.85,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("xAI Error:", errorText);
      return res.status(500).json({ 
        error: "xAI API Error", 
        details: errorText 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ 
      error: "Server Error", 
      message: err.message 
    });
  }
}
