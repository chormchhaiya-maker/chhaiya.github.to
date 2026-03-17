// api/chat.js  ← replace with this simpler code
export default async function handler(req, res) {
  const key = process.env.XAI_API_KEY;

  if (!key) {
    return res.status(500).json({ error: "No API key on Vercel" });
  }

  try {
    const body = req.body;

    const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "grok-4",
        messages: body.messages || [{ role: "user", content: "Hello" }]
      })
    });

    const data = await grokRes.json();

    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Proxy failed" });
  }
}
