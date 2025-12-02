"use client";

import { clientEnv } from "@/app/env";

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
  const url = `${clientEnv.apiUrl}${
    path.startsWith("/") ? path : `/${path}`
  }`;

  const { method = "GET", body, headers, withCredentials } = options;

  // Check if body is FormData - if so, don't set Content-Type and don't stringify
  const isFormData = body instanceof FormData;
  const requestHeaders = new Headers(headers || {});
  
  // Only set Content-Type for non-FormData requests
  if (!isFormData && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    method,
    headers: requestHeaders,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    credentials: withCredentials ? "include" : "same-origin",
  });

  if (!res.ok) {
    // Try to parse structured error response
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // If JSON parsing fails, use text
    const text = await res.text();
      if (text) {
        errorMessage = text;
      }
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses gracefully
  if (res.status === 204) {
    return undefined as TResponse;
  }

  return (await res.json()) as TResponse;
}
