function getApiBase() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  const hostname = window.location.hostname || "localhost";
  const backendHost = hostname === "127.0.0.1" ? "localhost" : hostname;

  return `http://${backendHost}:5001/api`;
}

const API_BASE = getApiBase();

export function getStoredAuth() {
  return {
    token: localStorage.getItem("circlioToken"),
    user: JSON.parse(localStorage.getItem("circlioUser") || "null")
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
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}
