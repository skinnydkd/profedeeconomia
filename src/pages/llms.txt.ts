import type { APIRoute } from 'astro';
import { buildLlmsIndex } from '@/lib/llms-index';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(buildLlmsIndex(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
