// src/lib/jocs-economics/client/api.ts
// Fetch wrapper tipat per a les API routes /api/jocs/*.

import type {
  StartRequest, StartResponse,
  AnswerRequest, AnswerResponse,
  FinalStats,
  LeaderboardIndividualRow, LeaderboardInstituteRow,
} from './types';

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'request-failed');
  return data as T;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'request-failed');
  return data as T;
}

export const api = {
  start: (req: StartRequest) => postJson<StartResponse>('/api/jocs/start', req),
  answer: (req: AnswerRequest) => postJson<AnswerResponse>('/api/jocs/answer', req),
  finish: (gameId: string, token: string) =>
    postJson<{ final: FinalStats }>('/api/jocs/finish', { gameId, token }),
  leaderboardIndividual: (limit = 50, offset = 0) =>
    getJson<{ type: 'individual'; rows: LeaderboardIndividualRow[] }>(
      `/api/jocs/leaderboard?type=individual&limit=${limit}&offset=${offset}`,
    ),
  leaderboardInstitute: (limit = 50, offset = 0) =>
    getJson<{ type: 'institute'; rows: LeaderboardInstituteRow[] }>(
      `/api/jocs/leaderboard?type=institute&limit=${limit}&offset=${offset}`,
    ),
  institutes: (q: string) =>
    getJson<{ suggestions: string[] }>(`/api/jocs/institutes?q=${encodeURIComponent(q)}`),
};
