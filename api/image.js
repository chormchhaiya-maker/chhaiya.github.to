export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  const models = [
    'black-forest-labs/FLUX.1-schnell',
    'stabilityai/stable-diffusion-xl-base-1.0',
    'runwayml/stable-diffusion-v1-5'
  ];

  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);
      const r = await fetch(
        `https://router.huggingface.co/hf-inference/models/${model}`,
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

      console.log(`Model ${model} status: ${r.status}, type: ${r.headers.get('content-type')}`);

      if (r.status === 503) {
        console.log(`Model ${model} loading, trying next...`);
        continue;
      }

      if (!r.ok) {
        const t = await r.text();
        console.error(`Model ${model} error: ${t}`);
        continue;
      }

      const contentType = r.headers.get('content-type') || '';
      if (!contentType.includes('image') && !contentType.includes('octet')) {
        const t = await r.text();
        console.error(`Model ${model} returned non-image: ${t}`);
        continue;
      }

      const buf = await r.arrayBuffer();
      const b64 = Buffer.from(buf).toString('base64');
      return res.status(200).json({ url: `data:image/png;base64,${b64}`, model });

    } catch (e) {
      console.error(`Model ${model} threw: ${e.message}`);
      continue;
    }
  }

  return res.status(500).json({ error: 'All image models failed. Please try again in a moment.' });
}
