// Thin API client for the Pamoja Network backend.
// All calls go through Next.js's /api rewrite → Express backend, with the JWT attached.

const TOKEN_KEY = "pamoja_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

/**
 * Core request helper. Throws an Error(message) on non-2xx so callers can
 * `try/catch` and surface a human-readable message.
 */
export async function api(path, { method = "GET", body, auth = true, headers = {} } = {}) {
  const opts = { method, headers: { ...headers } };
  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  if (auth) {
    const t = getToken();
    if (t) opts.headers["Authorization"] = `Bearer ${t}`;
  }

  let res;
  try {
    res = await fetch(`/api${path}`, opts);
  } catch {
    throw new Error("Cannot reach the server. Is the backend running on port 4000?");
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : {};

  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }
  return data;
}

// Convenience verbs
export const get = (p, o) => api(p, { ...o, method: "GET" });
export const post = (p, body, o) => api(p, { ...o, method: "POST", body });
export const put = (p, body, o) => api(p, { ...o, method: "PUT", body });
export const del = (p, o) => api(p, { ...o, method: "DELETE" });

/** Format a number as Kenyan Shillings. */
export function ksh(n) {
  const v = Number(n || 0);
  return "KES " + v.toLocaleString("en-KE", { maximumFractionDigits: 0 });
}
