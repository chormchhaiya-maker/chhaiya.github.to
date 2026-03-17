// api/chat.js
export default async function handler(req, res) {
  const key = process.env.XAI_API_KEY;

  if (!key) {
    return res.status(500).json({ error: "KEY_MISSING_ON_VERCEL" });
  }

  try {
    const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "grok-4",                    // try "grok-3" if grok-4 fails
        messages: req.body.messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await grokResponse.json();

    // Return the exact error from xAI so we can see it
    if (!grokResponse.ok) {
      console.error("xAI rejected:", data);
      return res.status(500).json({ 
        error: "Grok rejected the request",
        details: data.error?.message || data 
      });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: err.message });
  }
}
