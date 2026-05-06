const AUTH_BASE = "https://dummyjson.com/auth";

/**
 * POST /auth/login
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<{ id, username, email, firstName, lastName, accessToken, refreshToken, image }>}
 */
export async function loginUser({ username, password }) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, expiresInMins: 30 }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Invalid credentials");
  }

  return res.json();
}
