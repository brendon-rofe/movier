const TMDB_BASE = 'https://api.themoviedb.org/3';

function apiUrl(path: string, params: Record<string, string> = {}): string {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('api_key', process.env.TMDB_API_KEY || '');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

export async function fetchTmdb<T>(path: string, params?: Record<string, string>): Promise<T> {
  const res = await fetch(apiUrl(path, params));
  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
