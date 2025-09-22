import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { findGameById } from '../data/games.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash-preview-05-20';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const callGemini = async prompt => {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY in the environment.');
  }

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Gemini API request failed (${response.status}): ${message}`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini API returned an unexpected response.');
  }

  return text;
};

app.post('/api/feedback', async (req, res) => {
  const { gameId, submission } = req.body ?? {};

  if (!submission || typeof submission !== 'string') {
    return res.status(400).send('A Boolean search submission is required.');
  }

  const game = findGameById(gameId);
  if (!game) {
    return res.status(400).send('Unknown game identifier.');
  }

  const prompt = `You are an expert AI Sourcing Coach for recruiters. A participant is playing "${game.title}".\n\n` +
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

    res.json({ feedback, score });
  } catch (error) {
    console.error('Error generating feedback', error);
    res.status(500).send('Unable to generate feedback at this time.');
  }
});

app.post('/api/coach', async (req, res) => {
  const { question } = req.body ?? {};

  if (!question || typeof question !== 'string') {
    return res.status(400).send('A question is required.');
  }

  const prompt =
    'You are a helpful and encouraging AI Sourcing Coach for recruiters participating in a competition.\n' +
    `Answer the following question with a concise, friendly tone:\n"${question}"`;

  try {
    const text = await callGemini(prompt);
    res.json({ response: text });
  } catch (error) {
    console.error('Error generating coach response', error);
    res.status(500).send('Unable to contact the AI coach right now.');
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
