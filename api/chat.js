// api/chat.js
export default async function handler(req, res) {
  console.log("API called - Key exists?", !!process.env.XAI_API_KEY);

  if (!process.env.XAI_API_KEY) {
    return res.status(500).json({ 
      error: "XAI_API_KEY is missing on Vercel server" 
    });
  }

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-4",
        messages: req.body.messages || [{ role: "user", content: "test" }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Grok API error:", data);
      return res.status(500).json({ error: data.error?.message || "Grok rejected the request" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy catch error:", error.message);
    res.status(500).json({ error: "Proxy failed: " + error.message });
  }
}
