export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are Chhaiya AI, a smart, friendly, and helpful AI assistant created by ChhaiyaDeveloper-AI. Be concise, clear, and engaging. Use emojis occasionally.'
        },
        ...messages
      ],
      max_tokens: 1024,
      temperature: 0.7
    })
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
