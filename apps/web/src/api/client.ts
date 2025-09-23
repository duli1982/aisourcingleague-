const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

interface FeedbackResponse {
  feedback: string;
  score: number;
}

interface CoachResponse {
  response: string;
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return response.json() as Promise<T>;
}

export async function submitGame(
  gameId: string,
  submission: string
): Promise<FeedbackResponse> {
  const response = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, submission })
  });

  return handleResponse<FeedbackResponse>(response);
}

export async function askCoach(question: string): Promise<CoachResponse> {
  const response = await fetch(`${API_BASE_URL}/api/coach`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });

  return handleResponse<CoachResponse>(response);
}
