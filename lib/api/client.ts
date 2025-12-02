"use client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:5000/api/v1";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export async function apiFetch<TResponse>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    headers?: HeadersInit;
    // When true, credentials like cookies are sent for auth-protected routes
    withCredentials?: boolean;
  } = {}
): Promise<TResponse> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const { method = "GET", body, headers, withCredentials } = options;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: withCredentials ? "include" : "same-origin",
  });

  if (!res.ok) {
    // Optionally, you can extend this to parse structured error responses
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  // Handle empty responses gracefully
  if (res.status === 204) {
    return undefined as TResponse;
  }

  return (await res.json()) as TResponse;
}
