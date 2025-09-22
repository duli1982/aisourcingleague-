import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from '../lib/gemini.js';
import { findGameById } from '../data/games.js';

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

  const { gameId, submission } = parseBody<{ gameId?: string; submission?: string }>(req) ?? {};

  if (!submission || typeof submission !== 'string') {
    return res.status(400).send('A Boolean search submission is required.');
  }

  const game = findGameById(gameId);
  if (!game) {
    return res.status(400).send('Unknown game identifier.');
  }

  const prompt =
    `You are an expert AI Sourcing Coach for recruiters. A participant is playing "${game.title}".\n\n` +
    `Role context: ${game.context}.\n` +
    `Task: ${game.task}.\n\n` +
    'The participant submitted the following Boolean search string:\n' +
    `"${submission}"\n\n` +
    'Please:\n' +
    '1. Analyse the string for effectiveness, precision, and potential missed keywords.\n' +
    '2. Provide a score out of 100 on its own line using the format SCORE: [number].\n' +
    '3. Give three concrete, actionable tips for improvement in a bulleted list.\n' +
    '4. Provide an improved version of their string.\n' +
    '5. Format the entire response as simple markdown.\n';

  try {
    const text = await callGemini(prompt);
    const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
    const score = scoreMatch ? Number.parseInt(scoreMatch[1], 10) : 0;
    const feedback = text.replace(/SCORE:\s*\d+/i, '').trim();

    return res.status(200).json({ feedback, score });
  } catch (error) {
    console.error('Error generating feedback', error);
    return res.status(500).send('Unable to generate feedback at this time.');
  }
}
