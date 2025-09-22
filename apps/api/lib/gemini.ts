import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_MODEL = 'gemini-1.5-flash-preview-0514';
const GEMINI_PRO_MODEL = 'gemini-pro';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

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

function getGenerativeModel(modelName: string = DEFAULT_MODEL): GenerativeModel {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY in the environment.');
  }

  const googleAI = new GoogleGenerativeAI(apiKey);
  return googleAI.getGenerativeModel({ model: modelName });
}

export async function callGemini(prompt: string): Promise<string> {
  const modelName = process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
  const model = getGenerativeModel(modelName);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text) {
    throw new Error('Gemini API returned an unexpected response.');
  }

  return text;
}
