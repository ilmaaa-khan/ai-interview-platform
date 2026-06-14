const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function getAIFeedback({ question, answer, category, apiKey, model = 'mistralai/mistral-7b-instruct' }) {
  if (!apiKey) throw new Error('NO_API_KEY');
  if (!answer?.trim()) throw new Error('NO_ANSWER');

  const prompt = `You are an expert senior developer conducting a technical interview. 
Evaluate the following answer to a ${category.toUpperCase()} interview question.

QUESTION: ${question}

CANDIDATE'S ANSWER: ${answer}

Provide a structured evaluation in JSON format with these exact keys:
{
  "score": <number 0-100>,
  "grade": <"Excellent" | "Good" | "Needs Improvement" | "Insufficient">,
  "summary": <2-3 sentence overall assessment>,
  "strengths": [<list of 2-3 specific things done well, or empty array>],
  "improvements": [<list of 2-3 specific areas to improve, or empty array>],
  "modelAnswer": <2-3 sentence ideal answer hint without giving everything away>,
  "resources": [<1-2 topic strings to study, e.g. "JavaScript Closures", "MDN Web Docs: Promises">]
}

Be fair, constructive, and specific. If the answer is empty or off-topic, score it 0-10.
Respond with ONLY the JSON object, no markdown, no preamble.`;

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://devprep-ai.app',
      'X-Title': 'DevPrep AI Interview Platform',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 600,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error('INVALID_API_KEY');
    if (res.status === 429) throw new Error('RATE_LIMITED');
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';

  try {
    // Strip possible markdown fences
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(clean);
  } catch {
    // Return a fallback structure if JSON parse fails
    return {
      score: 50,
      grade: 'Good',
      summary: text.slice(0, 200),
      strengths: ['Answer provided'],
      improvements: ['Could be more detailed'],
      modelAnswer: '',
      resources: [],
    };
  }
}

export async function generateQuestion({ category, difficulty, apiKey, model = 'mistralai/mistral-7b-instruct' }) {
  if (!apiKey) throw new Error('NO_API_KEY');

  const prompt = `Generate a single ${difficulty} difficulty ${category.toUpperCase()} interview question for a frontend developer.

Return JSON only with this format:
{
  "text": <the question>,
  "hint": <a subtle hint without giving the answer>,
  "difficulty": "${difficulty}"
}

Make it practical and relevant to real-world development. No markdown.`;

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://devprep-ai.app',
      'X-Title': 'DevPrep AI',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 200,
    }),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(clean);
}
