import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_MODEL = 'gemini-2.5-flash-preview-05-20';

interface GeminiCandidatePart {
  text?: string;
}

interface GeminiCandidateContent {
  parts?: GeminiCandidatePart[];
}

interface GeminiCandidate {
  content?: GeminiCandidateContent;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

const createRequestPayload = (prompt: string) => ({
  contents: [
    {
      parts: [{ text: prompt }]
    }
  ]
});

export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY in the environment.');
  }

  const model = process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
  const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createRequestPayload(prompt))
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Gemini API request failed (${response.status}): ${message}`);
  }

  const result = (await response.json()) as GeminiResponse;
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini API returned an unexpected response.');
  }

  return text;
}
