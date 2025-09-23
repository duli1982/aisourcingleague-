import { handleResponse } from './client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

interface GreetingResponse {
  message: string;
}

export async function getGreeting(): Promise<GreetingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/greeting`);
  return handleResponse<GreetingResponse>(response);
}
