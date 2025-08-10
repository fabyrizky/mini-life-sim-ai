// File: api/ai.js
export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const { model, prompt } = await req.json();
  try {
    if (model === 'ollama') {
      const OLLAMA_URL = process.env.OLLAMA_URL;
      if (!OLLAMA_URL) throw new Error('OLLAMA_URL belum diset');
      const res = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const json = await res.json();
      return new Response(JSON.stringify({ text: json.text }), { status: res.status, headers: { 'Content-Type': 'application/json' }});
    } else {
      const OPENAI_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_KEY) throw new Error('OPENAI_API_KEY belum diset');
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0.8
        })
      });
      const json = await res.json();
      return new Response(JSON.stringify(json), { status: res.status, headers: { 'Content-Type': 'application/json' }});
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' }});
  }
}
