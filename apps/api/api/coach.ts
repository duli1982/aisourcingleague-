import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from '../lib/gemini.js';

function parseBody<T>(req: VercelRequest): T | undefined {
  const body = req.body;

  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as T;
    } catch {
      return undefined;
    }
  }

  return body as T | undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const { question } = parseBody<{ question?: string }>(req) ?? {};

  if (!question || typeof question !== 'string') {
    return res.status(400).send('A question is required.');
  }

  const prompt =
    'You are a helpful and encouraging AI Sourcing Coach for recruiters participating in a competition.\n' +
    `Answer the following question with a concise, friendly tone:\n"${question}"`;

  try {
    const text = await callGemini(prompt);
    return res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error generating coach response', error);
    return res.status(500).send('Unable to contact the AI coach right now.');
  }
}
