function getApiBase() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  const hostname = window.location.hostname || "localhost";
  const backendHost = hostname === "127.0.0.1" ? "localhost" : hostname;
  const protocol = window.location.protocol === "https:" ? "https:" : "http:";

  if (window.location.port === "5001") {
    return "/api";
  }

  return `${protocol}//${backendHost}:5001/api`;
}

const API_BASE = getApiBase();

function parseJson(value, fallback = null) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function responseMessage(text) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

export function getStoredAuth() {
  const token = localStorage.getItem("circlioToken");
  const user = parseJson(localStorage.getItem("circlioUser"));

  if (!token || !user) {
    return { token: null, user: null };
  }

  return {
    token,
    user
  };
}

export function storeAuth(token, user) {
  localStorage.setItem("circlioToken", token);
  localStorage.setItem("circlioUser", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("circlioToken");
  localStorage.removeItem("circlioUser");
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("circlioToken");
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
  } catch (error) {
    throw new Error("Cannot reach the backend. Start the Express server on port 5001 and accept the local HTTPS certificate if prompted.");
  }

  const text = await response.text();
  const data = parseJson(text, text ? { message: responseMessage(text) } : {});

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}
