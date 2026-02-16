import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface NumerPayload {
  fromNumber: string;
  toNumber: string;
  context: string;
  sharedContext: boolean;
  location: { lat: number; lng: number } | null;
  timestamp: string;
}

/**
 * Send numer request to API
 */
export async function sendNumer(data: NumerPayload) {
  const response = await apiClient.post('/api/numer/send', data);
  return response.data;
}
