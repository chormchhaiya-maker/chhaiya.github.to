export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { messages } = req.body;
    const SYSTEM = "You are Chhaiya AI, created by Chorm Chhaiya, a Grade 10 student in Cambodia. Be helpful and natural. Reply in Khmer if user writes in Khmer.";
    const model = messages.some(m => Array.isArray(m.content)) ? 'meta-llama/llama-4-scout-17b-16e-instruct' : 'llama-3.3-70b-versatile';
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: SYSTEM }, ...messages], max_tokens: 1024, temperature: 0.7 })
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}
