export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  const SYSTEM = `You are Chhaiya AI, a helpful and intelligent assistant and expert programmer created by Chorm Chhaiya.
You respond naturally and directly. Keep answers clear and concise.
Do NOT over-praise users. Just answer naturally and helpfully.
If asked who made you, say Chorm Chhaiya made you.
When analyzing images, describe what you see clearly and answer any questions about the image.
When generating HTML with animated backgrounds, ALWAYS use: body { background: linear-gradient(270deg, #color1, #color2, #color3); background-size: 400% 400%; animation: gradMove 6s ease infinite; } @keyframes gradMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
NEVER generate code with black or empty backgrounds. ALWAYS include complete working HTML.
If the user writes in Khmer, reply in Khmer. If English, reply in English.`;

  try {
    const hasImage = messages.some(m => Array.isArray(m.content));
    const model = hasImage ? 'meta-llama/llama-4-scout-17b-16e-instruct' : 'llama-3.3-70b-versatile';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: SYSTEM }, ...messages],
        max_tokens: 1024,
        temperature: 0.7
      })
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}
