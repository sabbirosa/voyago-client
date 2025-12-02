"use client";

const ACCESS_TOKEN_KEY = "voyago_access_token";
const REFRESH_TOKEN_KEY = "voyago_refresh_token";

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveTokens(tokens: Tokens) {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } catch {
    // Swallow storage errors; app can still function without persistence.
  }
}

export function getTokens(): Tokens | null {
  if (!isBrowser()) return null;

  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!accessToken || !refreshToken) {
      return null;
    }

    return { accessToken, refreshToken };
  } catch {
    return null;
  }
}

export function clearTokens() {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // ignore
  }
}


