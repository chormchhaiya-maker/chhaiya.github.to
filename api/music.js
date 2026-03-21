export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  try {
    // Use HuggingFace MusicGen via router
    const r = await fetch(
      'https://router.huggingface.co/hf-inference/models/facebook/musicgen-small',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
          'x-wait-for-model': 'true'
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    console.log('Music status:', r.status, r.headers.get('content-type'));

    if (!r.ok) {
      const t = await r.text();
      console.error('Music error:', t);
      return res.status(r.status).json({ error: t });
    }

    const buf = await r.arrayBuffer();
    const b64 = Buffer.from(buf).toString('base64');
    return res.status(200).json({ url: `data:audio/wav;base64,${b64}` });

  } catch (e) {
    console.error('Music error:', e);
    return res.status(500).json({ error: e.message });
  }
}
