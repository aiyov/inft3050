export interface RequestParams {
  [key: string]: any;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: RequestParams;
  signal?: AbortSignal;
  timeout?: number;
}

function buildURL(url: string, params?: RequestParams): string {
  if (!params) return url;
  const u = new URL(url, typeof window === 'undefined' ? 'http://localhost' : window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      u.searchParams.append(key, String(value));
    }
  });
  return u.pathname + (u.search ? u.search : '');
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/proxy';

function joinPaths(base: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path; // absolute URL passthrough
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

export async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body, params, signal, timeout } = options;

  const controller = new AbortController();
  const combinedSignal = signal || controller.signal;
  let timeoutId: any;
  if (timeout && typeof window !== 'undefined') {
    timeoutId = window.setTimeout(() => controller.abort(), timeout);
  }

  try {
    const pathWithBase = joinPaths(BASE_URL, url);
    const finalUrl = buildURL(pathWithBase, params);
    const init: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: combinedSignal,
    };

    if (body !== undefined && method !== 'GET') {
      init.body = body instanceof FormData ? body : JSON.stringify(body);
      if (body instanceof FormData) {
        // 浏览器会自动设置 FormData 的 Content-Type
        delete (init.headers as Record<string, string>)['Content-Type'];
      }
    }

    const res = await fetch(finalUrl, init);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return (await res.json()) as T;
    }
    if (contentType.includes('text/')) {
      return (await res.text()) as unknown as T;
    }
    return (await res.blob()) as unknown as T;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export default request;
